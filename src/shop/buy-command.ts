import { ShopCommand, ShopCommandContext } from './shop-command'
import { ShopModel } from './shop-model'

export class BuyCommand implements ShopCommand {
  id = 'buy'
  name = 'Buy'

  constructor(private shop: ShopModel) {}

  execute({ player, itemId }: ShopCommandContext) {
    this.shop.buyItem(itemId, 1, player)
  }
}
