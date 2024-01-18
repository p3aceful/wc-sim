import { ItemQuantity } from './bank'
import { EventBus } from './events'
import { ItemStore } from './item-store'

export type InventoryEvents = {
  inventoryChange: null
  insertedItem: ItemQuantity
}

export class Inventory {
  private items: ItemStore
  constructor(initialItems: ItemQuantity[], private events: EventBus<InventoryEvents>) {
    this.items = new ItemStore(initialItems)
  }

  insert(itemId: string, quantity: number) {
    this.items.insert(itemId, quantity)
    this.events.notify('insertedItem', { itemId, amount: quantity })
    this.events.notify('inventoryChange', null)
  }

  remove(itemId: string, quantity: number) {
    this.items.remove(itemId, quantity)
    this.events.notify('inventoryChange', null)
  }

  hasItem(itemId: string) {
    return this.items.hasItem(itemId)
  }

  hasQuantity(itemId: string, quantity: number) {
    return this.items.hasQuantity(itemId, quantity)
  }

  getQuantity(itemId: string) {
    return this.items.getQuantity(itemId)
  }

  getItems() {
    return this.items.getItems()
  }

  on<T extends keyof InventoryEvents>(event: T, handler: (data: InventoryEvents[T]) => void) {
    this.events.subscribe(event, handler)
  }

  off<T extends keyof InventoryEvents>(event: T, handler: (data: InventoryEvents[T]) => void) {
    this.events.unsubscribe(event, handler)
  }
}
