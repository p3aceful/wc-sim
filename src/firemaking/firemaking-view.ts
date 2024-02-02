import { Animation, AnimationFactory, AnimationManager } from '../animation'
import { FiremakingLog } from '../database/firemaking'
import { getItemById } from '../database/items'
import { Evented } from '../events'

type FiremakingLogData = {
  log: FiremakingLog
  isBeingBurned: boolean
  canBurn: boolean
}

type FiremakingViewEvents = {
  burnLogButtonClick: {
    logId: string
  }
  logBurnStart: {
    logId: string
  }
}
export class FiremakingView extends Evented<FiremakingViewEvents> {
  root: HTMLElement
  private animationFactory: AnimationFactory
  private animationManager: AnimationManager

  constructor(private parent: HTMLElement) {
    super()

    this.animationFactory = new AnimationFactory()
    this.animationManager = new AnimationManager()

    this.root = document.createElement('div')
    this.parent.appendChild(this.root)

    this.root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if ('buttonId' in target.dataset) {
        const id = target.dataset.buttonId!
        this.notify('burnLogButtonClick', { logId: id })
      }
    })
  }

  render(logs: FiremakingLogData[]) {
    this.animationManager.clear()
    this.root.innerHTML = ''

    const container = document.createElement('div')
    container.classList.add('firemaking-logs-container')

    const elements = logs.map(({ log, isBeingBurned, canBurn }) => {
      const logItem = getItemById(log.itemId)

      const html = `
        <div style="border:1px dashed black;padding:1rem;">
          <h3>${logItem.name}</h3>
          <div style="display:flex;">
          <div>
            <img src="${
              logItem.asset
            }" style="width: 75px;height:75px;object-fit:contain;display:block;"/>
          </div>
          <div data-animation="${log.itemId}"></div>
          </div>
          ${
            canBurn
              ? ''
              : `<p style="font-size:0.8rem;">Requires level ${log.requiredLevel} firemaking</p>`
          }
          <button ${canBurn ? '' : 'disabled '}data-button-id="${logItem.id}">${
        isBeingBurned ? 'Stop burning' : 'Burn'
      }</button>
        </div>
      `
      const element = document.createElement('div')
      element.innerHTML = html
      return element
    })
    container.append(...elements)
    this.root.appendChild(container)
  }

  async startLogBurnAnimation(logId: string) {
    const animation = await this.animationFactory.getAnimation('light-fire')
    const element: HTMLElement = this.root.querySelector(`[data-animation="${logId}"]`)!
    element.innerHTML = ''
    this.animationManager.startAnimation(
      logId,
      new Animation(element, animation, { isLooping: true })
    )
  }

  stopLogBurnAnimation(logId: string) {
    this.animationManager.stopAnimation(logId)
  }

  async succeedLogBurnAnimation(logId: string) {
    this.animationManager.stopAnimation(logId)
    const element: HTMLElement = this.root.querySelector(`[data-animation="${logId}"]`)!
    element.innerHTML = ''
    const animation = await this.animationFactory.getAnimation('succeed-light-fire')
    const self = this
    this.animationManager.startAnimation(
      logId,
      new Animation(element, animation, {
        isLooping: false,
        onFinish() {
          self.startLogBurnAnimation(logId)
        },
      })
    )
  }
}
