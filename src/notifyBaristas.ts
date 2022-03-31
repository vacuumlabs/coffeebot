import {App} from '@slack/bolt'
import {getActionsBlock, getButton, getSectionBlock} from './blocks/basicBlockHelpers'
import {formatStateForBaristas} from './blocks/blocks'
import {BARISTAS_BLOCK_ID_PREFIX, BARISTAS_ID} from './constants'
import {State} from './state'

export const notifyBaristas = async (client: App['client'], userId: string, state: State) => {
  const notificationText = `New order from <@${userId}>:`

  await client.chat.postMessage({
    channel: BARISTAS_ID,
    blocks: [
      // the structure here (3 blocks) is important because the data is parsed back later
      getSectionBlock(notificationText),
      getSectionBlock(formatStateForBaristas(state)),
      getActionsBlock({
        block_id: `${BARISTAS_BLOCK_ID_PREFIX}${userId}`,
        elements: [
          getButton({
            action_id: 'accept',
            text: 'Accept + send notification',
            // TODO: action value with userId?
          }),
          // TODO: dismiss? decline+notification?
        ],
      }),
    ],
    // used for notification
    text: notificationText,
  })
}
