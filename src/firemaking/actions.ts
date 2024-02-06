import { FiremakingLog } from '../database/firemaking'
import { Evented } from '../events'
import { Action } from '../global-timer'
import { Player } from '../player'
import { Toaster } from '../toaster'

export interface IBurnLogAction extends Action {
  firemakingLog: FiremakingLog
}

export type BurnLogActionEvents = {
  logBurned: {
    logId: string
  }
}

export class BurnLogAction extends Evented<BurnLogActionEvents> implements IBurnLogAction {
  id: string
  firemakingLog: FiremakingLog
  completed: boolean = false
  private tickCount = 0

  constructor(log: FiremakingLog, private player: Player) {
    super()
    this.id = log.itemId
    this.firemakingLog = log
  }

  update(_deltaTime: number) {
    const toaster = Toaster.getInstance()
    const skills = this.player.getSkills()
    const inventory = this.player.getInventory()

    const hasRequiredLevel = skills.getLevel('firemaking') >= this.firemakingLog.requiredLevel
    const hasTinderbox = inventory.hasItem('tinderbox')
    const hasLog = inventory.hasItem(this.firemakingLog.itemId)

    if (!hasRequiredLevel) {
      toaster.toast(
        `You need level ${this.firemakingLog.requiredLevel} firemaking to burn this log`
      )
      this.completed = true
      return
    }

    if (!hasTinderbox) {
      toaster.toast('You need a tinderbox to burn this log')
      this.completed = true
      return
    }

    if (!hasLog) {
      toaster.toast('You do not have any logs of this type')
      this.completed = true
      return
    }

    if (this.tickCount >= 4) {
      this.tickCount = 0
      this.burn()
    }
    this.tickCount++
  }

  burn() {
    const skills = this.player.getSkills()
    const inventory = this.player.getInventory()

    const probability = this.calculateBurnChance(skills.getLevel('firemaking'))

    if (Math.random() < probability) {
      inventory.remove(this.firemakingLog.itemId, 1)
      skills.addXp('firemaking', this.firemakingLog.xp)
      Toaster.getInstance().toast('You burn the log.')
      this.notify('logBurned', { logId: this.firemakingLog.itemId })
    } else {
      Toaster.getInstance().toast('You failed to light the log.')
    }
  }

  calculateBurnChance(level: number) {
    const minLevel = 1
    const maxLevel = 99

    const minProbability = 65 / 256
    const maxProbability = 513 / 256

    const slope = (maxProbability - minProbability) / (maxLevel - minLevel)

    return Math.min(minProbability + slope * (level - minLevel), 1)
  }

  isComplete(): boolean {
    return this.completed
  }
}
