import { Player } from '../player'
import { BuyAllCommand } from './buy-all-command'
import { BuyCommand } from './buy-command'
import { ExamineShopItemCommand } from './examine-shop-item-command'
import { ShopCommand } from './shop-command'
import { ShopModel } from './shop-model'
import { ShopView } from './shop-view'

export class ShopController {
  private view: ShopView
  private shopCommands: ShopCommand[] = []
  constructor(private parent: HTMLElement, private shop: ShopModel, private player: Player) {
    this.shopCommands = [
      new BuyCommand(this.shop),
      new BuyAllCommand(this.shop),
      new ExamineShopItemCommand(),
    ]

    this.getCommandsForItem = this.getCommandsForItem.bind(this)
    this.view = new ShopView(this.parent, this.shop, this.getCommandsForItem)
    this.view.on('itemClicked', ({ itemId, command, quantity }) => {
      command.execute({ itemId, player: this.player, quantity })
    })

    this.shop.on('shopChange', () => {
      this.view.render(this.shop.getItems())
    })
  }
  private getCommandsForItem(): ShopCommand[] {
    const commands: ShopCommand[] = this.shopCommands
    return commands
  }

  public show() {
    this.view.show()
  }

  public hide() {
    this.view.hide()
  }

  public sellItem(itemId: string, quantity: number) {
    this.shop.sellItem(itemId, quantity, this.player)
  }

  public sellAllItem(itemId: string) {
    this.shop.sellAllItems(itemId, this.player)
  }

  public getName() {
    return this.shop.getName()
  }
}
