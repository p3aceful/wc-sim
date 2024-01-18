import { ItemQuantity as ItemQuantity } from './bank'
import { COINS_ITEM_ID, items as itemsDB } from './database/items'
import { EventBus } from './events'
import { Player } from './player'
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

  buyItem(itemId: string, quantity: number, player: Player): void {
    const item = this.items.find((item) => item.itemId === itemId)

    if (!item) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    const itemData = itemsDB.get(itemId)!

    if (!itemData) {
      throw new Error(`Unable ${itemId} to read item data`)
    }

    if (!itemData.buyable) {
      this.toaster.toast(`Item ${itemData.name} cannot be bought`)
      return
    }

    const bank = player.getBank()

    const totalPrice = itemData.buyPrice * quantity
    const playerCoins = bank.getAmount(COINS_ITEM_ID)

    if (playerCoins < totalPrice) {
      this.toaster.toast(`Not enough coins`)
      return
    }

    if (item.amount < quantity) {
      this.toaster.toast(`Not enough items in stock`)
      return
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

  buyAllItem(itemId: string, player: Player): void {
    const item = this.items.find((item) => item.itemId === itemId)
    if (!item) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    this.buyItem(itemId, item.amount, player)
  }

  // A method to sell all of a certain item in the bank
  sellItem(itemId: string, quantity: number, player: Player): void {
    const itemData = itemsDB.get(itemId)

    if (!itemData) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    if (!itemData.sellable) {
      this.toaster.toast(`Item ${itemData.name} cant be sold`)
      return
    }

    const totalPrice = itemData.sellPrice * quantity
    const playerBank = player.getBank()

    if (playerBank.getAmount(itemId) < quantity) {
      this.toaster.toast(`Not enough ${itemData.name} in bank to sell`)
      return
    }

    playerBank.withdraw(itemId, quantity)
    playerBank.insert(COINS_ITEM_ID, totalPrice)

    const existingShopItem = this.items.find((item) => item.itemId === itemId)
    if (!existingShopItem) {
      this.items.push({
        itemId,
        amount: quantity,
      })
    } else {
      existingShopItem.amount += quantity
    }

    this.events.notify('shopChange', null)
  }

  sellAllItem(itemId: string, player: Player): void {
    const bank = player.getBank()
    const quantity = bank.getAmount(itemId)
    this.sellItem(itemId, quantity, player)
  }

  on<T extends keyof ShopEvents>(event: T, handler: (data: ShopEvents[T]) => void) {
    this.events.subscribe(event, handler)
  }

  off<T extends keyof ShopEvents>(event: T, handler: (data: ShopEvents[T]) => void) {
    this.events.unsubscribe(event, handler)
  }
}
