import { Shop } from './shop'
import { getAssetForItem, items as itemsDB } from './database/items'
import { BaseUI } from './base-ui'
import { Player } from './player'

export class ShopUI {
  private ui: BaseUI

  constructor(private root: HTMLElement, private player: Player, private shop: Shop) {
    this.ui = new BaseUI(
      root,
      (target) => {
        return target.dataset.slot === 'true'
      },
      (target) => {
        const itemId = target.dataset.itemId!
        const item = itemsDB.get(itemId)

        if (!item) {
          throw new Error(`Item ${itemId} not found`)
        }

        const buttons = []

        if (item.buyable) {
          const buyButton = document.createElement('button')
          buyButton.id = 'buy'
          buyButton.classList.add('shop-item__button')
          buyButton.textContent = `Buy 1`
          buttons.push(buyButton)

          buyButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const itemId = item.id
            const amount = 1
            this.shop.buyItem(itemId, amount, this.player)
            this.ui.closePopover()
          })

          const buyAllButton = document.createElement('button')
          buyAllButton.id = 'buyAll'
          buyAllButton.classList.add('shop-item__button')
          buyAllButton.textContent = `Buy all`
          buttons.push(buyAllButton)
          buyAllButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const itemId = item.id
            this.shop.buyAllItem(itemId, this.player)
            this.ui.closePopover()
          })
        }

        const cancelButton = document.createElement('button')
        cancelButton.id = 'cancel'
        cancelButton.classList.add('bank-item__button')
        cancelButton.textContent = `Cancel`
        buttons.push(cancelButton)
        cancelButton.addEventListener('click', (event) => {
          event.stopPropagation()
          this.ui.closePopover()
        })

        const content = document.createElement('div')

        const header = document.createElement('span')
        header.textContent = item.name
        content.appendChild(header)

        const price = document.createElement('span')
        price.textContent = `Price ${item.buyPrice}gp`
        content.appendChild(price)

        buttons.forEach((button) => {
          content.appendChild(button)
        })
        return content
      }
    )
    this.mount()
    this.shop.on('shopChange', () => {
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
        <img src="${getAssetForItem(
          dbItem,
          item.amount
        )}" class="shop-item__img" style="pointer-events:none" />
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
