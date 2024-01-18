import { SpriteAnimation } from '../animation'
import { WoodcuttingTree } from '../database/trees'
import { Player } from '../player'
import { Toaster } from '../toaster'
import { ChopTreeAction } from './actions'

export class WoodcuttingActionUI {
  private animation: SpriteAnimation
  private actionId: string | undefined
  private animationIntervalId: number | undefined
  constructor(
    private rootElement: HTMLDivElement,
    private tree: WoodcuttingTree,
    private player: Player,
    private toaster: Toaster
  ) {
    this.mount()
    this.player.getSkills().on('levelUp', (data) => {
      if (data.skill === 'woodcutting') {
        this.update()
      }
    })
    const animationImage = new Image()
    animationImage.src = '../woodcut-animation.png'
    this.animation = new SpriteAnimation(animationImage, 200, 200, 600, 4)
  }

  mount() {
    this.rootElement.innerHTML = `
      <div style="border:1px solid black; padding:1rem;">
        <h3>${this.tree.name}</h1>
        <div style="position:relative;display:inline-block;">
          <img src="${this.tree.asset}" style="width: 75px;height:75px;object-fit:contain;display:block;"/>
          <canvas id="${this.tree.id}-progress" width="50" height="50" style="position:absolute;bottom:0;left:100%;"></canvas>
        </div>
        <button id="${this.tree.id}" style="margin-top:1rem;">Chop ${this.tree.name}</button>
      </div>
    `
    const chopWoodButton = this.rootElement.querySelector<HTMLButtonElement>('#' + this.tree.id)
    if (chopWoodButton) {
      chopWoodButton.addEventListener('click', () => {
        this.handleClick()
      })
    }
    this.update()
    this.player.getEvents().subscribe('actionStart', () => {
      this.update()
    })
    this.player.getEvents().subscribe('actionStop', (action) => {
      if (action.id === this.actionId) {
        this.stopAnimation()
      }
      this.update()
    })
  }

  private update() {
    const id = this.player.getCurrentActionId()
    const isActive = id === this.actionId
    const canChop = this.player.getSkills().getSkills().woodcutting.level >= this.tree.requiredLevel
    const chopWoodButton = this.rootElement.querySelector<HTMLButtonElement>('#' + this.tree.id)

    if (chopWoodButton) {
      chopWoodButton.disabled = !canChop
      chopWoodButton.textContent = !canChop
        ? `Requires level ${this.tree.requiredLevel}`
        : isActive
        ? `Stop chopping`
        : `Chop ${this.tree.name}`
    }
  }

  animate(deltaTime: number) {
    const id = this.actionId
    const canvas = this.rootElement.querySelector<HTMLCanvasElement>(
      '#' + this.tree.id + '-progress'
    )!
    const ctx = canvas.getContext('2d')!
    const isActive = id === this.player.getCurrentActionId()
    if (isActive) {
      this.animation.update(deltaTime)
      this.animation.render(ctx, 0, 0, 50, 50)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  startAnimation() {
    this.animationIntervalId = setInterval(() => {
      this.animate(600 / 4)
    }, 600 / 4)
  }

  stopAnimation() {
    clearInterval(this.animationIntervalId)
    this.animate(0)
  }

  handleClick() {
    if (this.player.getCurrentActionId() === this.actionId) {
      this.player.stopAction()
      this.actionId = undefined
      this.stopAnimation()
      this.update()
    } else {
      const action = new ChopTreeAction(this.tree, this.player, this.toaster)
      this.player.startAction(action)
      this.actionId = action.id
      this.startAnimation()
      this.update()
    }
    this.update()
  }
}
