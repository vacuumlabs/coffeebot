import {Step, STEPS} from './constants'

export type State = {
  step: Step
  coffee?: string
  location?: string
}

// map of users to the state
// `State | undefined` to provide type safety when accessing
type UsersState = Record<string, State | undefined>

export const usersState: UsersState = {}

export const resetState = (userId: string) => {
  usersState[userId] = {step: STEPS.start}
}
