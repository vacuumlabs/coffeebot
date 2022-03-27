export const RISO_ID = 'UBTKJ1F88'
export const SIMA_ID = 'U287WSCJW'
export const BARISTAS_ID = 'C037JMC5WNB'
export const MANAGERS_ID = 'C038BTQEH6V'

export const STEPS = {
  start: 'start',
  location: 'location',
  coffee: 'coffee',
  confirmation: 'confirmation',
  done: 'done',
} as const

export const STEP_ARRAY = Object.values(STEPS) as string[]

export type Step = keyof typeof STEPS

export const ACTIONS = {
  cancel: 'cancel',
  start: 'start',
  location_submit: 'location_submit',
  coffee_submit: 'note_submit',
  confirmation: 'submit',
  done: 'done',
  cancel_error: 'cancel_error',
}

export const FLOW: Record<Step, Step> = {
  start: STEPS.coffee,
  coffee: STEPS.location,
  location: STEPS.confirmation,
  confirmation: STEPS.done,
  done: STEPS.start,
}

export const COFFEE_INPUT_BLOCK_ID = 'coffee_block'
export const COFFEE_INPUT_ACTION_ID = 'coffee_action'
export const LOCATION_INPUT_BLOCK_ID = 'location_block'
export const LOCATION_INPUT_ACTION_ID = 'location_action'
