import { Bank } from './bank'
import { GlobalTimer } from './global-timer'
import { loadGame, saveGame } from './serializer'
import { Toaster } from './toaster'
import { getAssetForItem, items as itemsDb } from './database/items'
import { Player } from './player'
import { debounce } from './utilities'
import { TabViewUI } from './ui/tab-view-ui'
import { ShopModel } from './shop/shop-model'
import { InventoryController } from './inventory/inventory-controller'
import { InventoryModel } from './inventory/inventory-model'
import { UIManager } from './ui-manager'
import { ShopManager } from './shop-manager'
import { shops as shopsDB } from './database/shops'
import { ItemQuantity } from './item-store'
import { BankUI } from './bank-ui'
import { SkillsModel } from './skills/skills-model'
import { SkillsController } from './skills/skills-cotroller'
import { WoodcuttingController } from './woodcutting/woodcutting-controller'
import { EquipmentModel } from './equipment/equipment-model'
import { EquipmentController } from './equipment/equipment-controller'
import { FiremakingController } from './firemaking/firemaking-controller'

export class Game {
  private player: Player
  private timer: GlobalTimer
  private shops: ShopModel[] = []
  constructor() {
    const root = document.querySelector('#app')! as HTMLElement

    const toaster = Toaster.getInstance()

    const {
      skills: loadedSkills,
      bank: loadedBank,
      equipment: loadedEquipment,
      inventory: loadedInventory,
      shops: loadedShops,
    } = loadGame()

    const skillsModel = new SkillsModel(loadedSkills)
    const bank = new Bank(loadedBank)
    const equipment = new EquipmentModel(loadedEquipment)
    const inventory = new InventoryModel(loadedInventory)
    this.player = new Player(skillsModel, equipment, bank, inventory)

    inventory.on('insertedItem', ({ itemId, amount }) => {
      const dbItem = itemsDb.get(itemId)!
      const html = `
        <div style="display:flex;align-items:center;gap:1rem;">
          <img src="${getAssetForItem(
            dbItem,
            amount
          )}" style="width:25px;height:25px;object-fit:contain;">
          <span style="color:yellow;">${amount} ${dbItem.name}</span>
        </div>
      `
      toaster.toast(`${html}`)
    })

    skillsModel.on('levelUp', (skill) => {
      toaster.toast(`You leveled up ${skill.skill}, you are now level ${skill.level}!`)
      toaster.levelUpToast(skill.skill, skill.level)
    })

    const tabRoot = document.createElement('div')
    tabRoot.classList.add('tab-root')
    root.prepend(tabRoot)

    const uiManager = new UIManager()

    new TabViewUI(tabRoot, {
      Inventory: () => {
        const inventoryContainer = document.createElement('div')
        new InventoryController(inventoryContainer, this.player, uiManager)

        return inventoryContainer
      },
      Bank: () => {
        const bankContainer = document.createElement('div')
        bankContainer.classList.add('bank-grid')

        new BankUI(bankContainer, this.player)
        return bankContainer
      },
      Equipment: () => {
        const equipmentContainer = document.createElement('div')
        equipmentContainer.classList.add('bank-grid')
        equipmentContainer.id = 'equipment'
        new EquipmentController(equipmentContainer, equipment, this.player)
        return equipmentContainer
      },
      Skills: () => {
        const skillsContainer = document.createElement('div')
        skillsContainer.classList.add('bank-grid')
        skillsContainer.id = 'playerSkills'
        new SkillsController(skillsContainer, skillsModel)
        return skillsContainer
      },
    })

    const save = () => {
      saveGame(
        this.player.getSkills(),
        this.player.getBank(),
        this.player.getInventory(),
        this.player.getEquipment(),
        this.shops
      )
    }

    const debouncedSaveGame = debounce(() => save(), 1000)

    this.shops = shopsDB.map((shop) => {
      let initialItems = shop.items
      let loadedShopItems: ItemQuantity[] = loadedShops[shop.id] ?? initialItems
      const shopModel = new ShopModel(shop.id, shop.name, loadedShopItems)
      shopModel.on('shopChange', () => {
        debouncedSaveGame()
      })
      return shopModel
    })
    new ShopManager(root, uiManager, this.shops, this.player)

    this.timer = new GlobalTimer(600)

    skillsModel.on('xpGain', () => debouncedSaveGame())
    bank.on('bankChange', () => debouncedSaveGame())
    inventory.on('inventoryChange', () => debouncedSaveGame())
    equipment.on('change', () => debouncedSaveGame())

    window.addEventListener('beforeunload', () => {
      // save()
    })

    const wc = document.createElement('div')
    root.appendChild(wc)
    new WoodcuttingController(wc, this.player)

    new FiremakingController(root, this.player)
  }

  start() {
    this.timer.registerCallback(this.player.update.bind(this.player))
    this.timer.start()
  }

  stop() {
    this.timer.stop()
  }
}
