import { Bank } from './bank'
import { PlayerSkills } from './skills'
import { items as itemsDB } from './database/items'
import { Action } from './global-timer'
import { EventBus } from './events'
import { Equipment, EquipmentSlot } from './equipment'
import { Inventory } from './inventory'

export interface PlayerEvents {
  actionStart: Action
  actionStop: Action
}

export class Player {
  actionQueue: Action[] = []
  events = new EventBus<PlayerEvents>()
  constructor(
    private skills: PlayerSkills,
    private equipment: Equipment,
    private bank: Bank,
    private inventory: Inventory
  ) {}

  equip(itemId: string) {
    const item = itemsDB.get(itemId)!
    const slot = item.equipmentSlot

    if (!slot) {
      throw new Error(`Item ${itemId} is not equippable`)
    }

    if (!this.inventory.hasItem(itemId)) {
      throw new Error(`Item ${itemId} not found in bank`)
    }

    const equippedItem = this.equipment.getEquippedItem(slot)

    if (equippedItem) {
      this.inventory.insert(equippedItem, 1)
      this.equipment.unequip(slot)
    }

    this.equipment.equip(slot, itemId)
    this.inventory.remove(itemId, 1)
  }

  unequip(slot: EquipmentSlot) {
    const equippedItem = this.equipment.getEquippedItem(slot)

    if (equippedItem) {
      this.inventory.insert(equippedItem, 1)
    }

    this.equipment.unequip(slot)
  }

  startAction(action: Action) {
    this.actionQueue = [action]
    this.events.notify('actionStart', action)
  }

  update(deltaTime: number) {
    const currentAction = this.actionQueue[0]

    if (currentAction) {
      currentAction.update(deltaTime)

      if (currentAction.isComplete()) {
        const completedAction = this.actionQueue.shift()
        if (completedAction) {
          this.events.notify('actionStop', completedAction)
        }
      }
    }
  }

  getSkills() {
    return this.skills
  }

  getBank() {
    return this.bank
  }

  getEquipment() {
    return this.equipment
  }

  getCurrentActionId(): string | null {
    return this.actionQueue[0]?.id ?? null
  }

  stopAction() {
    this.actionQueue = []
  }

  getEvents() {
    return this.events
  }

  getInventory() {
    return this.inventory
  }
}
