import { Player } from '../player'
import { EquipmentModel, EquippedItems } from './equipment-model'
import { EquipmentView } from './equipment-view'

export class EquipmentController {
  private parent: HTMLElement
  private view: EquipmentView
  constructor(parent: HTMLElement, private equipment: EquipmentModel, private player: Player) {
    this.parent = parent
    this.view = new EquipmentView(this.parent)
    this.view.render(this.equipment.getEquippedItems())

    this.view.on('unequip', ({ slot }) => {
      this.player.unequip(slot as keyof EquippedItems)
    })

    this.equipment.on('change', () => {
      this.view.render(this.equipment.getEquippedItems())
    })
  }
}
