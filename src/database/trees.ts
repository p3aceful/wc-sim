export type WoodcuttingTree = {
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

export const trees: WoodcuttingTree[] = [
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
    baseCutChanceLevelMultiplier: 0.003,
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
  {
    id: 'redwoodTree',
    name: 'Redwood tree',
    requiredLevel: 90,
    baseCutChance: 0.0273,
    baseCutChanceLevelMultiplier: 0.00005,
    grantsXp: 380,
    grantsItem: {
      id: 'redwoodLog',
      amount: 1,
    },
    asset: 'https://oldschool.runescape.wiki/images/Redwood.png?9c38f',
  },
]
