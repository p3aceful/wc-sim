import { Player } from '../player'
import { Shop } from '../shop'
import { Toaster } from '../toaster'
import { Item } from './items'

export type ItemCommand<T extends object> = {
  id: string
  name: string
  execute: (item: Item, context: T) => void
  shouldBeVisible: (item: Item, context: T) => boolean
}

export const defaultShopItemCommands: ItemCommand<{
  shop: Shop
  player: Player
  toaster: Toaster
}>[] = [
  {
    id: 'buy',
    name: 'Buy',
    execute: (item, { player, shop }) => {
      shop.buyItem(item.id, 1, player)
    },
    shouldBeVisible(item) {
      return item.buyable
    },
  },
  {
    id: 'buyAll',
    name: 'Buy all',
    execute: (item, { player, shop }) => {
      shop.buyAllItem(item.id, player)
    },
    shouldBeVisible(item) {
      return item.buyable
    },
  },
  {
    id: 'examine',
    name: 'Examine',
    execute: (item, { toaster }) => {
      toaster.toast(`${item.name} is worth ${item.sellPrice}gp`)
    },
    shouldBeVisible() {
      return true
    },
  },
]

export const shopOpenInventoryItemCommands: ItemCommand<{
  player: Player
  shop: Shop
  toaster: Toaster
}>[] = [
  // SHOP RELATED COMMANDS
  {
    id: 'sell',
    name: 'Sell',
    execute: (item, { player, shop }) => {
      shop.sellItem(item.id, 1, player)
    },
    shouldBeVisible(item) {
      return item.sellable
    },
  },
  {
    id: 'sellAll',
    name: 'Sell all',
    execute: (item, { player, shop }) => {
      shop.sellAllItem(item.id, player)
    },
    shouldBeVisible(item) {
      return item.sellable
    },
  },
  {
    id: 'examine',
    name: 'Examine',
    execute: (item, { toaster }) => {
      if (item.sellable) {
        toaster.toast(`${item.name} sells for ${item.sellPrice}gp`)
      } else {
        toaster.toast(`${item.description}`)
      }
    },
    shouldBeVisible() {
      return true
    },
  },
]

export const defaultEquipmentCommands: ItemCommand<{ player: Player }>[] = [
  {
    id: 'unequip',
    name: 'Unequip',
    execute: (item, { player }) => {
      if (item.equipmentSlot !== undefined) {
        player.unequip(item.equipmentSlot)
      }
    },
    shouldBeVisible() {
      return true
    },
  },
]

export const defaultInventoryCommands: ItemCommand<{ player: Player }>[] = [
  {
    id: 'equip',
    name: 'Equip',
    execute: (item, { player }) => {
      player.equip(item.id)
    },
    shouldBeVisible(item) {
      return item.equipmentSlot !== undefined
    },
  },
]

const inventoryItemCommands: Map<string, ItemCommand<{}>[]> = new Map([])

export const getCommandsForItem = (itemId: string) => {
  const commands = inventoryItemCommands.get(itemId)
  if (commands === undefined) {
    return []
  }
  return commands
}

export const bankItemCommands: ItemCommand<{ player: Player }>[] = [
  {
    id: 'withdraw',
    name: 'Withdraw',
    execute: (item, { player }) => {
      const bank = player.getBank()
      bank.withdraw(item.id, 1, player)
    },
    shouldBeVisible() {
      return true
    },
  },
  {
    id: 'withdrawAll',
    name: 'Withdraw all',
    execute: (item, { player }) => {
      const bank = player.getBank()
      bank.withdrawAll(item.id, player)
    },
    shouldBeVisible() {
      return true
    },
  },
]

export const bankOpenInventoryCommands: ItemCommand<{ player: Player }>[] = [
  {
    id: 'deposit',
    name: 'Deposit',
    execute: (item, { player }) => {
      const bank = player.getBank()
      bank.insert(item.id, 1, player)
    },
    shouldBeVisible() {
      return true
    },
  },
  {
    id: 'despositAll',
    name: 'Deposit all',
    execute: (item, { player }) => {
      const bank = player.getBank()
      bank.insertAll(item.id, player)
    },
    shouldBeVisible() {
      return true
    },
  },
]
