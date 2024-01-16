import { z } from 'zod'
import { PlayerSkills, Skills, beginnerSkills } from './skills'
import { Bank, ItemQuantity, initialBankItems } from './bank'
import { levelBreakpoints } from './models'
import { Equipment, PlayerEquipment, emptyEquipment } from './equipment'
import { Shop, initialShopItems } from './shop'

const skillsSchema = z.object({
  woodcutting: z.number(),
})

const bankSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
  })
)

const shopSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
  })
)

const equipmentSchema = z.object({
  head: z.string().nullable(),
  weapon: z.string().nullable(),
  body: z.string().nullable(),
  feet: z.string().nullable(),
})

export function saveGame(skills: PlayerSkills, bank: Bank, shop: Shop, equipment: PlayerEquipment) {
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

  const shopData = shop.getItems().map((item) => ({
    id: item.itemId,
    amount: item.amount,
  }))

  const bankResult = bankSchema.safeParse(bankData)
  const shopResult = shopSchema.safeParse(shopData)

  const equipmentData = equipmentSchema.safeParse(equipment.getEquipment())

  if (!skillsResult.success) {
    throw new Error(`Failed to save skills: ${skillsResult.error}`)
  }

  if (!bankResult.success) {
    throw new Error(`Failed to save bank: ${bankResult.error}`)
  }

  if (!equipmentData.success) {
    throw new Error(`Failed to save equipment: ${equipmentData.error}`)
  }

  if (!shopResult.success) {
    throw new Error(`Failed to save shop: ${shopResult.error}`)
  }

  localStorage.setItem('equipment', JSON.stringify(equipmentData.data))
  localStorage.setItem('skills', JSON.stringify(skillsResult.data))
  localStorage.setItem('bank', JSON.stringify(bankResult.data))
  localStorage.setItem('shop', JSON.stringify(shopResult.data))
}

export function loadGame(): {
  skills: Skills
  bank: ItemQuantity[]
  equipment: Equipment
  shop: ItemQuantity[]
} {
  const skillsData = localStorage.getItem('skills')
  const bankData = localStorage.getItem('bank')
  const equipmentData = localStorage.getItem('equipment')
  const shopData = localStorage.getItem('shop')

  let skillsState: Skills
  let bankState: ItemQuantity[]
  let equipmentState: Equipment
  let shopState: ItemQuantity[]

  if (!skillsData) {
    skillsState = beginnerSkills
  } else {
    const skillsResult = skillsSchema.safeParse(JSON.parse(skillsData))
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
  }

  if (!bankData) {
    bankState = initialBankItems
  } else {
    const bankResult = bankSchema.safeParse(JSON.parse(bankData))
    if (!bankResult.success) {
      bankState = initialBankItems
    } else {
      bankState = bankResult.data.map((item) => ({
        itemId: item.id,
        amount: item.amount,
      }))
    }
  }

  if (!shopData) {
    shopState = initialShopItems
  } else {
    const shopResult = shopSchema.safeParse(JSON.parse(shopData))
    if (!shopResult.success) {
      shopState = initialShopItems
    } else {
      shopState = shopResult.data.map((item) => ({
        itemId: item.id,
        amount: item.amount,
      }))
    }
  }

  if (!equipmentData) {
    equipmentState = emptyEquipment
  } else {
    const equipmentResult = equipmentSchema.safeParse(JSON.parse(equipmentData))
    if (!equipmentResult.success) {
      equipmentState = emptyEquipment
    } else {
      equipmentState = equipmentResult.data
    }
  }

  return {
    skills: skillsState,
    bank: bankState,
    equipment: equipmentState,
    shop: shopState,
  }
}
