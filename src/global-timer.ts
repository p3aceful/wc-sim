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

export interface Action {
  id: string
  update(deltaTime: number): void
  isComplete(): boolean
}
