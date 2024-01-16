import { EquipmentSlot } from '../equipment'

export type Item = {
  id: string
  name: string
  asset: string
  sellPrice: number
  buyPrice: number
  buyable: boolean
  sellable: boolean
  equipmentSlot?: EquipmentSlot
}

export const COINS_ITEM_ID = 'coin'
export const items = new Map<string, Item>([
  [
    COINS_ITEM_ID,
    {
      id: 'coin',
      name: 'Coins',
      asset: 'https://oldschool.runescape.wiki/images/Coins_detail.png?404bc',
      sellPrice: 0,
      buyPrice: 0,
      buyable: false,
      sellable: false,
    },
  ],
  [
    'log',
    {
      id: 'log',
      name: 'Log',
      asset: 'https://oldschool.runescape.wiki/images/Logs_detail.png?6c104',
      sellPrice: 1,
      buyPrice: 2,
      buyable: true,
      sellable: true,
    },
  ],
  [
    'oakLog',
    {
      id: 'oakLog',
      name: 'Oak log',
      asset: 'https://oldschool.runescape.wiki/images/Oak_logs_detail.png?d4b7f',
      sellPrice: 8,
      buyPrice: 12,
      buyable: true,
      sellable: true,
    },
  ],
  [
    'willowLog',
    {
      id: 'willowLog',
      name: 'Willow log',
      asset: 'https://oldschool.runescape.wiki/images/Willow_logs_detail.png?b9e7b',
      sellPrice: 16,
      buyPrice: 24,
      buyable: true,
      sellable: true,
    },
  ],
  [
    'mapleLog',
    {
      id: 'mapleLog',
      name: 'Maple log',
      asset: 'https://oldschool.runescape.wiki/images/Maple_logs_detail.png?e2b6b',
      sellPrice: 32,
      buyPrice: 48,
      buyable: true,
      sellable: true,
    },
  ],
  [
    'yewLog',
    {
      id: 'yewLog',
      name: 'Yew log',
      asset: 'https://oldschool.runescape.wiki/images/Yew_logs_detail.png?7e4d0',
      sellPrice: 64,
      buyPrice: 96,
      buyable: true,
      sellable: true,
    },
  ],
  [
    'magicLog',
    {
      id: 'magicLog',
      name: 'Magic log',
      asset: 'https://oldschool.runescape.wiki/images/Magic_logs_detail_animated.gif?78f04',
      sellPrice: 128,
      buyPrice: 192,
      buyable: true,
      sellable: true,
    },
  ],
  [
    'bronzeAxe',
    {
      id: 'bronzeAxe',
      name: 'Bronze axe',
      asset: 'https://oldschool.runescape.wiki/images/Bronze_axe_detail.png?d4b7f',
      sellPrice: 9,
      buyPrice: 16,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
  [
    'ironAxe',
    {
      id: 'ironAxe',
      name: 'Iron axe',
      asset: 'https://oldschool.runescape.wiki/images/Iron_axe_detail.png?d4b7f',
      sellPrice: 33,
      buyPrice: 56,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
  [
    'steelAxe',
    {
      id: 'steelAxe',
      name: 'Steel axe',
      asset: 'https://oldschool.runescape.wiki/images/Steel_axe_detail.png?d4b7f',
      sellPrice: 120,
      buyPrice: 200,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
  [
    'blackAxe',
    {
      id: 'blackAxe',
      name: 'Black axe',
      asset: 'https://oldschool.runescape.wiki/images/Black_axe_detail.png?d4b7f',
      sellPrice: 230,
      buyPrice: 384,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
  [
    'mithrilAxe',
    {
      id: 'mithrilAxe',
      name: 'Mithril axe',
      asset: 'https://oldschool.runescape.wiki/images/Mithril_axe_detail.png?d4b7f',
      sellPrice: 312,
      buyPrice: 520,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
  [
    'adamantAxe',
    {
      id: 'adamantAxe',
      name: 'Adamant axe',
      asset: 'https://oldschool.runescape.wiki/images/Adamant_axe_detail.png?d4b7f',
      sellPrice: 768,
      buyPrice: 1280,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
  [
    'runeAxe',
    {
      id: 'runeAxe',
      name: 'Rune axe',
      asset: 'https://oldschool.runescape.wiki/images/Rune_axe_detail.png?d4b7f',
      sellPrice: 7680,
      buyPrice: 12800,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
    },
  ],
])
