import {App, RespondFn, SlackAction} from '@slack/bolt'
import {getSectionBlock} from './blocks/basicBlockHelpers'
import {formatStateForBaristas} from './blocks/blocks'

export const baristaActionHandler = async (
  client: App['client'],
  userIdToNotify: string,
  body: SlackAction,
  respond: RespondFn,
) => {
  const originalBlocks = body.type === 'block_actions' && body.message?.blocks
  const coffeeInfoBlock = originalBlocks?.[1] || getSectionBlock(formatStateForBaristas({}))

  const userNotificationText = `:coffee: Your order was accepted by the baristas:`

  await client.chat.postMessage({
    channel: userIdToNotify,
    blocks: [getSectionBlock(userNotificationText), coffeeInfoBlock],
    text: userNotificationText,
  })

  const notificationText = `:white_check_mark: Accepted order from <@${userIdToNotify}> (user was notified):`

  await respond({
    blocks: [getSectionBlock(notificationText), coffeeInfoBlock],
    text: notificationText,
  })
}
