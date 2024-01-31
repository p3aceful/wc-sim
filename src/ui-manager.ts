import { ShopController } from './shop/shop-controller'

export class UIManager {
  private currentShop: ShopController | null = null

  openShop(shop: ShopController) {
    if (this.currentShop) {
      this.currentShop.hide()
    }
    this.currentShop = shop
    this.currentShop.show()
  }

  closeShop() {
    if (this.currentShop) {
      this.currentShop.hide()
      this.currentShop = null
    }
  }

  isShopOpen(shop: ShopController) {
    return this.currentShop === shop
  }

  isAnyElementOpen() {
    return this.currentShop !== null
  }

  getCurrentShop() {
    return this.currentShop
  }
}
