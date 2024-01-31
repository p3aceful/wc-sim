import { Player } from './player'
import { ShopController } from './shop/shop-controller'
import { ShopModel } from './shop/shop-model'
import { UIManager } from './ui-manager'

export class ShopManager {
  private shops: ShopController[] = []
  private root: HTMLElement

  constructor(
    parent: HTMLElement,
    private uiManager: UIManager,
    shops: ShopModel[],
    player: Player
  ) {
    this.root = document.createElement('div')
    this.root.classList.add('shop-root')
    const shopsTabs = document.createElement('div')
    const header = document.createElement('h3')
    header.innerText = 'Shops'
    parent.appendChild(header)
    shopsTabs.classList.add('shop-manager')
    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('shop-manager__buttons')
    const shopsContainer = document.createElement('div')
    shopsContainer.classList.add('shop-manager__shops')
    this.shops = shops.map((shop) => new ShopController(shopsContainer, shop, player))

    this.shops.forEach((shop) => {
      const button = document.createElement('button')
      button.classList.add('shop-manager__button')
      button.textContent = `${shop.getName()}`
      button.addEventListener('click', () => {
        const isOpen = this.uiManager.isShopOpen(shop)
        if (isOpen) {
          this.uiManager.closeShop()
        } else {
          this.uiManager.openShop(shop)
        }
      })
      buttonsContainer.appendChild(button)
    })
    this.root.appendChild(header)
    shopsTabs.appendChild(buttonsContainer)
    shopsTabs.appendChild(shopsContainer)
    this.root.appendChild(shopsTabs)
    parent.appendChild(this.root)
  }
}
