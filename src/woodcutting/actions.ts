import { WoodcuttingTree } from '../database/trees'
import { Action } from '../global-timer'
import { Player } from '../player'
import { Toaster } from '../toaster'
import { getAxeCutChanceLevelMultiplier, getAxeCutChanceMultiplier, itemIsAxe } from './woodcutting'

export interface IChopTreeAction extends Action {
  tree: WoodcuttingTree
}

export class ChopTreeAction implements IChopTreeAction {
  id: string
  tree: WoodcuttingTree
  completed: boolean = false

  private tickCount = 0
  constructor(tree: WoodcuttingTree, private player: Player) {
    this.id = tree.id
    this.tree = tree
    this.update = this.update.bind(this)
  }

  update(_deltaTime: number) {
    const equipment = this.player.getEquipment()
    const skills = this.player.getSkills().getSkills()
    const equippedItem = equipment.getEquippedItem('weapon')
    const toaster = Toaster.getInstance()
    const hasRequiredLevel = skills.woodcutting.level >= this.tree.requiredLevel

    if (!hasRequiredLevel) {
      this.completed = true
      toaster.toast(`You need level ${this.tree.requiredLevel} woodcutting to chop this tree`)
      return
    }

    if (equippedItem === null || !itemIsAxe(equippedItem)) {
      toaster.toast('You need an axe equipped to chop this tree')
      this.completed = true
      return
    }

    if (this.tickCount >= 4) {
      this.tickCount = 0
      this.chop(equippedItem)
    }

    this.tickCount++
  }

  chop(axeId: string) {
    const skills = this.player.getSkills()
    const probability = this.calculateChopChance(skills.getSkills().woodcutting.level, axeId)

    if (Math.random() < probability) {
      skills.addXp('woodcutting', this.tree.grantsXp)
      const { id, amount } = this.tree.grantsItem
      this.player.getInventory().insert(id, amount)
    }
  }

  calculateChopChance(playerLevel: number, axeId: string) {
    const axeCutChanceMultiplier = getAxeCutChanceMultiplier(axeId)
    const axeCutChanceLevelMultiplier = getAxeCutChanceLevelMultiplier(axeId)

    const baseCutChance = this.tree.baseCutChance * axeCutChanceMultiplier
    const cutChanceLevelMultiplier =
      this.tree.baseCutChanceLevelMultiplier * axeCutChanceLevelMultiplier

    const chance = baseCutChance + cutChanceLevelMultiplier * playerLevel
    return chance
  }

  isComplete(): boolean {
    return this.completed
  }
}
