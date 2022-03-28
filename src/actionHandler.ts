import {App, SlackAction} from '@slack/bolt'

import {getStartBlocks, getBlocks} from './blocks/blocks'
import {getSectionBlock} from './blocks/basicBlockHelpers'

import {
  ACTIONS,
  FLOW,
  LOCATION_INPUT_ACTION_ID,
  LOCATION_INPUT_BLOCK_ID,
  RISO_ID,
  Step,
  STEPS,
  COFFEE_INPUT_BLOCK_ID,
  COFFEE_INPUT_ACTION_ID,
} from './constants'
import {resetState, State} from './state'
import {updateHome} from './updateHome'
import {notifyBaristas} from './notifyBaristas'

export const actionHandler = async (
  client: App['client'],
  userId: string,
  handledStep: Step,
  actionId: string,
  state: State,
  body: SlackAction,
) => {
  // TODO: members of management channel
  if (userId !== RISO_ID) {
    await updateHome(client, userId, [
      getSectionBlock(
        `:mechanic: Sorry, the bot is still in the development. :wrench: Try again later. :coffeeparrot:\nIf you want to know more, contact <@${RISO_ID}>.`,
      ),
    ])
    return
  }

  if (actionId === ACTIONS.cancel) {
    resetState(userId)

    // start again and return
    await updateHome(client, userId, getStartBlocks())
    return
  }

  // pre-update side effects
  switch (handledStep) {
    case STEPS.coffee:
      // type narrowing, shouldn't happen
      if (body.type !== 'block_actions') return

      state.coffee =
        body.view?.state?.values[COFFEE_INPUT_BLOCK_ID][COFFEE_INPUT_ACTION_ID].value || 'missing coffee info'
      break
    case STEPS.location:
      // type narrowing, shouldn't happen
      if (body.type !== 'block_actions') return

      state.location =
        body.view?.state?.values[LOCATION_INPUT_BLOCK_ID][LOCATION_INPUT_ACTION_ID].value || 'missing location info'
      break
    case STEPS.confirmation:
      // TODO: try-catch?
      await notifyBaristas(client, userId, state)
      break
  }

  // fetch next step from FLOW
  state.step = FLOW[handledStep]
  // fetch state-based blocks for the new state
  const blocks = getBlocks(state)

  // TODO: try-catch?
  await updateHome(client, userId, blocks)

  // post-update side effects
  switch (handledStep) {
    // after returning to the start screen, reset state
    case STEPS.done:
      resetState(userId)
      break
  }
}