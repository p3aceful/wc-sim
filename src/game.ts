import { Bank, BankEvents } from './bank'
import { EventBus } from './events'
import { GlobalTimer } from './global-timer'
import { loadGame, saveGame } from './serializer'
import { PlayerEvents, PlayerSkills, Skills } from './skills'
import { Toaster } from './toaster'
import { WoodcuttingActionUI } from './woodcutting/ui'
import { getAssetForItem, items as itemsDb } from './database/items'
import { skills as skillsDb } from './database/skills'
import { Player } from './player'
import { debounce } from './utilities'
import { trees } from './database/trees'
import { Equipment } from './equipment'
import { TabViewUI } from './ui/tab-view-ui'
import { ShopEvents, ShopModel, initialShopItems } from './shop/shop-model'
import { InventoryController } from './inventory/inventory-controller'
import { InventoryEvents, InventoryModel } from './inventory/inventory-model'
import { UIManager } from './ui-manager'
import { ShopManager } from './shop-manager'
import { shops as shopsDB } from './database/shops'
import { ItemQuantity } from './item-store'
import { BankUI } from './bank-ui'
import { EquipmentUI } from './ui/equipment-ui'

export class Game {
  private player: Player
  private timer: GlobalTimer
  private shops: ShopModel[] = []
  constructor() {
    const root = document.querySelector('#app')! as HTMLElement

    const playerEvents = new EventBus<PlayerEvents>()
    const bankEvents = new EventBus<BankEvents>()
    const inventoryEvents = new EventBus<InventoryEvents>()

    const toaster = Toaster.getInstance()

    const {
      skills: loadedSkills,
      bank: loadedBank,
      equipment: loadedEquipment,
      inventory: loadedInventory,
      shops: loadedShops,
    } = loadGame()

    const playerSkills = new PlayerSkills(loadedSkills, playerEvents)
    const bank = new Bank(loadedBank, bankEvents)
    const playerEquipment = new Equipment(loadedEquipment)
    const inventory = new InventoryModel(loadedInventory, inventoryEvents)
    this.player = new Player(playerSkills, playerEquipment, bank, inventory)

    inventoryEvents.subscribe('insertedItem', ({ itemId, amount }) => {
      const dbItem = itemsDb.get(itemId)!
      const html = `
        <div style="display:flex;align-items:center;gap:1rem;">
          <img src="${getAssetForItem(
            dbItem,
            amount
          )}" style="width:25px;height:25px;object-fit:contain;">
          <span style="color:yellow;">+ ${amount} ${dbItem.name}</span>
        </div>
      `
      toaster.toast(`${html}`)
    })

    playerEvents.subscribe('levelUp', (skill) => {
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
        new EquipmentUI(equipmentContainer, this.player)
        return equipmentContainer
      },
      Skills: () => {
        const skillsContainer = document.createElement('div')
        skillsContainer.classList.add('bank-grid')
        skillsContainer.id = 'playerSkills'
        return skillsContainer
      },
    })

    const renderPlayerSkills = (playerSkills: PlayerSkills) => {
      const playerSkillsRoot = document.querySelector<HTMLDivElement>('#Skills')
      if (playerSkillsRoot) {
        const skills = Object.keys(playerSkills.getSkills())

        const itemsHtml = skills
          .map((key) => {
            const dbSkill = skillsDb.get(key)!
            const level = playerSkills.getLevel(key as keyof Skills)
            const experience = playerSkills.getXp(key as keyof Skills)
            const nextLevelExperienceBreakpoint = playerSkills.getNextLevelXp(key as keyof Skills)
            return `
              <div style="border: 1px solid black; display:inline-flex;align-items:center;padding:.25rem;gap:0.5rem;">
                <img style="width:25px;height:25px;object-fit:contain;" src="${dbSkill.asset}">
                <div style="display:flex;gap:0.25rem;flex-direction:column;">
                  <div style="font-weight:bold;">${dbSkill.name}</div>
                  <div style="display:flex;flex-direction:column;gap:0.1rem;font-size:0.8rem;">
                    <div>Level: ${level}</div>
                    <div>xp: ${experience} / ${nextLevelExperienceBreakpoint}</div>
                  </div>
                </div>
              </div>
            `
          })
          .join('')
        playerSkillsRoot.innerHTML = `
          <h1>Skills</h1>
          <div style="display:grid;gap:1rem;justify-content:start;">${itemsHtml}</div>
        `
      }
    }

    playerEvents.subscribe('xpGain', () => {
      renderPlayerSkills(playerSkills)
    })
    renderPlayerSkills(playerSkills)

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
      let loadedShopItems: ItemQuantity[] = loadedShops[shop.id] ?? initialShopItems
      const events = new EventBus<ShopEvents>()
      events.subscribe('shopChange', () => {
        debouncedSaveGame()
      })
      return new ShopModel(shop.id, shop.name, loadedShopItems, events)
    })
    new ShopManager(root, uiManager, this.shops, this.player)

    const wcRoot = document.createElement('div')
    if (wcRoot) {
      wcRoot.style.display = 'grid'
      wcRoot.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'

      wcRoot.style.justifyContent = 'start'
      wcRoot.style.gap = '1rem'
      trees.forEach((tree) => {
        const root = document.createElement('div')
        wcRoot.appendChild(root)
        new WoodcuttingActionUI(root, tree, this.player)
      })
    }
    root.appendChild(wcRoot)

    this.timer = new GlobalTimer(600)

    playerEvents.subscribe('xpGain', () => {
      debouncedSaveGame()
    })

    bankEvents.subscribe('bankChange', () => {
      debouncedSaveGame()
    })

    playerEquipment.on('change', () => debouncedSaveGame())

    window.addEventListener('beforeunload', () => {
      save()
    })
  }

  start() {
    this.timer.registerCallback(this.player.update.bind(this.player))
    this.timer.start()
  }

  stop() {
    this.timer.stop()
  }
}
