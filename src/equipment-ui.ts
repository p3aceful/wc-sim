import { EquipmentEvents, EquipmentSlot, PlayerEquipment } from './equipment'
import { EventBus } from './events'
import { items as itemsDB } from './database/items'
export class EquipmentUI {
  constructor(
    private root: HTMLElement,
    private equipment: PlayerEquipment,
    private equipmentEvents: EventBus<EquipmentEvents>
  ) {
    this.mount()
    this.equipmentEvents.subscribe('equip', () => {
      this.update()
    })

    this.root.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return
      }
      if (event.target.dataset.slot && event.target.dataset.itemId) {
        this.openPopover(event.target)
        event.stopPropagation()
      }
    })
    // Close popover on click outside
    document.addEventListener('click', (event) => {
      const popover = this.root.querySelector('#popover')
      if (popover && !popover.contains(event.target as Node)) {
        popover.remove()
      }
    })
  }

  mount() {
    const header = document.createElement('h2')
    header.innerText = 'Equipment'
    this.root.append(header)
    this.root.style.position = 'relative'
    const equipmentGrid = document.createElement('div')
    equipmentGrid.classList.add('equipment-grid')
    this.root.append(equipmentGrid)
    this.update()
  }

  update() {
    const equipment = this.equipment.getEquipment()
    const slotElements = this.equipment.getEquimentSlotIds().map((slot) => {
      const element = document.createElement('div')
      element.classList.add('equipment-slot')
      element.classList.add('equipment-slot__' + slot)
      element.dataset.slot = 'true'
      element.dataset.equipmentSlot = slot
      const itemId = equipment[slot]
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

  openPopover(target: HTMLElement) {
    const existingPopover = this.root.querySelector('#popover')
    if (existingPopover) {
      existingPopover.remove()
    }

    const popover = document.createElement('div')
    popover.id = 'popover'
    popover.style.position = 'absolute'
    popover.style.left = `${target.offsetLeft + target.offsetWidth + 5}px`
    popover.style.top = `${target.offsetTop}px`
    popover.style.maxWidth = `${100}px`
    popover.style.backgroundColor = '#555'
    popover.style.color = 'yellow'
    popover.style.border = '1px solid black'
    popover.style.display = 'flex'
    popover.style.flexDirection = 'column'
    popover.style.justifyContent = 'center'
    popover.style.gap = '1rem'
    popover.style.padding = '1rem'
    popover.style.zIndex = '100'
    const itemName = target.dataset.itemName!
    popover.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1rem;">
      ${itemName}
      </div>
      <button id="unequip">Unequip</button>
    `
    this.root.append(popover)

    const unequipButton = popover.querySelector('#unequip')!
    unequipButton.addEventListener('click', () => {
      const equipmentSlot = target.dataset.equipmentSlot!
      this.equipment.unequipSlot(equipmentSlot as EquipmentSlot)
      this.update()
      popover.remove()
    })
  }
}
