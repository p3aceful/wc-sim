import './style.css'
import { Bank, BankEvents } from './bank'
import { EventBus } from './events'
import { GlobalTimer } from './global-timer'
import { loadGame, saveGame } from './serializer'
import { PlayerEvents, PlayerSkills } from './skills'
import { Toaster } from './toaster'
import { WoodcuttingActionUI } from './woodcutting/ui'
import { getAssetForItem, items as itemsDb } from './database/items'
import { levelBreakpoints, skills as skillsDb } from './database/skills'
import { Shop, ShopEvents } from './shop'
import { ShopUI } from './ui/shop-ui'
import { EquipmentUI } from './ui/equipment-ui'
import { Player } from './player'
import { debounce } from './utilities'
import { trees } from './database/trees'
import { Equipment } from './equipment'
import { InventoryUI } from './ui/inventory-ui'
import { Inventory, InventoryEvents } from './inventory'
import { TabViewUI } from './ui/tab-view-ui'
import { BankUI } from './bank-ui'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="wc"></div>
  <div id="bank"></div>
`

const globalTimer = new GlobalTimer(600)

globalTimer.start()

const playerEvents = new EventBus<PlayerEvents>()
const bankEvents = new EventBus<BankEvents>()
const inventoryEvents = new EventBus<InventoryEvents>()

const toaster = new Toaster()

const {
  skills: loadedSkills,
  bank: loadedBank,
  equipment: loadedEquipment,
  shop: loadedShop,
  inventory: loadedInventory,
} = loadGame()

const playerSkills = new PlayerSkills(loadedSkills, playerEvents)
const bank = new Bank(loadedBank, bankEvents)
const playerEquipment = new Equipment(loadedEquipment)
const shopEvents = new EventBus<ShopEvents>()
const shop = new Shop(loadedShop, shopEvents, toaster)
const inventory = new Inventory(loadedInventory, inventoryEvents)
const player = new Player(playerSkills, playerEquipment, bank, inventory)

globalTimer.registerCallback(player.update.bind(player))

const wcRoot = document.querySelector<HTMLDivElement>('#wc')
if (wcRoot) {
  wcRoot.style.display = 'grid'
  wcRoot.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'

  wcRoot.style.justifyContent = 'start'
  wcRoot.style.gap = '1rem'
  trees.forEach((tree) => {
    const root = document.createElement('div')
    wcRoot.appendChild(root)
    new WoodcuttingActionUI(root, tree, player, toaster)
  })
}

const save = () => {
  saveGame(player, shop)
}

const debouncedSaveGame = debounce(() => save(), 1000)

playerEvents.subscribe('xpGain', () => {
  debouncedSaveGame()
})

bankEvents.subscribe('bankChange', () => {
  debouncedSaveGame()
})

shopEvents.subscribe('shopChange', () => {
  debouncedSaveGame()
})

playerEquipment.on('change', () => debouncedSaveGame())

window.addEventListener('beforeunload', () => {
  debouncedSaveGame()
})

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

// new BankUI(document.querySelector('#bank')!, player, shop, toaster)

const tabRoot = document.createElement('div')
tabRoot.classList.add('tab-root')
document.body.prepend(tabRoot)

new TabViewUI(tabRoot, {
  Inventory: () => {
    const inventoryContainer = document.createElement('div')
    inventoryContainer.id = 'inventory'
    return inventoryContainer
  },
  Bank: () => {
    const bankContainer = document.createElement('div')
    bankContainer.classList.add('bank-grid')

    return bankContainer
  },
  Equipment: () => {
    const equipmentContainer = document.createElement('div')
    equipmentContainer.classList.add('bank-grid')
    equipmentContainer.id = 'equipment'
    return equipmentContainer
  },
  Skills: () => {
    const skillsContainer = document.createElement('div')
    skillsContainer.classList.add('bank-grid')
    skillsContainer.id = 'playerSkills'
    return skillsContainer
  },
  Shop: () => {
    const shopContainer = document.createElement('div')
    shopContainer.classList.add('bank-grid')
    shopContainer.id = 'shop'

    return shopContainer
  },
})

new InventoryUI(document.querySelector('#Inventory')!, player, shop, toaster)
new ShopUI(document.querySelector('#Shop')!, player, shop, toaster)
new EquipmentUI(document.querySelector('#Equipment')!, player)
new BankUI(document.querySelector('#Bank')!, player)

const renderPlayerSkills = (playerSkills: PlayerSkills) => {
  const playerSkillsRoot = document.querySelector<HTMLDivElement>('#Skills')
  if (playerSkillsRoot) {
    const skills = Object.entries(playerSkills.getSkills())

    const itemsHtml = skills
      .map(([key, skill]) => {
        const levelBreakpoint = levelBreakpoints.get(skill.level + 1)
        const dbSkill = skillsDb.get(key)!
        return `
          <div style="border: 1px solid black; display:inline-flex;align-items:center;padding:.25rem;gap:0.5rem;">
            <img style="width:25px;height:25px;object-fit:contain;" src="${dbSkill.asset}">
            <div style="display:flex;gap:0.25rem;flex-direction:column;">
              <div style="font-weight:bold;">${dbSkill.name}</div>
              <div style="display:flex;flex-direction:column;gap:0.1rem;font-size:0.8rem;">
                <div>Level: ${skill.level}</div>
                <div>xp: ${Math.round(skill.xp)} / ${levelBreakpoint}</div>
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
