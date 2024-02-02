import { Command } from '../command'
import { COINS_ITEM_ID, formatNumber, getItemById } from '../database/items'
import { LootTable } from '../loot-table'
import { Player } from '../player'
import { ShopController } from '../shop/shop-controller'
import { Toaster } from '../toaster'
import { UIManager } from '../ui-manager'
import { InventoryView } from './inventory-view'

export interface InventoryCommandContext {
  player: Player
  itemId: string
  quantity?: number
}

export type InventoryCommand = Command<InventoryCommandContext>

class ExamineCommand implements InventoryCommand {
  id = 'examine'
  name = 'Examine'
  constructor() {}

  execute({ itemId, quantity }: InventoryCommandContext): void {
    const item = getItemById(itemId)
    const toaster = Toaster.getInstance()

    if (quantity && quantity > 10000) {
      toaster.toast(`${formatNumber(quantity)} x ${item.name}`)
    } else {
      toaster.toast(`${item.description}`)
    }
  }
}

class EquipItemCommand implements InventoryCommand {
  id = 'equip'
  name = 'Equip'
  constructor() {}

  execute({ itemId, player }: InventoryCommandContext): void {
    player.equip(itemId)
  }
}

class RubCommand implements InventoryCommand {
  id = 'rub'
  name = 'Rub'
  constructor() {}

  execute(): void {
    const toaster = Toaster.getInstance()
    toaster.toast(`Why did you do that?`)
  }
}

class LootBirdNestCommand implements InventoryCommand {
  id = 'lootBirdNest'
  name = 'Loot'

  execute({ player }: InventoryCommandContext) {
    const inventory = player.getInventory()
    const table = new LootTable([
      {
        itemId: 'blueWizardRobe',
        amount: 1,
        weight: 20,
      },
      {
        itemId: 'dragonAxe',
        amount: 1,
        weight: 1,
      },
      {
        itemId: COINS_ITEM_ID,
        amount: 1000,
        weight: 200,
      },
      {
        itemId: 'blueWizardHat',
        amount: 1,
        weight: 20,
      },
      {
        itemId: 'tinderbox',
        amount: 1,
        weight: 100,
      },
      {
        itemId: 'leatherBoots',
        amount: 1,
        weight: 20,
      },
    ])
    const item = table.pickItem()
    inventory.insert(item.itemId, item.amount)
    inventory.remove('birdNest', 1)
    inventory.insert('birdNestEmpty', 1)
  }
}

class ShopExamineCommand implements InventoryCommand {
  id = 'shopExamine'
  name = 'Examine'
  constructor() {}

  execute({ itemId, quantity }: InventoryCommandContext): void {
    const item = getItemById(itemId)
    const toaster = Toaster.getInstance()

    if (item.id === COINS_ITEM_ID) {
      toaster.toast(`${formatNumber(quantity ?? 0)} x Coins`)
      return
    }

    if (!item.sellable) {
      toaster.toast(`${item.name} cannot be sold`)
      return
    }
    toaster.toast(`${item.name} sells for ${formatNumber(item.sellPrice)} coins`)
  }
}

class ShopSellCommand implements InventoryCommand {
  id = 'shopSell'
  name = 'Sell'

  constructor(private shop: ShopController) {}

  execute({ itemId }: InventoryCommandContext) {
    const item = getItemById(itemId)

    if (!item.sellable) {
      Toaster.getInstance().toast(`${item.name} cannot be sold`)
      return
    }

    this.shop.sellItem(itemId, 1)
  }
}

class ShopSellAllCommand implements InventoryCommand {
  id = 'shopSellAll'
  name = 'Sell all'

  constructor(private shop: ShopController) {}

  execute({ itemId }: InventoryCommandContext) {
    const item = getItemById(itemId)

    if (!item.sellable) {
      Toaster.getInstance().toast(`${item.name} cannot be sold`)
      return
    }

    this.shop.sellAllItem(itemId)
  }
}

const inventoryItemCommands = new Map<string, InventoryCommand[]>([
  ['log', [new RubCommand()]],
  ['birdNest', [new LootBirdNestCommand()]],
])

export class InventoryController {
  private view: InventoryView
  constructor(private parent: HTMLElement, private player: Player, private uiManager: UIManager) {
    this.getCommandsForItem = this.getCommandsForItem.bind(this)

    this.view = new InventoryView(this.parent, this.player.getInventory(), this.getCommandsForItem)

    this.view.on('itemClicked', ({ command, itemId, quantity }) => {
      command.execute({ itemId, player: this.player, quantity })
    })

    const inventory = this.player.getInventory()
    inventory.on('inventoryChange', () => {
      this.view.render(inventory.getItems())
    })
  }

  private getCommandsForItem(itemId: string): InventoryCommand[] {
    const item = getItemById(itemId)
    const commands = []
    const shop = this.uiManager.getCurrentShop()
    const shopIsOpened = shop !== null

    const itemCommands = inventoryItemCommands.get(itemId)
    if (shopIsOpened && !!shop) {
      commands.push(new ShopSellCommand(shop))
      commands.push(new ShopSellAllCommand(shop))
      commands.push(new ShopExamineCommand())
      return commands
    }

    if (itemCommands) {
      commands.push(...itemCommands)
    }

    if (item.equipmentSlot) {
      commands.push(new EquipItemCommand())
    }

    if (item.description) {
      commands.push(new ExamineCommand())
    }

    return commands
  }
}
