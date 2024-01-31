import { COINS_ITEM_ID, getAssetForItem, getItemById, toReadableQuantity } from '../database/items'
import { ContextMenu } from '../ui/context-menu'
import { ItemQuantity } from '../item-store'
import { ShopCommand } from './shop-command'
import { ShopModel } from './shop-model'
import { ShopEvents } from './shop-controller'
import { EventBus } from '../events'

export class ShopView {
  private root: HTMLElement
  private staticContent: HTMLElement
  private dynamicContent: HTMLElement
  private contextMenu: ContextMenu
  constructor(
    private parent: HTMLElement,
    private shop: ShopModel,
    private events: EventBus<ShopEvents>,
    private getCommandsForItem: (itemId: string) => ShopCommand[]
  ) {
    this.root = document.createElement('div')
    this.root.classList.add('shop-view')
    this.staticContent = document.createElement('div')
    this.dynamicContent = document.createElement('div')
    this.contextMenu = new ContextMenu(this.parent)
    const title = document.createElement('h3')
    title.textContent = shop.getName()
    this.staticContent.appendChild(title)
    this.parent.appendChild(this.root)
    this.root.appendChild(this.staticContent)
    this.root.appendChild(this.dynamicContent)

    this.dynamicContent.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.type === 'shop-item') {
        const itemId = event.target.dataset.itemId!
        const quantity = parseInt(event.target.dataset.quantity!)

        if (itemId) {
          const item = getItemById(itemId)
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

    this.render(this.shop.getItems())
    this.hide()
  }

  public render(items: ItemQuantity[]) {
    this.dynamicContent.innerHTML = ''
    this.dynamicContent.classList.add('item-grid')
    for (const item of items) {
      if (item.itemId === COINS_ITEM_ID) {
        continue
      }

      const dbItem = getItemById(item.itemId)

      const element = document.createElement('button')
      element.classList.add('grid-item')
      element.dataset.itemId = item.itemId
      element.dataset.type = 'shop-item'
      element.title = `${dbItem.name}`
      element.innerHTML = `
        <img src="${getAssetForItem(
          dbItem,
          item.amount
        )}" class="grid-item__img" style="pointer-events:none" />
        <div class="grid-item__quantity">${toReadableQuantity(item.amount)}</div>
      `
      this.dynamicContent.appendChild(element)
    }
  }

  public show() {
    this.root.style.display = 'block'
  }
  public hide() {
    this.root.style.display = 'none'
  }
}
