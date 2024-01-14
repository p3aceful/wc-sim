import { Bank } from '../bank'
import { Action, GlobalTimer } from '../game-controller'
import { PlayerSkills } from '../skills'

type WoodcuttingTree = {
  id: string
  name: string
  requiredLevel: number
  baseCutChance: number
  baseCutChanceLevelMultiplier: number
  grantsXp: number
  grantsItem: {
    id: string
    amount: number
  }
  asset?: string
}

const trees: WoodcuttingTree[] = [
  {
    id: 'normalTree',
    name: 'Normal tree',
    requiredLevel: 0,
    baseCutChance: 0.25,
    baseCutChanceLevelMultiplier: 0.00542,
    grantsXp: 25,
    grantsItem: {
      id: 'log',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Tree.png?dfbdb',
  },
  {
    id: 'oakTree',
    name: 'Oak tree',
    requiredLevel: 15,
    baseCutChance: 0.12,
    baseCutChanceLevelMultiplier: 0.002773,
    grantsXp: 37.5,
    grantsItem: {
      id: 'oakLog',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Oak_tree.png?240a0',
  },
  {
    id: 'willowTree',
    name: 'Willow tree',
    requiredLevel: 30,
    baseCutChance: 0.066,
    baseCutChanceLevelMultiplier: 0.00135,
    grantsXp: 67.5,
    grantsItem: {
      id: 'willowLog',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Willow_tree.png?42d4f',
  },
  {
    id: 'mapleTree',
    name: 'Maple tree',
    requiredLevel: 45,
    baseCutChance: 0.0377,
    baseCutChanceLevelMultiplier: 0.000646,
    grantsXp: 100,
    grantsItem: {
      id: 'mapleLog',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Maple_tree.png?1bf0b',
  },
  {
    id: 'yewTree',
    name: 'Yew tree',
    requiredLevel: 60,
    baseCutChance: 0.0214,
    baseCutChanceLevelMultiplier: 0.0003,
    grantsXp: 175,
    grantsItem: {
      id: 'yewLog',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Yew_tree.png?b2a07',
  },
  {
    id: 'magicTree',
    name: 'Magic tree',
    requiredLevel: 75,
    baseCutChance: 0.0108,
    baseCutChanceLevelMultiplier: 0.00017,
    grantsXp: 250,
    grantsItem: {
      id: 'magicLog',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Magic_tree.png?699f0',
  },
]

export interface IChopTreeAction extends Action {
  tree: WoodcuttingTree
}

export class ChopTreeAction implements IChopTreeAction {
  id: string
  tree: WoodcuttingTree
  private tickCount = 0
  constructor(
    private globalTimer: GlobalTimer,
    tree: WoodcuttingTree,
    private playerSkills: PlayerSkills,
    private bank: Bank
  ) {
    this.id = tree.id
    this.tree = tree
    this.tick = this.tick.bind(this)
  }

  start() {
    this.globalTimer.registerCallback(this.tick)
  }

  stop() {
    this.globalTimer.unregisterCallback(this.tick)
  }

  tick(deltaTime: number) {
    if (this.tickCount >= 4) {
      this.tickCount = 0
      this.chop()
    }
    this.tickCount++
  }

  chop() {
    const probability = this.calculateChopChance(this.playerSkills.getSkills().woodcutting.level)
    if (Math.random() < probability) {
      this.playerSkills.addXp('woodcutting', this.tree.grantsXp)
      const { id, amount } = this.tree.grantsItem
      this.bank.insert(id, amount)
    }
  }

  calculateChopChance(playerLevel: number) {
    const baseCutChance = this.tree.baseCutChance
    const cutChanceLevelMultiplier = this.tree.baseCutChanceLevelMultiplier

    const chance = baseCutChance + cutChanceLevelMultiplier * playerLevel
    return chance
  }
}

export const chopTreeActions = (globalTimer: GlobalTimer, playerSkills: PlayerSkills, bank: Bank) =>
  trees.map((tree) => new ChopTreeAction(globalTimer, tree, playerSkills, bank))
