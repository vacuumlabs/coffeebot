import {App} from '@slack/bolt'
import dotenv from 'dotenv'
import {ACTIONS, MANAGERS_ID, Step, STEP_ARRAY} from './constants'
import {actionHandler} from './actionHandler'
import {resetState, usersState} from './state'
import {getStartBlocks, NON_MANAGER_HOME} from './blocks/blocks'
import {updateHome} from './updateHome'

// load env vars into process.env
dotenv.config()

// source: https://slack.dev/bolt-js/tutorial/getting-started#setting-up-your-project
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})

app.error(async (error) => {
  console.error(error.code, error.message, error.original?.message)
})

app.event('app_home_opened', async ({event, client}) => {
  try {
    const userId = event.user
    const tab = event.tab

    console.log('app_home_opened', 'user:', userId, 'tab:', tab)

    const managersResult = await client.conversations.members({channel: MANAGERS_ID})
    const managers = managersResult.members || []

    if (!managers.includes(userId)) {
      await updateHome(client, userId, NON_MANAGER_HOME)
      return
    }

    // don't do anything when accessing messages
    if (tab === 'messages') return

    // if we have state, trust that the right screen is already shown to the user
    if (usersState[userId]) return

    resetState(userId)

    await updateHome(client, userId, getStartBlocks())
  } catch (e) {
    console.error(e, JSON.stringify(event))
  }
})

app.action(/.*/, async ({action, ack, body, client}) => {
  try {
    console.log('action handler', 'user:', body?.user?.id)

    await ack()

    // just for typescript type narrowing
    if (!('action_id' in action)) return

    const userId = body.user.id
    const blockId = action.block_id
    const actionId = action.action_id

    console.log('action handler', 'block_id:', action.block_id, 'action_id:', action.action_id)

    const managersResult = await client.conversations.members({channel: MANAGERS_ID})
    const managers = managersResult.members || []

    if (!managers.includes(userId)) {
      await updateHome(client, userId, NON_MANAGER_HOME)
      return
    }

    const state = usersState[userId]

    if (!state) {
      resetState(userId)
      await updateHome(client, userId, getStartBlocks(true))
      return
    }

    if (actionId === ACTIONS.cancel_error) {
      await updateHome(client, userId, getStartBlocks())
      return
    }

    // makes the assertion below safe - don't handle blockIds that are not steps
    if (!STEP_ARRAY.includes(blockId)) {
      return
    }
    const blockStep = blockId as Step

    await actionHandler(client, userId, blockStep, actionId, state, body)
  } catch (e) {
    console.error(e, JSON.stringify(action), JSON.stringify(body))
  }
})
;(async () => {
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
