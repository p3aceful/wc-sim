import { firemakingLogs } from '../database/firemaking'
import { Player } from '../player'
import { BurnLogAction } from './actions'
import { FiremakingView } from './firemaking-view'

export class FiremakingController {
  view: FiremakingView
  constructor(parent: HTMLElement, private player: Player) {
    this.view = new FiremakingView(parent)

    this.view.on('burnLogButtonClick', ({ logId }) => {
      const currentActionId = this.player.getCurrentActionId()

      if (currentActionId === logId) {
        player.stopAction()
        this.view.stopLogBurnAnimation(logId)
      } else {
        const firemakingLog = firemakingLogs.find((log) => log.itemId === logId)!
        const action = new BurnLogAction(firemakingLog, this.player)
        action.on('logBurned', ({ logId }) => {
          this.view.succeedLogBurnAnimation(logId)
        })
        player.startAction(action)
        this.view.startLogBurnAnimation(logId)
      }
      this.updateView()
    })

    // this.view.on('logBurnStart', ({ logId }) => {})

    this.player.on('actionStart', () => {
      this.updateView()
    })
    this.player.on('actionStop', (action) => {
      if (action instanceof BurnLogAction) {
        this.view.stopLogBurnAnimation(action.id)
      }
      this.updateView()
    })

    this.updateView()
  }

  updateView() {
    const currentActionId = this.player.getCurrentActionId()
    const level = this.player.getSkills().getLevel('firemaking')
    this.view.render(
      firemakingLogs.map((log) => ({
        log,
        isBeingBurned: currentActionId === log.itemId,
        canBurn: level >= log.requiredLevel,
      }))
    )
  }
}
