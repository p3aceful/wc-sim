import { EventBus } from './events'
import { COINS_ITEM_ID, items } from './database/items'

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
    amount: 5,
  },
]
export class Bank {
  private items: ItemQuantity[] = []
  private events: EventBus<BankEvents>

  constructor(initialState: ItemQuantity[], events: EventBus<BankEvents>) {
    this.events = events
    this.items = initialState
  }

  insert(itemId: string, amount: number = 1) {
    const dbItem = items.get(itemId)

    if (!dbItem) {
      throw new Error(`Item ${itemId} not found`)
    }

    const itemQuantity = this.items.find((ia) => ia.itemId === itemId)

    if (itemQuantity) {
      itemQuantity.amount += amount
    } else {
      this.items.push({
        itemId,
        amount,
      })
    }

    this.events.notify('bankChange', null)
    this.events.notify('insertedItem', {
      itemId,
      amount,
    })
  }

  withdraw(itemId: string, amount: number = 1) {
    if (!items.get(itemId)) {
      throw new Error(`Item ${itemId} not found`)
    }

    const itemQuantity = this.items.find((itemQuantity) => itemQuantity.itemId === itemId)

    if (!itemQuantity) {
      throw new Error(`Item ${itemId} not found in bank`)
    }

    if (itemQuantity.amount === amount) {
      this.items = this.items.filter((itemQuantity) => itemQuantity.itemId !== itemId)
    } else if (itemQuantity.amount > amount) {
      itemQuantity.amount -= amount
    } else {
      this.items = this.items.filter((itemQuantity) => itemQuantity.itemId !== itemId)
    }

    this.events.notify('bankChange', null)
  }

  getAmount(itemId: string) {
    const itemQuantity = this.items.find((itemQuantity) => itemQuantity.itemId === itemId)
    return itemQuantity ? itemQuantity.amount : 0
  }

  getItems() {
    return this.items
  }

  hasItem(itemId: string) {
    return this.getAmount(itemId) > 0
  }
}
