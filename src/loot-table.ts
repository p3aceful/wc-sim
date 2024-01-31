import { ItemQuantity } from './item-store'

export type ItemWeight = ItemQuantity & { weight: number }

export class LootTable {
  private totalWeight: number
  private items: ItemWeight[]

  constructor(items: ItemWeight[]) {
    this.items = items
    this.totalWeight = items.reduce((acc, item) => acc + item.weight, 0)
  }

  pickItem(): ItemQuantity {
    const randomWeight = Math.random() * this.totalWeight
    let weightSum = 0

    for (const { itemId, amount, weight } of this.items) {
      weightSum += weight
      if (randomWeight <= weightSum) {
        return {
          itemId,
          amount,
        }
      }
    }

    throw new Error('Failed to pick item from loot table.')
  }
}
