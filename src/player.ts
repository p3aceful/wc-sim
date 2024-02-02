import { Bank } from './bank'
import { items as itemsDB } from './database/items'
import { Action } from './global-timer'
import { InventoryModel } from './inventory/inventory-model'
import { Evented } from './events'
import { SkillsModel } from './skills/skills-model'
import { EquipmentModel, EquipmentSlot } from './equipment/equipment-model'

export interface PlayerEvents {
  actionStart: Action
  actionStop: Action
}

export class Player extends Evented<PlayerEvents> {
  actionQueue: Action[] = []
  constructor(
    private skills: SkillsModel,
    private equipment: EquipmentModel,
    private bank: Bank,
    private inventory: InventoryModel
  ) {
    super()
  }

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
    this.notify('actionStart', action)
  }

  update(deltaTime: number) {
    const currentAction = this.actionQueue[0]

    if (currentAction) {
      currentAction.update(deltaTime)

      if (currentAction.isComplete()) {
        const completedAction = this.actionQueue.shift()
        if (completedAction) {
          this.notify('actionStop', completedAction)
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
    if (this.actionQueue.length === 0) {
      return
    }

    this.actionQueue.forEach((action) => {
      this.notify('actionStop', action)
    })

    this.actionQueue = []
  }

  getInventory() {
    return this.inventory
  }
}
