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
