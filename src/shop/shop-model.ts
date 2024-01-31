import { COINS_ITEM_ID, getItemById } from '../database/items'
import { EventBus } from '../events'
import { ItemQuantity, ItemStore } from '../item-store'
import { Player } from '../player'

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
  {
    itemId: 'dragonAxe',
    amount: 1,
  },
  {
    itemId: 'leatherBoots',
    amount: 1,
  },
]

export class ShopModel {
  private store: ItemStore

  constructor(
    private id: string,
    private name: string,
    initialItems: ItemQuantity[],
    private events: EventBus<ShopEvents>
  ) {
    this.store = new ItemStore(initialItems)
  }

  getName() {
    return this.name
  }

  getId() {
    return this.id
  }

  getItems() {
    return this.store.getItems()
  }

  insertItem(itemId: string, quantity: number) {
    this.store.insert(itemId, quantity)
    this.events.notify('shopChange', null)
  }

  removeItem(itemId: string, quantity: number) {
    this.store.remove(itemId, quantity)
    this.events.notify('shopChange', null)
  }

  hasItem(itemId: string) {
    return this.store.hasItem(itemId)
  }

  hasQuantity(itemId: string, quantity: number) {
    return this.store.hasQuantity(itemId, quantity)
  }

  getQuantity(itemId: string) {
    return this.store.getQuantity(itemId)
  }

  on<T extends keyof ShopEvents>(event: T, handler: (data: ShopEvents[T]) => void) {
    this.events.subscribe(event, handler)
  }

  off<T extends keyof ShopEvents>(event: T, handler: (data: ShopEvents[T]) => void) {
    this.events.unsubscribe(event, handler)
  }

  sellItem(itemId: string, quantity: number, player: Player): void {
    const item = getItemById(itemId)
    const totalPrice = item.sellPrice * quantity
    const inventory = player.getInventory()

    if (!item.sellable) {
      throw new Error(`Item ${item.name} cannot be sold`)
    }

    if (!inventory.hasQuantity(itemId, quantity)) {
      throw new Error(`Not enough items in inventory`)
    }

    inventory.remove(itemId, quantity)
    inventory.insert(COINS_ITEM_ID, totalPrice)

    this.insertItem(itemId, quantity)
  }

  sellAllItems(itemId: string, player: Player) {
    const item = getItemById(itemId)
    const inventory = player.getInventory()
    const quantity = inventory.getQuantity(itemId)

    if (!item.sellable) {
      throw new Error(`Item ${item.name} cannot be sold`)
    }

    if (!inventory.hasItem(itemId)) {
      throw new Error(`Item ${item.name} not found in inventory`)
    }

    this.sellItem(itemId, quantity, player)
  }
}
