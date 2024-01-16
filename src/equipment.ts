import { Bank } from './bank'
import { EventBus } from './events'

export interface Equipment {
  head: string | null
  // cape: string | null
  // neck: string | null
  // quiver: string | null
  weapon: string | null
  body: string | null
  // shield: string | null
  // legs: string | null
  // hands: string | null
  feet: string | null
  // ring: string | null
}

export const emptyEquipment: Equipment = {
  head: null,
  // cape: null
  // neck: null
  // quiver: null
  weapon: null,
  body: null,
  // shield: null
  // legs: null
  // hands: null
  feet: null,
  // ring: null
}

export type EquipmentSlot = keyof Equipment

export interface EquipmentEvents {
  equip: keyof Equipment
  unequip: keyof Equipment
}

export class PlayerEquipment {
  private equipment: Equipment = {
    head: null,
    weapon: null,
    body: null,
    feet: null,
  }

  constructor(
    initialEequipment: Equipment,
    private bank: Bank,
    private equipmentEvents: EventBus<EquipmentEvents>
  ) {
    this.equipment = initialEequipment
  }

  getEquipment() {
    return this.equipment
  }

  setEquipmentSlot(slot: keyof Equipment, itemId: string) {
    const bankHasItem = this.bank.hasItem(itemId)

    if (!bankHasItem) {
      throw new Error(`Item ${itemId} not found in bank`)
    }

    const existingItem = this.equipment[slot]

    if (existingItem) {
      this.bank.insert(existingItem, 1)
      this.equipmentEvents.notify('unequip', slot)
    }

    this.equipment[slot] = itemId
    this.equipmentEvents.notify('equip', slot)

    this.bank.withdraw(itemId, 1)
  }

  getEquipmentSlot(slot: keyof Equipment) {
    return this.equipment[slot]
  }

  unequipSlot(slot: EquipmentSlot) {
    const existingItem = this.equipment[slot]
    if (existingItem) {
      this.bank.insert(existingItem, 1)
    }

    this.equipment[slot] = null
    this.equipmentEvents.notify('unequip', slot)
  }

  getEquippedItems() {
    return Object.values(this.equipment)
  }

  isEquipped(itemId: string) {
    return this.getEquippedItems().includes(itemId)
  }

  getEquimentSlotIds(): EquipmentSlot[] {
    return Object.keys(this.equipment) as EquipmentSlot[]
  }

  getEquippedItemIdsExcept(slot: keyof Equipment) {
    return Object.keys(this.equipment).filter((s) => s !== slot)
  }

  getEquippedItemIdsExceptSlots(slots: (keyof Equipment)[]) {
    return Object.keys(this.equipment).filter((s) => !slots.includes(s as keyof Equipment))
  }
}
