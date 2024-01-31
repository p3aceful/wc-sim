import { Player } from '../player'
import { Item } from './items'

export type ItemCommand<T extends object> = {
  id: string
  name: string
  execute: (item: Item, context: T) => void
  shouldBeVisible: (item: Item, context?: T) => boolean
}

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
