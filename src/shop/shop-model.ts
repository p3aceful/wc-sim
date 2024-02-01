import { COINS_ITEM_ID, getItemById } from '../database/items'
import { Evented } from '../events'
import { ItemQuantity, ItemStore } from '../item-store'
import { Player } from '../player'
import { Toaster } from '../toaster'

export interface ShopEvents {
  shopChange: null
}

export class ShopModel extends Evented<ShopEvents> {
  private store: ItemStore

  constructor(private id: string, private name: string, initialItems: ItemQuantity[]) {
    super()
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
    this.notify('shopChange', null)
  }

  removeItem(itemId: string, quantity: number) {
    this.store.remove(itemId, quantity)
    this.notify('shopChange', null)
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

  buyItem(itemId: string, quantity: number, player: Player) {
    if (!this.hasItem(itemId)) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    const itemData = getItemById(itemId)
    const toaster = Toaster.getInstance()
    if (!itemData.buyable) {
      toaster.toast(`${itemData.name} cannot be bought`)
      return
    }

    const inventory = player.getInventory()

    const totalPrice = itemData.buyPrice * quantity
    const playerCoins = inventory.getQuantity(COINS_ITEM_ID)

    if (playerCoins < totalPrice) {
      toaster.toast(`Not enough coins`)
      return
    }

    if (!this.hasQuantity(itemId, quantity)) {
      toaster.toast(`Not enough items in stock`)
      return
    }

    inventory.remove(COINS_ITEM_ID, totalPrice)
    inventory.insert(itemId, quantity)
    this.removeItem(itemId, quantity)
  }

  buyAllItem(itemId: string, player: Player) {
    if (!this.hasItem(itemId)) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    const quantity = this.getQuantity(itemId)

    return this.buyItem(itemId, quantity, player)
  }
}
