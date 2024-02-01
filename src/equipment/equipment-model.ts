import { Evented } from '../events'

export interface EquippedItems {
  head: string | null
  weapon: string | null
  body: string | null
  feet: string | null
}

export type EquipmentSlot = keyof EquippedItems

export type EquipmentModelEvents = {
  equip: { slot: EquipmentSlot; itemId: string }
  unequip: { slot: EquipmentSlot; itemId: string }
  change: null
}

export const emptyEquipment: EquippedItems = {
  head: null,
  weapon: null,
  body: null,
  feet: null,
}

export class EquipmentModel extends Evented<EquipmentModelEvents> {
  private equippedItems: EquippedItems

  constructor(initialEquipment: EquippedItems) {
    super()
    this.equippedItems = initialEquipment
  }

  getEquippedItems() {
    return this.equippedItems
  }

  getEquippedItem(slot: EquipmentSlot): string | null {
    return this.equippedItems[slot] ?? null
  }

  equip(slot: EquipmentSlot, itemId: string): void {
    this.equippedItems[slot] = itemId
    this.notify('equip', { slot, itemId })
    this.notify('change', null)
  }

  unequip(slot: EquipmentSlot): void {
    const unequippedItem = this.equippedItems[slot]
    if (unequippedItem) {
      this.equippedItems[slot] = null
      this.notify('unequip', { slot, itemId: unequippedItem })
      this.notify('change', null)
    }
  }

  getEquipmentSlotIds(): EquipmentSlot[] {
    return Object.keys(this.equippedItems) as EquipmentSlot[]
  }
}
