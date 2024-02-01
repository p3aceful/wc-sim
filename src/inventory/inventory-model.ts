import { Evented } from '../events'
import { ItemQuantity, ItemStore } from '../item-store'

export type InventoryEvents = {
  inventoryChange: null
  insertedItem: ItemQuantity
}

export class InventoryModel extends Evented<InventoryEvents> {
  private items: ItemStore
  constructor(initialItems: ItemQuantity[]) {
    super()
    this.items = new ItemStore(initialItems)
  }

  insert(itemId: string, quantity: number) {
    this.items.insert(itemId, quantity)
    this.notify('insertedItem', { itemId, amount: quantity })
    this.notify('inventoryChange', null)
  }

  remove(itemId: string, quantity: number) {
    this.items.remove(itemId, quantity)
    this.notify('inventoryChange', null)
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
}
