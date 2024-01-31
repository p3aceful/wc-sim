import { getAssetForItem, getItemById, toReadableQuantity } from '../database/items'
import { ContextMenu } from '../ui/context-menu'
import { ItemQuantity } from '../item-store'
import { InventoryCommand, InventoryEvents } from './inventory-controller'
import { InventoryModel } from './inventory-model'
import { EventBus } from '../events'

export class InventoryView {
  private root: HTMLElement
  private staticContent: HTMLElement
  private dynamicContent: HTMLElement
  private contextMenu: ContextMenu

  constructor(
    private parent: HTMLElement,
    private events: EventBus<InventoryEvents>,
    private inventory: InventoryModel,
    private getCommandsForItem: (itemId: string) => InventoryCommand[]
  ) {
    this.root = document.createElement('div')
    this.staticContent = document.createElement('div')
    this.dynamicContent = document.createElement('div')
    this.contextMenu = new ContextMenu(this.parent)
    const title = document.createElement('h3')
    title.textContent = 'Inventory'
    this.staticContent.appendChild(title)
    this.parent.appendChild(this.root)
    this.root.appendChild(this.staticContent)
    this.root.appendChild(this.dynamicContent)

    this.dynamicContent.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.type === 'inventory-item') {
        const itemId = event.target.dataset.itemId!
        const item = getItemById(itemId)
        const quantity = parseInt(event.target.dataset.quantity!)
        if (itemId) {
          const commands = this.getCommandsForItem(itemId)
          const options = commands.map((command) => ({
            id: command.id,
            name: command.name,
          }))

          const onOptionSelected = (optionId: string) => {
            const command = commands.find((command) => command.id === optionId)
            if (command) {
              this.events.notify('itemClicked', { itemId, quantity, command })
            }
          }

          this.contextMenu.show(item.name, event, options, onOptionSelected)
          event.stopPropagation()
        }
      }
    })

    this.render(this.inventory.getItems())
  }

  public render(items: ItemQuantity[]) {
    this.dynamicContent.innerHTML = ''
    this.dynamicContent.classList.add('item-grid')

    for (const { itemId, amount } of items) {
      const item = getItemById(itemId)

      const element = document.createElement('button')
      element.classList.add('grid-item')
      element.title = item.name
      element.dataset.type = 'inventory-item'
      element.dataset.itemId = itemId
      element.dataset.quantity = amount.toString()
      element.innerHTML = `
        <img src="${getAssetForItem(
          item,
          amount
        )}" class="grid-item__img" style="pointer-events: none;">
        <div class="grid-item__quantity">${toReadableQuantity(amount)}</div>
      `
      this.dynamicContent.appendChild(element)
    }
  }
}
