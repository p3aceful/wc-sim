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
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="wc"></div>
  <div id="bank"></div>
  <div id="playerSkills"></div>
`

const renderBank = (bank: Bank) => {
  const bankRoot = document.querySelector<HTMLDivElement>('#bank')
  if (bankRoot) {
    const items = bank.getItems()

    const itemsHtml = items
      .map((item) => {
        const dbItem = itemsDb.get(item.itemId)

        if (!dbItem) {
          throw new Error(`Item ${item.itemId} not found`)
        }
        return `
          <div style="position:relative;display:inline;padding:0.5rem;border:1px solid black;" title="${dbItem.name}">
            <img src="${dbItem.asset}" style="width:40px;height:40px;object-fit:contain;">
            <span style="pointer-events:none;position:absolute;right:0;bottom:0;padding-block:0.25rem;padding-inline:0.5rem;color:yellow;background:#555;font-size:1rem;">${item.amount}</span>
          </div>
        `
      })
      .join('')
    bankRoot.innerHTML = `
      <h2>Bank</h2>
      <div style="display:grid;gap:1rem;grid-auto-flow:column;justify-content:start;">${itemsHtml}</div>
    `
  }
}

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

bankEvents.subscribe('bankChange', () => {
  renderBank(bank)
})

playerEvents.subscribe('xpGain', () => {
  renderPlayerSkills(playerSkills)
})

const { skills: initialSkills, bank: initialBank } = loadGame()
const playerSkills = new PlayerSkills(initialSkills, playerEvents)
const bank = new Bank(initialBank, bankEvents)

const gameController = new GameController(gameControllerEvents)

const wcRoot = document.querySelector<HTMLDivElement>('#wc')
if (wcRoot) {
  wcRoot.style.display = 'grid'
  wcRoot.style.gridTemplateColumns = 'repeat(4, minmax(auto, 200px))'
  wcRoot.style.justifyContent = 'start'
  wcRoot.style.gap = '1rem'
  chopTreeActions(globalTimer, playerSkills, bank).forEach((action) => {
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
renderBank(bank)
renderPlayerSkills(playerSkills)

const toaster = new Toaster()

playerEvents.subscribe('xpGain', () => {
  saveGame(playerSkills, bank)
})

bankEvents.subscribe('bankChange', () => {
  saveGame(playerSkills, bank)
})

bankEvents.subscribe('insertedItem', ({ itemId, amount }) => {
  const dbItem = itemsDb.get(itemId)!
  toaster.show(`You received ${amount} ${dbItem.name}!`)
})

playerEvents.subscribe('levelUp', (skill) => {
  toaster.show(`You leveled up ${skill.skill}, you are now level ${skill.level}!`)
})
