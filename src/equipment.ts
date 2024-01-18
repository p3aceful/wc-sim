import { EventBus, Listener } from './events'

export interface EquippedItems {
  head: string | null
  weapon: string | null
  body: string | null
  feet: string | null
}

export type EquipmentSlot = keyof EquippedItems

export type EquipmentEvents = {
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

export class Equipment {
  private events = new EventBus<EquipmentEvents>()

  private equipment: EquippedItems

  constructor(initialState: EquippedItems) {
    this.equipment = initialState
  }
  getEquipment() {
    return this.equipment
  }

  getEquippedItem(slot: EquipmentSlot): string | null {
    return this.equipment[slot] ?? null
  }

  equip(slot: EquipmentSlot, itemId: string): void {
    this.equipment[slot] = itemId
    this.events.notify('equip', { slot, itemId })
    this.events.notify('change', null)
  }

  unequip(slot: EquipmentSlot): void {
    const unequippedItem = this.equipment[slot]
    if (unequippedItem) {
      this.equipment[slot] = null
      this.events.notify('unequip', { slot, itemId: unequippedItem })
      this.events.notify('change', null)
    }
  }

  getEquipmentSlotIds(): EquipmentSlot[] {
    return Object.keys(this.equipment) as EquipmentSlot[]
  }

  on<K extends keyof EquipmentEvents>(event: K, callback: Listener<EquipmentEvents[K]>) {
    this.events.subscribe(event, callback)
  }

  off<K extends keyof EquipmentEvents>(event: K, callback: Listener<EquipmentEvents[K]>) {
    this.events.unsubscribe(event, callback)
  }
}
