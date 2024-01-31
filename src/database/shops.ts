import { ItemQuantity } from '../item-store'

type ShopData = {
  id: string
  name: string
  items: ItemQuantity[]
}

export const shops: ShopData[] = [
  {
    id: 'generalStore',
    name: 'General Store',
    items: [
      {
        itemId: 'leatherBoots',
        amount: 1,
      },
    ],
  },
  {
    id: 'axeShop',
    name: 'Axe Shop',
    items: [
      {
        itemId: 'bronzeAxe',
        amount: 1,
      },
      {
        itemId: 'ironAxe',
        amount: 1,
      },
      {
        itemId: 'steelAxe',
        amount: 1,
      },
      {
        itemId: 'mithrilAxe',
        amount: 1,
      },
      {
        itemId: 'adamantAxe',
        amount: 1,
      },
      {
        itemId: 'runeAxe',
        amount: 1,
      },
      {
        itemId: 'dragonAxe',
        amount: 1,
      },
    ],
  },
]
