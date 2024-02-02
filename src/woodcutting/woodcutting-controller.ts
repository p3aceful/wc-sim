import { trees } from '../database/woodcutting'
import { Player } from '../player'
import { ChopTreeAction } from './actions'
import { WoodcuttingModel } from './woodcutting-model'
import { WoodcuttingView } from './woodcutting-view'

export class WoodcuttingController {
  model: WoodcuttingModel
  view: WoodcuttingView
  constructor(parent: HTMLElement, player: Player) {
    this.model = new WoodcuttingModel(trees)
    this.view = new WoodcuttingView(parent)
    this.view.on('chopTreeButtonClick', ({ treeId }) => {
      const tree = this.model.getTreeById(treeId)

      const canCut = tree.requiredLevel <= player.getSkills().getLevel('woodcutting')
      const currentActionId = player.getCurrentActionId()
      if (currentActionId === treeId) {
        player.stopAction()
        this.view.render(this.model.getTrees().map((tree) => ({ tree, isBeingCut: false, canCut })))
        this.view.stopChoppingAnimation()
      } else {
        const tree = this.model.getTreeById(treeId)
        player.startAction(new ChopTreeAction(tree, player))
        this.view.render(
          this.model.getTrees().map((tree) => ({
            tree,
            isBeingCut: tree.id === treeId,
            canCut,
          }))
        )
        this.view.startChoppingAnimation(treeId)
      }
    })
    this.view.render(
      this.model.getTrees().map((tree) => ({
        tree,
        isBeingCut: false,
        canCut: tree.requiredLevel <= player.getSkills().getLevel('woodcutting'),
      }))
    )
    player.on('actionStop', () => {
      this.view.stopChoppingAnimation()
      this.view.render(
        this.model.getTrees().map((tree) => ({
          tree,
          isBeingCut: false,
          canCut: tree.requiredLevel <= player.getSkills().getLevel('woodcutting'),
        }))
      )
    })
  }
}
