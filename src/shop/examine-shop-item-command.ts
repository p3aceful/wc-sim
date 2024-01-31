import { getItemById } from '../database/items'
import { Toaster } from '../toaster'
import { ShopCommand, ShopCommandContext } from './shop-command'

export class ExamineShopItemCommand implements ShopCommand {
  id = 'examineShopItem'
  name = 'Examine'

  execute({ itemId }: ShopCommandContext) {
    const itemData = getItemById(itemId)
    const toaster = Toaster.getInstance()
    if (!itemData.buyable) {
      toaster.toast(`${itemData.name} cannot be bought!`)
      return
    }
    toaster.toast(`${itemData.name} costs ${itemData.buyPrice} coins`)
  }
}
