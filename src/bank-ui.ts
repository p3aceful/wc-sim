import { Shop } from './shop'
import { getAssetForItem, items as itemsDB } from './database/items'
import { BaseUI } from './base-ui'
import { Player } from './player'

export class BankUI {
  private ui: BaseUI
  constructor(private root: HTMLElement, private player: Player, private shop: Shop) {
    // This should handle everything to do with the bank UI.
    // It should render the bank, and handle events from when the user clicks on the bank.
    // It should also handle events from the bank itself, like when the bank changes.

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

        if (item.sellable) {
          const sellButton = document.createElement('button')
          sellButton.id = 'sell'
          sellButton.classList.add('bank-item__button')
          sellButton.textContent = `Sell for ${item.sellPrice}gp`
          buttons.push(sellButton)

          sellButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const itemId = item.id
            const amount = 1
            this.shop.sellItem(itemId, amount, this.player)
            this.ui.closePopover()
          })

          const sellAllButton = document.createElement('button')
          sellAllButton.id = 'sellAll'
          sellAllButton.classList.add('bank-item__button')
          sellAllButton.textContent = `Sell all`
          buttons.push(sellAllButton)
          sellAllButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const itemId = item.id
            this.shop.sellAllItem(itemId, this.player)
            this.ui.closePopover()
          })
        }

        if (item.equipmentSlot) {
          const equipButton = document.createElement('button')
          equipButton.id = 'equip'
          equipButton.classList.add('bank-item__button')
          equipButton.textContent = `Equip`
          buttons.push(equipButton)
          equipButton.addEventListener('click', (event) => {
            event.stopPropagation()
            this.player.equip(itemId)
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

        const header = document.createElement('h3')
        header.textContent = item.name
        content.appendChild(header)

        content.append(...buttons)
        return content
      }
    )

    this.update = this.update.bind(this)
    this.player.getBank().on('bankChange', () => this.update())
    this.mount()
  }

  mount() {
    const header = document.createElement('h2')
    header.innerText = 'Bank'
    this.root.appendChild(header)
    const bankContainer = document.createElement('div')
    bankContainer.classList.add('bank-grid')
    this.root.appendChild(bankContainer)
    this.update()
  }

  update() {
    const bank = this.player.getBank()
    const items = bank.getItems()
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
        <img src="${getAssetForItem(
          dbItem,
          item.amount
        )}" class="bank-item__img" style="pointer-events:none;">
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
}
