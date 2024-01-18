import { Shop } from '../shop'
import { getAssetForItem, items as itemsDB } from '../database/items'
import { BaseUI } from './base-ui'
import { Player } from '../player'
import { defaultShopItemCommands } from '../database/item-commands'
import { Toaster } from '../toaster'

export class ShopUI {
  private ui: BaseUI

  constructor(
    private root: HTMLElement,
    private player: Player,
    private shop: Shop,
    private toaster: Toaster
  ) {
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

        const buttons: HTMLElement[] = []

        const content = document.createElement('div')
        const header = document.createElement('span')
        header.textContent = item.name
        content.appendChild(header)

        defaultShopItemCommands
          .filter((command) =>
            command.shouldBeVisible(item, {
              shop: this.shop,
              player: this.player,
              toaster: this.toaster,
            })
          )
          .forEach((command) => {
            const button = document.createElement('button')
            button.id = command.id
            button.classList.add('shop-item__button')
            button.textContent = command.name
            button.addEventListener('click', (event) => {
              event.stopPropagation()
              command.execute(item, { player: this.player, shop: this.shop, toaster: this.toaster })
              this.ui.closePopover()
            })
            buttons.push(button)
          })
        content.append(...buttons)
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
