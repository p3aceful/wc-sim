import { getAssetForItem, getItemById } from '../database/items'
import { Evented } from '../events'
import { ContextMenu } from '../ui/context-menu'
import { EquippedItems } from './equipment-model'
export type EquipmentViewEvents = {
  unequip: { itemId: string; slot: keyof EquippedItems }
}

export class EquipmentView extends Evented<EquipmentViewEvents> {
  private root: HTMLElement
  private contextMenu: ContextMenu

  constructor(private parent: HTMLElement) {
    super()
    this.root = document.createElement('div')
    this.root.classList.add('equipment-grid')
    this.contextMenu = new ContextMenu(this.root)
    this.root.addEventListener('click', (event) => {
      if (
        event.target instanceof HTMLElement &&
        'equipmentSlot' in event.target.dataset &&
        event.target.dataset.itemId
      ) {
        const slot = event.target.dataset.equipmentSlot as keyof EquippedItems
        const item = getItemById(event.target.dataset.itemId!)
        this.contextMenu.show(
          item.name,
          event,
          [
            {
              id: 'unequip',
              name: 'Unequip',
            },
          ],
          () => this.notify('unequip', { itemId: item.id, slot })
        )
        event.stopPropagation()
      }
    })

    this.parent.appendChild(this.root)
  }

  render(equipment: EquippedItems) {
    this.root.innerHTML = ''

    const equipmentSlotIds = Object.keys(equipment) as (keyof EquippedItems)[]
    const slotElements = equipmentSlotIds.map((slotId) => {
      const element = document.createElement('div')
      element.classList.add('equipment-slot')
      element.classList.add('equipment-slot__' + slotId)
      element.dataset.equipmentSlot = slotId
      const itemId = equipment[slotId]
      if (itemId) {
        const item = getItemById(itemId)
        element.dataset.itemId = itemId
        element.innerHTML = `
          <img src="${getAssetForItem(
            item
          )}" style="pointer-events:none;display:block;width:100%;height:100%;object-fit:contain;">
        `
      } else {
        element.innerHTML = slotId
      }
      return element
    })

    this.root.append(...slotElements)
  }
}
