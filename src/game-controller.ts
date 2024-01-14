import { EventBus } from './events'

type TimerCallback = (deltaTime: number) => void

export class GlobalTimer {
  private callbacks: TimerCallback[] = []
  private intervalId: number | null = null
  private tickRate: number

  constructor(tickRate: number) {
    this.tickRate = tickRate
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        this.callbacks.forEach((callback) => callback(this.tickRate))
      }, this.tickRate)
    }
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  registerCallback(callback: TimerCallback) {
    this.callbacks.push(callback)
  }

  unregisterCallback(callback: TimerCallback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }
}

export type GameControllerEvents = {
  actionStart: Action
  actionStop: Action
}

export class GameController {
  private currentAction: Action | null = null
  constructor(
    private globalTimer: GlobalTimer,
    private gameControllerEvents: EventBus<GameControllerEvents>
  ) {}

  startAction(action: Action) {
    if (this.currentAction) {
      this.currentAction.stop()
    }
    this.currentAction = action
    this.currentAction.start()
    this.gameControllerEvents.notify('actionStart', action)
  }

  stopAction() {
    if (this.currentAction) {
      const action = this.currentAction
      this.currentAction.stop()
      this.currentAction = null
      this.gameControllerEvents.notify('actionStop', action)
    }
  }

  getCurrentAction() {
    return this.currentAction
  }
}

export interface Action {
  id: string
  start(): void
  stop(): void
}
