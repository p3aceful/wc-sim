import { ShopCommand, ShopCommandContext } from './shop-command'
import { ShopModel } from './shop-model'

export class BuyAllCommand implements ShopCommand {
  id = 'buyAll'
  name = 'Buy all'

  constructor(private shop: ShopModel) {}
  execute({ itemId, player }: ShopCommandContext) {
    return this.shop.buyAllItem(itemId, player)
  }
}
