import { Shop } from '../shop'
import { getAssetForItem, items as itemsDB } from '../database/items'
import { BaseUI } from './base-ui'
import { Player } from '../player'
import {
  bankOpenInventoryCommands,
  // bankOpenInventoryCommands,
  defaultInventoryCommands,
  getCommandsForItem,
  shopOpenInventoryItemCommands,
} from '../database/item-commands'
import { Toaster } from '../toaster'

export class InventoryUI {
  private ui: BaseUI
  constructor(
    private root: HTMLElement,
    private player: Player,
    private shop: Shop,
    private toaster: Toaster
  ) {
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

        const content = document.createElement('div')

        const header = document.createElement('h3')
        header.textContent = item.name
        content.appendChild(header)

        const buttons: HTMLElement[] = defaultInventoryCommands
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
          .concat(
            shopOpenInventoryItemCommands
              .filter((command) =>
                command.shouldBeVisible(item, { shop: this.shop, player, toaster: this.toaster })
              )
              .map((command) => {
                const button = document.createElement('button')
                button.id = command.id
                button.classList.add('bank-item__button')
                button.textContent = command.name
                button.addEventListener('click', (event) => {
                  event.stopPropagation()
                  command.execute(item, { player, shop: this.shop, toaster: this.toaster })
                  this.ui.closePopover()
                })
                return button
              })
          )
          .concat(
            bankOpenInventoryCommands
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
          )
          .concat(
            getCommandsForItem(item.id).map((command) => {
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
          )

        content.append(...buttons)
        return content
      }
    )

    this.update = this.update.bind(this)
    this.player.getInventory().on('inventoryChange', () => this.update())
    this.mount()
  }

  mount() {
    const header = document.createElement('h2')
    header.innerText = 'Inventory'
    this.root.appendChild(header)
    const inventoryContainer = document.createElement('div')
    inventoryContainer.classList.add('bank-grid')
    this.root.appendChild(inventoryContainer)
    this.update()
  }

  update() {
    const inventory = this.player.getInventory()
    const items = inventory.getItems()
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
