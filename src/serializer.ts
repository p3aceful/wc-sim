import { z } from 'zod'
import { PlayerSkills, Skills, beginnerSkills } from './skills'
import { Bank, ItemAmount } from './bank'
import { levelBreakpoints } from './models'

const skillsSchema = z.object({
  woodcutting: z.number(),
})

const bankSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
  })
)

export function saveGame(skills: PlayerSkills, bank: Bank) {
  let skillsData = {}
  Object.entries(skills.getSkills())
    .map(([key, skill]) => ({
      [key]: skill.xp,
    }))
    .forEach((skill) => {
      skillsData = {
        ...skillsData,
        ...skill,
      }
    })
  const skillsResult = skillsSchema.safeParse(skillsData)

  const bankData = bank.getItems().map((item) => ({
    id: item.itemId,
    amount: item.amount,
  }))

  const bankResult = bankSchema.safeParse(bankData)

  if (!skillsResult.success) {
    throw new Error(`Failed to save skills: ${skillsResult.error}`)
  }

  if (!bankResult.success) {
    throw new Error(`Failed to save bank: ${bankResult.error}`)
  }

  localStorage.setItem('skills', JSON.stringify(skillsResult.data))
  localStorage.setItem('bank', JSON.stringify(bankResult.data))
}

export function loadGame(): {
  skills: Skills
  bank: ItemAmount[]
} {
  const skillsData = localStorage.getItem('skills')
  const bankData = localStorage.getItem('bank')

  let skillsState: Skills
  let bankState: ItemAmount[]

  if (!skillsData || !bankData) {
    return {
      skills: beginnerSkills,
      bank: [],
    }
  }

  const skillsResult = skillsSchema.safeParse(JSON.parse(skillsData))
  const bankResult = bankSchema.safeParse(JSON.parse(bankData))

  if (!skillsResult.success) {
    skillsState = beginnerSkills
  } else {
    skillsState = Object.entries(skillsResult.data).reduce((acc, [key, xp]) => {
      const level = [...levelBreakpoints.entries()].find(
        ([_, levelBreakpoint]) => xp <= levelBreakpoint
      )![0]
      acc[key as keyof typeof skillsResult.data] = {
        level,
        xp,
      }
      return acc
    }, {} as Skills)
  }

  if (!bankResult.success) {
    bankState = []
  } else {
    bankState = bankResult.data.map((item) => ({
      itemId: item.id,
      amount: item.amount,
    }))
  }

  return {
    skills: skillsState,
    bank: bankState,
  }
}
