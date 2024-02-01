import { getAssetForItem, items as itemsDB } from './database/items'
import { BaseUI } from './ui/base-ui'
import { Player } from './player'
import { bankItemCommands } from './database/item-commands'

export class BankUI {
  private ui: BaseUI
  constructor(private root: HTMLElement, private player: Player) {
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

        const content = document.createElement('div')

        const header = document.createElement('h3')
        header.textContent = item.name
        content.appendChild(header)

        const buttons: HTMLElement[] = bankItemCommands
          .filter((command) => command.shouldBeVisible(item, { player }))
          .map((command) => {
            const button = document.createElement('button')
            button.id = command.id
            button.classList.add('bank-item__button')
            button.textContent = command.name
            button.addEventListener('click', (event) => {
              event.stopPropagation()
              command.execute(item, { player })
              this.ui.closePopover()
            })
            return button
          })

        content.append(...buttons)
        return content
      }
    )

    this.update = this.update.bind(this)
    this.player.getBank().on('bankChange', () => this.update())
    this.mount()
  }

  mount() {
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
