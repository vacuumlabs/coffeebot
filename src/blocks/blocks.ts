import {Button, HomeView, SectionBlock} from '@slack/bolt'
import {
  getActionsBlock,
  getButton,
  getContextBlock,
  getDividerBlock,
  getHeaderBlock,
  getInputBlock,
  getSectionBlock,
  getSectionBlockWithButton,
} from './basicBlockHelpers'

import {
  ACTIONS,
  COFFEE_INPUT_ACTION_ID,
  COFFEE_INPUT_BLOCK_ID,
  LOCATION_INPUT_ACTION_ID,
  LOCATION_INPUT_BLOCK_ID,
  RISO_ID,
  SIMA_ID,
  STEPS,
} from '../constants'
import {State} from '../state'

export const formatStateForBaristas = ({coffee, location}: Pick<State, 'coffee' | 'location'>) =>
  `Coffee: ${coffee || '<missing coffee info>'}\nLocation: ${location || '<missing location info>'}`

export const formatStateForSummary = ({coffee, location}: Pick<State, 'coffee' | 'location'>) =>
  `Coffee: ${coffee || '<missing coffee info>'}${location ? `\nLocation: ${location}` : ''}`

const CANCEL_BUTTON: Button = getButton({
  action_id: ACTIONS.cancel,
  text: 'Cancel',
  style: 'danger',
})

export const NON_MANAGER_HOME: HomeView['blocks'] = [
  getSectionBlock(
    `:mechanic: Sorry, the bot is still in the development. :wrench: Try again later. :coffeeparrot:\nIf you want to know more, contact <@${RISO_ID}>.`,
  ),
]

const coffeeBotInfoBlocks: HomeView['blocks'] = [
  getHeaderBlock('CoffeeBot'),
  getSectionBlock('You can order a coffee through this interface and it will be delivered to your desk.'),
  getContextBlock('This is currently available only in BA office.'),
  getSectionBlock(`In case of any issues, contact <@${RISO_ID}> or <@${SIMA_ID}>.`),
  getDividerBlock(),
]

const getOrderSummaryBlocks = (state: State): SectionBlock[] => [
  getSectionBlock('*ORDER SUMMARY:*'),
  getSectionBlock(formatStateForSummary(state)),
]

export const getStartBlocks = (error?: boolean): HomeView['blocks'] => [
  ...coffeeBotInfoBlocks,
  ...(error
    ? [
        getSectionBlockWithButton(
          `:warning: An error occurred, probably due to a timeout (bot restarted itself in the meantime). Try again.`,
          {
            action_id: ACTIONS.cancel_error,
            text: 'Dismiss error',
          },
        ),
        getDividerBlock(),
      ]
    : []),
  getHeaderBlock('Welcome to CoffeeBot!'),
  getSectionBlock('Please make an order and the coffee will be delivered to you :slightly_smiling_face:.'),
  getActionsBlock({
    block_id: STEPS.start,
    elements: [
      getButton({
        action_id: ACTIONS.start,
        text: 'Start',
        style: 'primary',
      }),
    ],
  }),
]

export const getCoffeeBlocks = (state: State): HomeView['blocks'] => [
  ...coffeeBotInfoBlocks,
  getInputBlock({
    block_id: COFFEE_INPUT_BLOCK_ID,
    text: 'What kind of coffee would you like?',
    action_id: COFFEE_INPUT_ACTION_ID,
  }),
  getActionsBlock({
    block_id: STEPS.coffee,
    elements: [
      getButton({
        action_id: ACTIONS.coffee_submit,
        text: 'Next',
      }),
      CANCEL_BUTTON,
    ],
  }),
]

export const getLocationBlocks = (state: State): HomeView['blocks'] => [
  ...coffeeBotInfoBlocks,
  ...getOrderSummaryBlocks(state),
  getInputBlock({
    block_id: LOCATION_INPUT_BLOCK_ID,
    text: 'Where do you want the coffee to be delivered to?',
    action_id: LOCATION_INPUT_ACTION_ID,
  }),
  getActionsBlock({
    block_id: STEPS.location,
    elements: [
      getButton({
        action_id: ACTIONS.location_submit,
        text: 'Next',
      }),
      CANCEL_BUTTON,
    ],
  }),
]

export const getConfirmationBlocks = (state: State): HomeView['blocks'] => [
  ...coffeeBotInfoBlocks,
  ...getOrderSummaryBlocks(state),
  getSectionBlock('Please confirm your order:'),
  getActionsBlock({
    block_id: STEPS.confirmation,
    elements: [
      getButton({
        action_id: ACTIONS.confirmation,
        text: 'Finish order',
        style: 'primary',
      }),
      CANCEL_BUTTON,
    ],
  }),
]

export const getDoneBlocks = (state: State): HomeView['blocks'] => [
  ...coffeeBotInfoBlocks,
  ...getOrderSummaryBlocks(state),
  getSectionBlock('Your coffee will arrive shortly. :coffee: You will be notified when your order gets accepted.'),
  getActionsBlock({
    block_id: STEPS.done,
    elements: [
      getButton({
        action_id: ACTIONS.done,
        text: 'Done',
      }),
    ],
  }),
]

export const getBlocks = (state: State): HomeView['blocks'] => {
  switch (state.step) {
    case STEPS.start:
      return getStartBlocks()
    case STEPS.coffee:
      return getCoffeeBlocks(state)
    case STEPS.location:
      return getLocationBlocks(state)
    case STEPS.confirmation:
      return getConfirmationBlocks(state)
    case STEPS.done:
      return getDoneBlocks(state)
  }
}
