import { Evented } from './events'
import { COINS_ITEM_ID, items } from './database/items'
import { Player } from './player'
import { ItemStore } from './item-store'

export type ItemQuantity = {
  itemId: string
  amount: number
}

export type BankEvents = {
  bankChange: null
  insertedItem: ItemQuantity
}

export const initialBankItems: ItemQuantity[] = [
  {
    itemId: COINS_ITEM_ID,
    amount: 20,
  },
]

export class Bank extends Evented<BankEvents> {
  private items: ItemStore

  constructor(initialState: ItemQuantity[]) {
    super()
    this.items = new ItemStore(initialState)
  }

  insert(itemId: string, amount: number = 1, player: Player) {
    const dbItem = items.get(itemId)

    if (!dbItem) {
      throw new Error(`Item ${itemId} not found`)
    }

    const inventory = player.getInventory()

    // Does the player have the item?
    if (!inventory.hasQuantity(itemId, amount)) {
      throw new Error(`Player does not have ${itemId}`)
    }

    inventory.remove(itemId, amount)
    this.items.insert(itemId, amount)

    this.notify('bankChange', null)
    this.notify('insertedItem', {
      itemId,
      amount,
    })
  }

  insertAll(itemId: string, player: Player) {
    const quantity = player.getInventory().getQuantity(itemId)

    if (quantity === 0) {
      throw new Error(`Item ${itemId} not found in inventory`)
    }

    this.insert(itemId, quantity, player)
  }

  withdraw(itemId: string, amount: number = 1, player: Player) {
    if (!items.get(itemId)) {
      throw new Error(`Item ${itemId} not found`)
    }

    if (this.items.hasQuantity(itemId, amount) === false) {
      throw new Error(`Item ${itemId} not found in bank`)
    }

    const inventory = player.getInventory()

    // Put item in inventory
    inventory.insert(itemId, amount)

    // Remove item(s) from bank
    this.items.remove(itemId, amount)

    this.notify('bankChange', null)
  }

  withdrawAll(itemId: string, player: Player) {
    const quantity = this.items.getQuantity(itemId)

    if (quantity === 0) {
      throw new Error(`Item ${itemId} not found in bank`)
    }

    this.withdraw(itemId, quantity, player)
  }

  getQuantity(itemId: string) {
    return this.items.getQuantity(itemId)
  }

  getItems() {
    return this.items.getItems()
  }

  hasItem(itemId: string) {
    return this.items.hasItem(itemId)
  }
}
