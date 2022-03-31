import {App, RespondFn, SlackAction} from '@slack/bolt'
import {getSectionBlock} from './blocks/basicBlockHelpers'
import {formatStateForBaristas} from './blocks/blocks'

export const baristaActionHandler = async (
  client: App['client'],
  userIdToNotify: string,
  body: SlackAction,
  respond: RespondFn,
) => {
  await client.chat.postMessage({channel: userIdToNotify, text: 'Your order was accepted.'})

  const notificationText = `:white_check_mark: Accepted order from <@${userIdToNotify}> (user was notified):`

  const originalBlocks = body.type === 'block_actions' && body.message?.blocks
  const coffeeInfoBlock = originalBlocks?.[1] || getSectionBlock(formatStateForBaristas({}))

  await respond({
    blocks: [getSectionBlock(notificationText), coffeeInfoBlock],
    text: notificationText,
  })
}
