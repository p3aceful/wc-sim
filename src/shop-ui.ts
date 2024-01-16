import { Bank } from './bank'
import { EventBus } from './events'
import { Shop, ShopEvents } from './shop'
import { items as itemsDB } from './database/items'

export class ShopUI {
  constructor(
    private root: HTMLElement,
    private bank: Bank,
    private shop: Shop,
    private events: EventBus<ShopEvents>
  ) {
    this.mount()
    this.events.subscribe('shopChange', () => {
      this.update()
    })
  }

  mount() {
    const header = document.createElement('h2')
    header.innerText = 'Shop'
    this.root.appendChild(header)
    const shopContainer = document.createElement('div')
    shopContainer.classList.add('shop-grid')
    this.root.appendChild(shopContainer)
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

    document.addEventListener('click', (event) => {
      const popover = this.root.querySelector('#popover')
      if (popover && !popover.contains(event.target as Node)) {
        popover.remove()
      }
    })
  }

  closePopover() {
    const popover = this.root.querySelector('#popover')
    if (popover) {
      popover.remove()
    }
  }

  openPopover(target: HTMLElement) {
    const existingPopover = document.querySelector('#popover')
    if (existingPopover) {
      existingPopover.remove()
    }

    const item = itemsDB.get(target.dataset.itemId!)
    if (!item) {
      throw new Error(`Item ${target.dataset.itemId} not found`)
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
    popover.innerHTML = `
      <div style="font-size:0.9rem;">${target.title}</div>
      <div style="font-size:0.75rem;">Price: ${item.buyPrice}</div>

      <div style="display:flex;flex-direction:column;gap:1rem;">
      ${item.buyable ? '<button class="shop-item__button">Buy</button>' : ''}
      </div>
    `
    this.root.appendChild(popover)
    const button = popover.querySelector<HTMLButtonElement>('.shop-item__button')
    if (button) {
      button.addEventListener('click', () => {
        const itemId = target.dataset.itemId!
        const amount = 1
        this.shop.buyItem(itemId, amount, this.bank)
        this.closePopover()
      })
    }
  }

  update() {
    const items = this.shop.getItems()
    const itemsList = items.map((item) => {
      const dbItem = itemsDB.get(item.itemId)

      if (!dbItem) {
        throw new Error(`Item ${item.itemId} not found`)
      }

      const element = document.createElement('button')
      element.classList.add('shop-item')
      element.dataset.itemId = item.itemId
      element.dataset.slot = 'true'
      element.title = `${dbItem.name}`
      element.innerHTML = `
        <img src="${dbItem.asset}" class="shop-item__img" style="pointer-events:none" />
        <div class="shop-item__quantity">${item.amount}</div>
      `
      return element
    })

    const shopContainer = this.root.querySelector('.shop-grid')

    if (!shopContainer) {
      throw new Error(`Shop container not found`)
    }

    shopContainer.innerHTML = ''
    shopContainer.append(...itemsList)
  }
}
