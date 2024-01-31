import { COINS_ITEM_ID, getItemById } from '../database/items'
import { Toaster } from '../toaster'
import { ShopCommand, ShopCommandContext } from './shop-command'
import { ShopModel } from './shop-model'

export class BuyCommand implements ShopCommand {
  id = 'buy'
  name = 'Buy'

  constructor(private shop: ShopModel) {}

  execute({ player, itemId }: ShopCommandContext) {
    if (!this.shop.hasItem(itemId)) {
      throw new Error(`Item ${itemId} not found in shop`)
    }

    const itemData = getItemById(itemId)
    const toaster = Toaster.getInstance()
    if (!itemData.buyable) {
      toaster.toast(`${itemData.name} cannot be bought`)
      return
    }

    const inventory = player.getInventory()

    const totalPrice = itemData.buyPrice * 1
    const playerCoins = inventory.getQuantity(COINS_ITEM_ID)

    if (playerCoins < totalPrice) {
      toaster.toast(`Not enough coins`)
      return
    }

    if (!this.shop.hasQuantity(itemId, 1)) {
      toaster.toast(`Not enough items in stock`)
      return
    }

    inventory.remove(COINS_ITEM_ID, totalPrice)
    inventory.insert(itemId, 1)
    this.shop.removeItem(itemId, 1)
  }
}
