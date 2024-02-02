import { Animation, AnimationFactory, AnimationManager } from '../animation'
import { WoodcuttingTree } from '../database/woodcutting'
import { Evented } from '../events'

type TreeData = {
  tree: WoodcuttingTree
  isBeingCut: boolean
  canCut: boolean
}

type WoodcuttingViewEvents = {
  chopTreeButtonClick: {
    treeId: string
  }
}

export class WoodcuttingView extends Evented<WoodcuttingViewEvents> {
  private animationManager: AnimationManager
  private animationFactory: AnimationFactory

  constructor(private root: HTMLElement) {
    super()
    this.animationManager = new AnimationManager()
    this.animationFactory = new AnimationFactory()
    this.root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if ('chopTreeButton' in target.dataset) {
        const id = target.dataset.chopTreeId!
        this.notify('chopTreeButtonClick', { treeId: id })

        e.stopPropagation()
      }
    })
  }

  render(trees: TreeData[]) {
    this.root.innerHTML = ''
    const container = document.createElement('div')
    container.classList.add('woodcutting-tree-container')

    const html = trees.map(({ tree, isBeingCut, canCut }) => {
      const html = `
        <div style="border:1px dashed black; padding:1rem;">
          <h3>${tree.name}</h1>
          <div style="position:relative;display:inline-flex;">
            <img src="${
              tree.asset
            }" style="width: 75px;height:75px;object-fit:contain;display:block;"/>
            <div class="animation-container" data-animation-container="${tree.id}"></div>
          </div>
          ${
            canCut
              ? ''
              : `<p style="font-size:0.8rem;">Requires level ${tree.requiredLevel} woodcutting</p>`
          }
          <button ${canCut ? '' : 'disabled '}id="${
        tree.id
      }" style="margin-top:1rem;display:block;" data-chop-tree-button data-chop-tree-id="${
        tree.id
      }">${isBeingCut ? 'Stop chopping' : 'Chop ' + tree.name}</button>
        </div>
      `
      const treeNode = document.createElement('div')
      treeNode.innerHTML = html

      return treeNode
    })

    container.append(...html)
    this.root.append(container)
  }

  async startChoppingAnimation(treeId: string) {
    const animation = await this.animationFactory.getAnimation('woodcutting')
    const element: HTMLElement = this.root.querySelector(`[data-animation-container="${treeId}"]`)!
    this.animationManager.startAnimation(
      treeId,
      new Animation(element, animation, { isLooping: true })
    )
  }

  stopChoppingAnimation() {
    this.animationManager.clear()
  }
}
