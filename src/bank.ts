import { EventBus } from './events'
import { items } from './database/items'

export type ItemAmount = {
  itemId: string
  amount: number
}

export type BankEvents = {
  bankChange: null
  insertedItem: ItemAmount
}

export class Bank {
  private items: ItemAmount[] = []
  private events: EventBus<BankEvents>

  constructor(initialState: ItemAmount[], events: EventBus<BankEvents>) {
    this.events = events
    this.items = initialState
  }

  insert(itemId: string, amount: number = 1) {
    const dbItem = items.get(itemId)

    if (!dbItem) {
      throw new Error(`Item ${itemId} not found`)
    }

    const itemAmount = this.items.find((ia) => ia.itemId === itemId)

    if (itemAmount) {
      itemAmount.amount += amount
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

    const itemAmount = this.items.find((itemAmount) => itemAmount.itemId === itemId)

    if (!itemAmount) {
      throw new Error(`Item ${itemId} not found in bank`)
    }

    if (itemAmount.amount === amount) {
      this.items = this.items.filter((itemAmount) => itemAmount.itemId !== itemId)
    } else if (itemAmount.amount > amount) {
      itemAmount.amount -= amount
    } else {
      this.items = this.items.filter((itemAmount) => itemAmount.itemId !== itemId)
    }

    this.events.notify('bankChange', null)
  }

  getAmount(itemId: string) {
    const itemAmount = this.items.find((itemAmount) => itemAmount.itemId === itemId)
    return itemAmount ? itemAmount.amount : 0
  }

  getItems() {
    return this.items
  }
}
