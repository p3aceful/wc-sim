export type TimerCallback = (deltaTime: number) => void
export class Timer {
  private accumulatedTime: number = 0
  private isRunning: boolean = false
  private lastTime: number = 0
  private tickRate: number
  private requestAnimationFrameId: number | null = null
  private callback: TimerCallback

  constructor(tickRate: number, callback: TimerCallback) {
    this.tickRate = tickRate
    this.callback = callback
  }

  start() {
    this.isRunning = true
    this.accumulatedTime = 0
    this.lastTime = 0
    this.requestAnimationFrameId = requestAnimationFrame(this.run.bind(this))
  }

  run(timestamp: number) {
    this.accumulatedTime += timestamp - this.lastTime

    let updateCounter = 0
    while (this.accumulatedTime >= this.tickRate) {
      this.callback(this.tickRate)
      this.accumulatedTime -= this.tickRate

      if (++updateCounter >= 240) {
        this.accumulatedTime = 0
        break
      }
    }

    this.lastTime = timestamp
    if (this.isRunning) {
      this.requestAnimationFrameId = requestAnimationFrame(this.run.bind(this))
    }
  }

  stop() {
    this.isRunning = false
    if (this.requestAnimationFrameId) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
    }
  }
}
