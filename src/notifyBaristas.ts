import {App} from '@slack/bolt'
import {getActionsBlock, getButton, getSectionBlock} from './blocks/basicBlockHelpers'
import {formatStateForBaristas} from './blocks/blocks'
import {BARISTAS_ID} from './constants'
import {State} from './state'

export const notifyBaristas = async (client: App['client'], userId: string, state: State) => {
  const notificationText = `New order from <@${userId}>:`

  await client.chat.postMessage({
    channel: BARISTAS_ID,
    blocks: [
      getSectionBlock(`${notificationText}\n${formatStateForBaristas(state)}`),
      getActionsBlock({
        // TODO: handler for this block/action
        block_id: `baristas-${userId}`,
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
