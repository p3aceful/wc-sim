import { Bank, ItemQuantity as ItemQuantity } from './bank'
import { COINS_ITEM_ID, items as itemsDB } from './database/items'
import { EventBus } from './events'
import { Toaster } from './toaster'

export interface ShopEvents {
  shopChange: null
}

export const initialShopItems: ItemQuantity[] = [
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
]

export interface ShopItem extends ItemQuantity {}
export class Shop {
  private items: ShopItem[]

  constructor(
    initialItems: ItemQuantity[],
    private events: EventBus<ShopEvents>,
    private toaster: Toaster
  ) {
    this.items = initialItems
  }

  getItems() {
    return this.items
  }

  buyItem(itemId: string, quantity: number, bank: Bank): void {
    const item = this.items.find((item) => item.itemId === itemId)
    const itemData = itemsDB.get(itemId)!

    if (!item) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    if (!itemData.buyable) {
      throw new Error(`Item ${itemId} is not buyable`)
    }

    const totalPrice = itemData.buyPrice * quantity
    const playerCoins = bank.getAmount(COINS_ITEM_ID)

    if (playerCoins < totalPrice) {
      this.toaster.toast(`Not enough coins`)
      throw new Error(`Not enough coins`)
    }
    if (item.amount < quantity) {
      this.toaster.toast(`Not enough items in stock`)
      throw new Error(`Not enough items in stock`)
    }

    bank.withdraw(COINS_ITEM_ID, totalPrice)
    bank.insert(itemId, quantity)

    if (item.amount === quantity) {
      this.items = this.items.filter((item) => item.itemId !== itemId)
    } else {
      item.amount -= quantity
    }

    this.events.notify('shopChange', null)
  }

  sellItem(itemId: string, quantity: number, bank: Bank): void {
    const item = this.items.find((item) => item.itemId === itemId)
    const itemData = itemsDB.get(itemId)!

    if (!itemData.sellable) {
      this.toaster.toast(`Item ${itemId} is not sellable`)
      throw new Error(`Item ${itemId} is not sellable`)
    }

    const totalPrice = itemData.sellPrice * quantity

    if (bank.getAmount(itemId) < quantity) {
      this.toaster.toast(`Item ${itemId} not found in bank`)
      throw new Error(`Item ${itemId} not found in bank`)
    }

    bank.withdraw(itemId, quantity)
    bank.insert(COINS_ITEM_ID, totalPrice)

    if (!item) {
      this.items.push({
        itemId,
        amount: quantity,
      })
    } else {
      item.amount += quantity
    }

    this.events.notify('shopChange', null)
  }
}
