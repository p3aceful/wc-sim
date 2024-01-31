import { BuyCommand } from './buy-command'
import { ShopCommand, ShopCommandContext } from './shop-command'
import { ShopModel } from './shop-model'

export class BuyAllCommand implements ShopCommand {
  id = 'buyAll'
  name = 'Buy all'

  constructor(private shop: ShopModel) {}
  execute({ itemId, player }: ShopCommandContext) {
    const buyCommand = new BuyCommand(this.shop)
    const itemTotalQuantity = this.shop.getQuantity(itemId)
    return buyCommand.execute({ player, itemId, quantity: itemTotalQuantity })
  }
}
