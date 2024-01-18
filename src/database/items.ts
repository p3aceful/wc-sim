import { EquipmentSlot } from '../equipment'

export type Item = {
  id: string
  name: string
  asset: string
  additionalAssets?: { asset: string; minQuantity: number }[]
  sellPrice: number
  buyPrice: number
  buyable: boolean
  sellable: boolean
  equipmentSlot?: EquipmentSlot
  description: string
}

export const COINS_ITEM_ID = 'coin'
export const items = new Map<string, Item>([
  [
    COINS_ITEM_ID,
    {
      id: COINS_ITEM_ID,
      name: 'Coins',
      asset: 'https://oldschool.runescape.wiki/images/Coins_1.png?a3fa8',
      additionalAssets: [
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_2.png?24e5a&20200425081439',
          minQuantity: 2,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_3.png?08d80',
          minQuantity: 3,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_4.png?61b84',
          minQuantity: 4,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_5.png?4afbb',
          minQuantity: 5,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_25.png?cbfd9',
          minQuantity: 25,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_100.png?511f4',
          minQuantity: 100,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_250.png?c2755',
          minQuantity: 250,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_1000.png?978c8',
          minQuantity: 1000,
        },
        {
          asset: 'https://oldschool.runescape.wiki/images/Coins_detail.png?404bc',
          minQuantity: 10000,
        },
      ],
      sellPrice: 0,
      buyPrice: 0,
      buyable: false,
      sellable: false,
      description: 'Lovely money!',
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
      description: 'A number of wooden logs.',
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
      description: 'Logs cut from an oak tree.',
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
      description: 'Logs cut from a willow tree.',
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
      description: 'Logs cut from a maple tree.',
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
      description: 'Logs cut from a yew tree.',
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
      description: 'Logs cut from a magic tree.',
    },
  ],
  [
    'redwoodLog',
    {
      id: 'redwoodLog',
      name: 'Redwood log',
      asset: 'https://oldschool.runescape.wiki/images/Redwood_logs_detail.png?39387',
      sellPrice: 450,
      buyPrice: 270,
      buyable: true,
      sellable: true,
      description: 'Logs cut from a redwood tree.',
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
      description: "A woodcutter's axe.",
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
      description: "A woodcutter's axe.",
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
      description: "A woodcutter's axe.",
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
      description: 'A sinister looking axe.',
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
      description: 'A powerful axe.',
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
      description: 'A powerful axe.',
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
      description: 'A powerful axe.',
    },
  ],
  [
    'dragonAxe',
    {
      id: 'dragonAxe',
      name: 'Dragon axe',
      asset: 'https://oldschool.runescape.wiki/images/Dragon_axe_detail.png?d4b7f',
      sellPrice: 1500000,
      buyPrice: 2000000,
      buyable: true,
      sellable: true,
      equipmentSlot: 'weapon',
      description: 'A very powerful axe.',
    },
  ],
  [
    'leatherBoots',
    {
      id: 'leatherBoots',
      name: 'Leather Boots',
      asset: 'https://oldschool.runescape.wiki/images/Leather_boots_detail.png?8ab0a',
      sellPrice: 3,
      buyPrice: 6,
      buyable: true,
      sellable: true,
      equipmentSlot: 'feet',
      description: 'Comfortable leather boots.',
    },
  ],
])

export function getAssetForItem(item: Item, quantity: number = 1) {
  if (item.additionalAssets?.length) {
    const sortedAssets = [...item.additionalAssets, { asset: item.asset, minQuantity: 0 }].sort(
      (a, b) => b.minQuantity - a.minQuantity
    )
    const asset = sortedAssets.find((asset) => quantity >= asset.minQuantity)

    return asset ? asset.asset : item.asset
  } else {
    return item.asset
  }
}
