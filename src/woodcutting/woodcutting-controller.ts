import { trees } from '../database/trees'
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
      const currentActionId = player.getCurrentActionId()
      if (currentActionId === treeId) {
        player.stopAction()
        this.view.render(this.model.getTrees().map((tree) => ({ tree, isBeingCut: false })))
      } else {
        const tree = this.model.getTreeById(treeId)
        player.startAction(new ChopTreeAction(tree, player))
        this.view.render(
          this.model.getTrees().map((tree) => ({ tree, isBeingCut: tree.id === treeId }))
        )
      }
    })
    this.view.render(this.model.getTrees().map((tree) => ({ tree, isBeingCut: false })))
  }
}
