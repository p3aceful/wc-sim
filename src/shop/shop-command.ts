import { Command } from '../command'
import { Player } from '../player'

export interface ShopCommandContext {
  player: Player
  itemId: string
  quantity?: number
}

export interface ShopCommand extends Command<ShopCommandContext> {}
