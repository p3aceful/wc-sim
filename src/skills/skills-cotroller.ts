import { SkillsModel } from './skills-model'
import { SkillsView } from './skills-view'

export class SkillsController {
  private parent: HTMLElement
  private view: SkillsView
  constructor(parent: HTMLElement, private skills: SkillsModel) {
    this.parent = parent
    this.view = new SkillsView(this.parent)

    skills.on('xpGain', () => {
      this.view.render(this.skills.getSkillData())
    })

    this.view.render(this.skills.getSkillData())
  }
}
