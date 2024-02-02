import { levelBreakpoints } from '../database/skills'
import { Evented } from '../events'

export type Skill = {
  level: number
  xp: number
}

export type Skills = {
  woodcutting: Skill
  firemaking: Skill
}

export type SkillEvents = {
  levelUp: {
    skill: keyof Skills
    level: number
  }

  xpGain: {
    skill: keyof Skills
    xp: number
  }
}

export const MAX_LEVEL = 99
export const MAX_XP = 200_000_000

export const beginnerSkills: Skills = {
  woodcutting: {
    level: 1,
    xp: 0,
  },
  firemaking: {
    level: 1,
    xp: 0,
  },
}
export class PlayerSkills extends Evented<SkillEvents> {
  private skills: Skills

  constructor(initialState: Skills) {
    super()
    this.skills = initialState
  }

  getSkills() {
    return this.skills
  }

  addXp(skill: keyof Skills, xp: number) {
    const skillState = this.skills[skill]
    if (!skillState) {
      throw new Error(`Unknown skill ${skill}`)
    }

    const newXp = Math.min(skillState.xp + xp, MAX_XP)
    const levelBreakpoint = levelBreakpoints.get(skillState.level + 1)

    if (!levelBreakpoint) {
      throw new Error(`Unknown level ${skillState.level + 1}`)
    }

    const shouldLevelUp = newXp >= levelBreakpoint && skillState.level < 99
    const newLevel = shouldLevelUp ? skillState.level + 1 : skillState.level

    this.skills[skill] = {
      level: newLevel,
      xp: newXp,
    }

    if (shouldLevelUp) {
      this.notify('levelUp', { skill, level: newLevel })
    }

    this.notify('xpGain', { skill, xp })
  }

  getLevel(skill: keyof Skills) {
    return Math.min(this.skills[skill].level, MAX_LEVEL)
  }

  getXp(skill: keyof Skills) {
    return Math.min(this.skills[skill].xp, MAX_XP)
  }

  getNextLevelXp(skill: keyof Skills) {
    const level = this.skills[skill].level
    const nextLevel = level + 1
    const levelBreakpoint = levelBreakpoints.get(nextLevel)
    if (!levelBreakpoint) {
      return MAX_XP
    }
    return Math.min(levelBreakpoint, MAX_XP)
  }
}
