import { items as itemsDB } from '../database/items'
import { Player } from '../player'
import { BaseUI } from './base-ui'
import { defaultEquipmentCommands } from '../database/item-commands'
export class EquipmentUI {
  private ui: BaseUI
  constructor(private root: HTMLElement, private player: Player) {
    this.mount()

    this.ui = new BaseUI(
      root,
      (target) => {
        return target.dataset.slot === 'true' && target.dataset.itemId !== undefined
      },
      (target) => {
        const itemId = target.dataset.itemId!
        const item = itemsDB.get(itemId)

        if (!item) {
          throw new Error(`Item ${itemId} not found`)
        }

        const buttons: HTMLElement[] = []

        defaultEquipmentCommands
          .filter((command) => command.shouldBeVisible(item, { player }))
          .forEach((command) => {
            const button = document.createElement('button')
            button.id = command.id
            button.classList.add('equipment-item__button')
            button.textContent = command.name
            button.addEventListener('click', (event) => {
              event.stopPropagation()
              command.execute(item, { player })
              this.ui.closePopover()
            })
            buttons.push(button)
          })
        const content = document.createElement('div')
        const header = document.createElement('h3')
        header.innerText = item.name
        content.appendChild(header)
        content.append(...buttons)
        return content
      }
    )

    const playerEquipment = this.player.getEquipment()

    playerEquipment.on('equip', () => {
      this.update()
    })
    playerEquipment.on('unequip', () => {
      this.update()
    })
  }

  mount() {
    const header = document.createElement('h2')
    header.innerText = 'Equipment'
    this.root.append(header)
    const equipmentGrid = document.createElement('div')
    equipmentGrid.classList.add('equipment-grid')
    this.root.append(equipmentGrid)
    this.update()
  }

  update() {
    const equipment = this.player.getEquipment()
    const slotElements = equipment.getEquipmentSlotIds().map((slot) => {
      const element = document.createElement('div')
      element.classList.add('equipment-slot')
      element.classList.add('equipment-slot__' + slot)
      element.dataset.slot = 'true'
      element.dataset.equipmentSlot = slot
      const itemId = equipment.getEquippedItem(slot)
      const item = itemsDB.get(itemId!)
      if (item) {
        element.dataset.itemId = item.id
        element.dataset.itemName = item.name
        element.innerHTML = `
          <img src="${item.asset}" style="pointer-events:none;display:block;width:100%;height:100%;object-fit:contain;">
        `
      } else {
        element.innerHTML = slot
      }
      return element
    })
    const equipmentGrid = this.root.querySelector('.equipment-grid')!
    equipmentGrid.innerHTML = ''
    equipmentGrid.append(...slotElements)
  }
}
