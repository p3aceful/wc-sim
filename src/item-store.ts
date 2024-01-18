export type ItemQuantity = {
  itemId: string
  amount: number
}

export class ItemStore {
  private items: ItemQuantity[] = []
  constructor(initialItems: ItemQuantity[]) {
    this.items = initialItems
  }

  insert(itemId: string, quantity: number) {
    const existingItem = this.items.find((item) => item.itemId === itemId)

    if (existingItem) {
      existingItem.amount += quantity
    } else {
      this.items.push({
        itemId,
        amount: quantity,
      })
    }
  }

  remove(itemId: string, quantity: number) {
    const existingItem = this.items.find((item) => item.itemId === itemId)

    if (!existingItem) {
      throw new Error(`Item ${itemId} not found`)
    }

    if (existingItem.amount < quantity) {
      throw new Error(`Not enough ${itemId}`)
    }

    existingItem.amount -= quantity

    if (existingItem.amount === 0) {
      this.items = this.items.filter((item) => item.itemId !== itemId)
    }
  }

  hasItem(itemId: string) {
    return this.hasQuantity(itemId, 1)
  }

  hasQuantity(itemId: string, quantity: number) {
    const existingItem = this.items.find((item) => item.itemId === itemId)

    if (!existingItem) {
      return false
    }

    return existingItem.amount >= quantity
  }

  getQuantity(itemId: string) {
    const itemQuantity = this.items.find((itemQuantity) => itemQuantity.itemId === itemId)
    return itemQuantity ? itemQuantity.amount : 0
  }

  getItems() {
    return this.items
  }
}
