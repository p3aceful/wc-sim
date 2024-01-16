import { Bank, BankEvents } from './bank'
import { EventBus } from './events'
import { Shop } from './shop'
import { items as itemsDB } from './database/items'
import { PlayerEquipment } from './equipment'

export class BankUI {
  constructor(
    private root: HTMLElement,
    private bank: Bank,
    private shop: Shop,
    private equipment: PlayerEquipment,
    private events: EventBus<BankEvents>
  ) {
    // This should handle everything to do with the bank UI.
    // It should render the bank, and handle events from when the user clicks on the bank.
    // It should also handle events from the bank itself, like when the bank changes.
    this.mount()
    this.events.subscribe('bankChange', () => {
      this.update()
    })
  }

  mount() {
    const header = document.createElement('h2')
    header.innerText = 'Bank'
    this.root.appendChild(header)
    const bankContainer = document.createElement('div')
    bankContainer.classList.add('bank-grid')
    this.root.appendChild(bankContainer)
    this.update()

    this.root.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return
      }
      if (event.target.dataset.slot) {
        this.openPopover(event.target)
        event.stopPropagation()
      }
    })
    // Close popover on click outside
    document.addEventListener('click', (event) => {
      const popover = document.querySelector('#bankPopover')
      if (popover && !popover.contains(event.target as Node)) {
        popover.remove()
      }
    })
  }

  openPopover(target: HTMLElement) {
    const existingPopover = document.querySelector('#bankPopover')
    if (existingPopover) {
      existingPopover.remove()
    }

    const item = itemsDB.get(target.dataset.itemId!)
    if (!item) {
      throw new Error(`Item ${target.dataset.itemId} not found`)
    }
    const popover = document.createElement('div')
    popover.id = 'bankPopover'
    popover.style.position = 'absolute'
    popover.style.left = `${target.offsetLeft + target.offsetWidth + 5}px`
    popover.style.top = `${target.offsetTop}px`
    popover.style.width = `${target.offsetWidth}px`
    popover.style.backgroundColor = '#555'
    popover.style.color = 'yellow'
    popover.style.border = '1px solid black'
    popover.style.display = 'flex'
    popover.style.flexDirection = 'column'
    popover.style.justifyContent = 'center'
    popover.style.gap = '1rem'
    popover.style.padding = '1rem'
    popover.style.zIndex = '100'
    popover.innerHTML = `
      <div style="font-weight:bold;font-size:0.75rem;">${target.title}</div>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${item.sellable ? '<button id="sell" class="bank-item__button">Sell</button>' : ''}
        ${item.equipmentSlot ? '<button id="equip" class="bank-item__button">Equip</button>' : ''}
      </div>
    `
    this.root.appendChild(popover)
    const sellButton = popover.querySelector<HTMLButtonElement>('#sell')
    if (sellButton) {
      sellButton.addEventListener('click', (event) => {
        event.stopPropagation()
        const itemId = target.dataset.itemId!
        const amount = 1
        this.shop.sellItem(itemId, amount, this.bank)
      })
    }

    const equipButton = popover.querySelector<HTMLButtonElement>('#equip')
    if (equipButton) {
      equipButton.addEventListener('click', (event) => {
        event.stopPropagation()
        const itemId = target.dataset.itemId!
        this.equipment.setEquipmentSlot(item.equipmentSlot!, itemId)
        this.closePopover()
      })
    }
  }

  update() {
    const items = this.bank.getItems()
    const itemList = items.map((item) => {
      const dbItem = itemsDB.get(item.itemId)

      if (!dbItem) {
        throw new Error(`Item ${item.itemId} not found`)
      }
      const element = document.createElement('button')
      element.classList.add('bank-item')
      element.style.position = 'relative'
      element.title = dbItem.name
      element.dataset.slot = 'true'
      element.dataset.itemId = item.itemId
      element.innerHTML = `
        <img src="${dbItem.asset}" class="bank-item__img" style="pointer-events:none;">
        <span class="bank-item__quantity">${item.amount}</span>
      `

      return element
    })

    const container = this.root.querySelector('.bank-grid')!
    if (!container) {
      throw new Error(`Bank container not found`)
    }
    container.innerHTML = ''
    container.append(...itemList)
  }

  closePopover() {
    const popover = document.querySelector('#bankPopover')
    if (popover) {
      popover.remove()
    }
  }
}
