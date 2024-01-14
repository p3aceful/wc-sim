import { Action } from '../game-controller'

export type TreeType = {
  name: string
  requiredLevel: number
  action: Action
}

export type WoodcuttingActionEvents = {
  tick: null
}
