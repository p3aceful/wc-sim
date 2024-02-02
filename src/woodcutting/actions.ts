import { WoodcuttingTree } from '../database/woodcutting'
import { Action } from '../global-timer'
import { Player } from '../player'
import { Toaster } from '../toaster'

export const itemIsAxe = (itemId: string) => {
  return [
    'bronzeAxe',
    'ironAxe',
    'steelAxe',
    'blackAxe',
    'mithrilAxe',
    'adamantAxe',
    'runeAxe',
    'dragonAxe',
  ].includes(itemId)
}

export const getAxeCutChanceMultiplier = (axeId: string) => {
  switch (axeId) {
    case 'bronzeAxe':
      return 1
    case 'ironAxe':
      return 1.5
    case 'steelAxe':
      return 2
    case 'blackAxe':
      return 2.25
    case 'mithrilAxe':
      return 2.5
    case 'adamantAxe':
      return 2.95
    case 'runeAxe':
      return 3.5
    case 'dragonAxe':
      return 3.75
    default:
      return 1
  }
}

export const getAxeCutChanceLevelMultiplier = (axeId: string) => {
  switch (axeId) {
    case 'bronzeAxe':
      return 1
    case 'ironAxe':
      return 1.5
    case 'steelAxe':
      return 1.965
    case 'blackAxe':
      return 2.195
    case 'mithrilAxe':
      return 2.418
    case 'adamantAxe':
      return 2.716
    case 'runeAxe':
      return 2.9999
    case 'dragonAxe':
      return 3.703703784
    default:
      return 0
  }
}

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
    const skills = this.player.getSkills().getSkillSet()
    const equippedItem = equipment.getEquippedItem('weapon')
    const toaster = Toaster.getInstance()
    const hasRequiredLevel = skills.woodcutting.level >= this.tree.requiredLevel

    if (!hasRequiredLevel) {
      this.completed = true
      toaster.toast(`You need level ${this.tree.requiredLevel} woodcutting to chop this tree`)
      this.completed = true
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
    const probability = this.calculateChopChance(skills.getSkillSet().woodcutting.level, axeId)

    if (Math.random() < probability) {
      skills.addXp('woodcutting', this.tree.grantsXp)
      const { id, amount } = this.tree.grantsItem
      this.player.getInventory().insert(id, amount)

      // Give the player a small chance to receive a birds nest.
      if (Math.random() < 1 / 512) {
        this.player.getInventory().insert('birdNest', 1)
      }
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
