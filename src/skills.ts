import { levelBreakpoints } from './database/skills'
import { EventBus } from './events'

export type Skill = {
  level: number
  xp: number
}

export type Skills = {
  woodcutting: Skill
}

export type PlayerEvents = {
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
}
export class PlayerSkills {
  private skills: Skills

  private events: EventBus<PlayerEvents>

  constructor(initialState: Skills, events: EventBus<PlayerEvents>) {
    this.skills = initialState
    this.events = events
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
      this.events.notify('levelUp', { skill, level: newLevel })
    }

    this.events.notify('xpGain', { skill, xp })
  }

  on<T extends keyof PlayerEvents>(event: T, callback: (data: PlayerEvents[T]) => void) {
    this.events.subscribe(event, callback)
  }

  off<T extends keyof PlayerEvents>(event: T, callback: (data: PlayerEvents[T]) => void) {
    this.events.unsubscribe(event, callback)
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
