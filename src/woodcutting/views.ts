import { SpriteAnimation } from '../animation'
import { EventBus } from '../events'
import { GameController, GameControllerEvents } from '../game-controller'
import { PlayerEvents, PlayerSkills } from '../skills'
import { IChopTreeAction } from './actions'

export class WoodcuttingActionView {
  private animation: SpriteAnimation
  private animationIntervalId: number | null = null
  constructor(
    private rootElement: HTMLDivElement,
    private action: IChopTreeAction,
    private gameController: GameController,
    private playerSkills: PlayerSkills,
    private playerEvents: EventBus<PlayerEvents>,
    private gameControllerEvents: EventBus<GameControllerEvents>
  ) {
    this.mount()
    this.update = this.update.bind(this)
    const animationImage = new Image()
    animationImage.src = '../woodcut-animation.png'
    this.animation = new SpriteAnimation(animationImage, 200, 200, 600, 4)
  }

  mount() {
    const id = this.action.id
    this.rootElement.innerHTML = `
      <div style="border:1px solid black; padding:1rem;">

        <h3>${this.action.tree.name}</h1>
        <div style="position:relative;display:inline-block;">
          <img src="${this.action.tree.asset}" style="width: 75px;height:75px;object-fit:contain;display:block;"/>
          <canvas id="${id}-progress" width="50" height="50" style="position:absolute;bottom:0;left:100%;"></canvas>
        </div>
        <button id="${id}" style="margin-top:1rem;">Chop ${this.action.tree.name}</button>
      </div>
    `
    const canvas = this.rootElement.querySelector<HTMLCanvasElement>('#' + id + '-progress')!

    const chopWoodButton = this.rootElement.querySelector<HTMLButtonElement>('#' + id)
    if (chopWoodButton) {
      chopWoodButton.addEventListener('click', () => {
        this.handleClick()
      })
    }
    this.update()
    this.playerEvents.subscribe('levelUp', () => {
      this.update()
    })
    this.gameControllerEvents.subscribe('actionStart', () => {
      this.update()
    })
  }

  private update() {
    const id = this.action.id
    const isActive = this.gameController.getCurrentAction()?.id === this.action.id

    const canChop =
      this.playerSkills.getSkills().woodcutting.level >= this.action.tree.requiredLevel
    const chopWoodButton = this.rootElement.querySelector<HTMLButtonElement>('#' + id)
    if (chopWoodButton) {
      chopWoodButton.disabled = !canChop
      chopWoodButton.textContent = !canChop
        ? `Requires level ${this.action.tree.requiredLevel}`
        : isActive
        ? `Stop chopping`
        : `Chop ${this.action.tree.name}`
    }
  }

  animate(deltaTime: number) {
    const id = this.action.id
    const canvas = this.rootElement.querySelector<HTMLCanvasElement>('#' + id + '-progress')!
    const ctx = canvas.getContext('2d')!
    const isActive = this.gameController.getCurrentAction()?.id === this.action.id
    if (isActive) {
      this.animation.update(deltaTime)
      this.animation.render(ctx, 0, 0, 50, 50)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  handleClick() {
    const isActive = this.gameController.getCurrentAction()?.id === this.action.id

    if (isActive) {
      console.log('Stopping', this.action.tree.name)
      this.gameController.stopAction()
      if (this.animationIntervalId) {
        clearInterval(this.animationIntervalId)
      }
      this.animate(0)
    } else {
      console.log('Starting', this.action.tree.name)
      this.gameController.startAction(this.action)
      if (this.animationIntervalId) {
        clearInterval(this.animationIntervalId)
      }
      this.animationIntervalId = setInterval(() => {
        this.animate(600 / 8)
      }, 600 / 8)
    }

    this.update()
  }
}
