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
import { BankUI } from './bank-ui'
import { ShopUI } from './shop-ui'
import { EquipmentUI } from './equipment-ui'
import { Player } from './player'
import { debounce } from './utilities'
import { trees } from './database/trees'
import { Equipment } from './equipment'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="wc"></div>
  <div id="bank"></div>
  <div id="equipment"></div>
  <div id="shop"></div>
  <div id="playerSkills"></div>
`

const renderPlayerSkills = (playerSkills: PlayerSkills) => {
  const playerSkillsRoot = document.querySelector<HTMLDivElement>('#playerSkills')
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

const globalTimer = new GlobalTimer(600)

globalTimer.start()

const playerEvents = new EventBus<PlayerEvents>()
const bankEvents = new EventBus<BankEvents>()

playerEvents.subscribe('xpGain', () => {
  renderPlayerSkills(playerSkills)
})

const toaster = new Toaster()

const {
  skills: loadedSkills,
  bank: loadedBank,
  equipment: loadedEquipment,
  shop: loadedShop,
} = loadGame()

const playerSkills = new PlayerSkills(loadedSkills, playerEvents)
const bank = new Bank(loadedBank, bankEvents)
const playerEquipment = new Equipment(loadedEquipment)
const shopEvents = new EventBus<ShopEvents>()
const shop = new Shop(loadedShop, shopEvents, toaster)

const player = new Player(playerSkills, playerEquipment, bank)

globalTimer.registerCallback(player.update.bind(player))

const wcRoot = document.querySelector<HTMLDivElement>('#wc')
if (wcRoot) {
  wcRoot.style.display = 'grid'
  wcRoot.style.gridTemplateColumns = 'repeat(4, minmax(auto, 200px))'
  wcRoot.style.justifyContent = 'start'
  wcRoot.style.gap = '1rem'
  trees.forEach((tree) => {
    const root = document.createElement('div')
    wcRoot.appendChild(root)
    new WoodcuttingActionUI(root, tree, player, toaster)
  })
}
renderPlayerSkills(playerSkills)

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

bankEvents.subscribe('insertedItem', ({ itemId, amount }) => {
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
})

new BankUI(document.querySelector('#bank')!, player, shop)
new ShopUI(document.querySelector('#shop')!, player, shop)
new EquipmentUI(document.querySelector('#equipment')!, player)
