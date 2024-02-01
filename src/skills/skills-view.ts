import { SkillData } from './skills-model'

export class SkillsView {
  constructor(private parent: HTMLElement) {}

  render(skills: SkillData[]) {
    this.parent.innerHTML = ''

    const itemsHtml = skills
      .map(({ name, asset, level, xp, nextLevelXp }) => {
        return `
            <div style="border: 1px solid black; display:inline-flex;align-items:center;padding:.25rem;gap:0.5rem;">
              <img style="width:25px;height:25px;object-fit:contain;" src="${asset}">
              <div style="display:flex;gap:0.25rem;flex-direction:column;">
                <div style="font-weight:bold;">${name}</div>
                <div style="display:flex;flex-direction:column;gap:0.1rem;font-size:0.8rem;">
                  <div>Level: ${level}</div>
                  <div>xp: ${xp} / ${nextLevelXp}</div>
                </div>
              </div>
            </div>
          `
      })
      .join('')
    this.parent.innerHTML = `
        <h1>Skills</h1>
        <div style="display:grid;gap:1rem;justify-content:start;">${itemsHtml}</div>
      `
  }
}
