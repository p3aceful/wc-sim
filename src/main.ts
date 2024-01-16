import './style.css'
import { Bank, BankEvents } from './bank'
import { EventBus } from './events'
import { GameController, GameControllerEvents, GlobalTimer } from './game-controller'
import { levelBreakpoints } from './models'
import { loadGame, saveGame } from './serializer'
import { PlayerEvents, PlayerSkills } from './skills'
import { Toaster } from './toaster'
import { chopTreeActions } from './woodcutting/actions'
import { WoodcuttingActionView } from './woodcutting/views'
import { items as itemsDb } from './database/items'
import { skills as skillsDb } from './database/skills'
import { EquipmentEvents, PlayerEquipment } from './equipment'
import { Shop, ShopEvents } from './shop'
import { BankUI } from './bank-ui'
import { ShopUI } from './shop-ui'
import { EquipmentUI } from './equipment-ui'

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
const gameControllerEvents = new EventBus<GameControllerEvents>()
const playerEquipmentEvents = new EventBus<EquipmentEvents>()

playerEvents.subscribe('xpGain', () => {
  renderPlayerSkills(playerSkills)
})
const toaster = new Toaster()

const {
  skills: initialSkills,
  bank: initialBank,
  equipment: initialEquipment,
  shop: initialShop,
} = loadGame()

const playerSkills = new PlayerSkills(initialSkills, playerEvents)
const bank = new Bank(initialBank, bankEvents)
const playerEquipment = new PlayerEquipment(initialEquipment, bank, playerEquipmentEvents)
const shopEvents = new EventBus<ShopEvents>()
const shop = new Shop(initialShop, shopEvents, toaster)
const gameController = new GameController(gameControllerEvents)

const wcRoot = document.querySelector<HTMLDivElement>('#wc')
if (wcRoot) {
  wcRoot.style.display = 'grid'
  wcRoot.style.gridTemplateColumns = 'repeat(4, minmax(auto, 200px))'
  wcRoot.style.justifyContent = 'start'
  wcRoot.style.gap = '1rem'
  chopTreeActions(globalTimer, playerSkills, bank, playerEquipment, gameController, (message) =>
    toaster.toast(message)
  ).forEach((action) => {
    const root = document.createElement('div')
    wcRoot.appendChild(root)
    new WoodcuttingActionView(
      root,
      action,
      gameController,
      playerSkills,
      playerEvents,
      gameControllerEvents
    )
  })
}
renderPlayerSkills(playerSkills)

playerEvents.subscribe('xpGain', () => {
  saveGame(playerSkills, bank, shop, playerEquipment)
})

bankEvents.subscribe('bankChange', () => {
  saveGame(playerSkills, bank, shop, playerEquipment)
})

playerEquipmentEvents.subscribe('equip', () => {
  saveGame(playerSkills, bank, shop, playerEquipment)
})

playerEquipmentEvents.subscribe('unequip', () => {
  saveGame(playerSkills, bank, shop, playerEquipment)
})

shopEvents.subscribe('shopChange', () => {
  saveGame(playerSkills, bank, shop, playerEquipment)
})

bankEvents.subscribe('insertedItem', ({ itemId, amount }) => {
  const dbItem = itemsDb.get(itemId)!
  const html = `
    <div style="display:flex;align-items:center;gap:1rem;">
      <img src="${dbItem.asset}" style="width:25px;height:25px;object-fit:contain;">
      <span style="color:yellow;">${amount} ${dbItem.name}</span>
    </div>
  `
  toaster.toast(`${html}`)
})

playerEvents.subscribe('levelUp', (skill) => {
  toaster.toast(`You leveled up ${skill.skill}, you are now level ${skill.level}!`)
})

new BankUI(document.querySelector('#bank')!, bank, shop, playerEquipment, bankEvents)
new ShopUI(document.querySelector('#shop')!, bank, shop, shopEvents)
new EquipmentUI(document.querySelector('#equipment')!, playerEquipment, playerEquipmentEvents)
