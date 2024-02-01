import { Animation, SpriteAnimation } from '../animation'
import { WoodcuttingTree } from '../database/trees'
import { Evented } from '../events'

type TreeData = {
  tree: WoodcuttingTree
  isBeingCut: boolean
}

type WoodcuttingViewEvents = {
  chopTreeButtonClick: {
    treeId: string
  }
}

export class WoodcuttingView extends Evented<WoodcuttingViewEvents> {
  animationIntervalId: number | null = null
  constructor(private root: HTMLElement) {
    super()
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
    if (this.animationIntervalId) {
      clearInterval(this.animationIntervalId)
    }
    this.root.innerHTML = ''
    const container = document.createElement('div')
    container.classList.add('woodcutting-tree-container')

    const html = trees.map(({ tree, isBeingCut }) => {
      const html = `
        <div style="border:1px dashed black; padding:1rem;">
          <h3>${tree.name}</h1>
          <div style="position:relative;display:inline-block;">
            <img src="${
              tree.asset
            }" style="width: 75px;height:75px;object-fit:contain;display:block;"/>
            <div class="animation-container"></div>
          </div>
          <button id="${
            tree.id
          }" style="margin-top:1rem;display:block;" data-chop-tree-button data-chop-tree-id="${
        tree.id
      }">${isBeingCut ? 'Stop chopping' : 'Chop ' + tree.name}</button>
        </div>
      `
      const treeNode = document.createElement('div')
      treeNode.innerHTML = html
      const animationContainer = treeNode.querySelector('.animation-container')!
      if (isBeingCut) {
        const img = document.createElement('img')
        img.src = '../woodcut-animation.png'
        const animation = new Animation(
          animationContainer as HTMLElement,
          new SpriteAnimation(img, 200, 200, 600, 4)
        )
        this.animationIntervalId = animation.start()
      }
      return treeNode
    })

    container.append(...html)
    this.root.append(container)
  }
}
