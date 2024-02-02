export type FiremakingLog = {
  itemId: string
  requiredLevel: number
  xp: number
}

export const firemakingLogs: FiremakingLog[] = [
  {
    itemId: 'log',
    requiredLevel: 1,
    xp: 40,
  },
  {
    itemId: 'oakLog',
    requiredLevel: 15,
    xp: 60,
  },
  {
    itemId: 'willowLog',
    requiredLevel: 30,
    xp: 90,
  },
  {
    itemId: 'mapleLog',
    requiredLevel: 45,
    xp: 135,
  },
  {
    itemId: 'yewLog',
    requiredLevel: 60,
    xp: 202.5,
  },
  {
    itemId: 'magicLog',
    requiredLevel: 75,
    xp: 303.8,
  },
  {
    itemId: 'redwoodLog',
    requiredLevel: 90,
    xp: 350,
  },
]
