import { z } from 'zod'
import { Skills, beginnerSkills } from './skills'
import { Bank, ItemQuantity, initialBankItems } from './bank'
import { Shop, initialShopItems } from './shop'
import { Player } from './player'
import { Equipment, emptyEquipment, EquippedItems } from './equipment'
import { levelBreakpoints } from './database/skills'
import { Inventory } from './inventory'

const skillsSchema = z.object({
  woodcutting: z.number(),
})

const bankSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
  })
)

const inventorySchema = z.array(
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

const serializeSkills = (skills: Skills): z.infer<typeof skillsSchema> => {
  let skillsData: { [key: string]: number } = {}
  Object.entries(skills).forEach(([key, skill]) => {
    skillsData[key] = skill.xp
  })

  const skillsResult = skillsSchema.safeParse(skillsData)
  if (!skillsResult.success) {
    throw new Error(`Failed to save skills: ${skillsResult.error}`)
  }

  return skillsResult.data
}

const serializeBank = (bank: Bank): z.infer<typeof bankSchema> => {
  const bankData = bank.getItems().map((item) => ({
    id: item.itemId,
    amount: item.amount,
  }))

  const bankResult = bankSchema.safeParse(bankData)
  if (!bankResult.success) {
    throw new Error(`Failed to save bank: ${bankResult.error}`)
  }

  return bankResult.data
}

const serializeInventory = (inventory: Inventory): z.infer<typeof inventorySchema> => {
  const inventoryData = inventory.getItems().map((item) => ({
    id: item.itemId,
    amount: item.amount,
  }))

  const inventoryResult = inventorySchema.safeParse(inventoryData)
  if (!inventoryResult.success) {
    throw new Error(`Failed to save inventory: ${inventoryResult.error}`)
  }

  return inventoryResult.data
}

const serializeShop = (shop: Shop): z.infer<typeof shopSchema> => {
  const shopData = shop.getItems().map((item) => ({
    id: item.itemId,
    amount: item.amount,
  }))

  const shopResult = shopSchema.safeParse(shopData)
  if (!shopResult.success) {
    throw new Error(`Failed to save shop: ${shopResult.error}`)
  }

  return shopResult.data
}

const serializeEquipment = (equipment: Equipment): z.infer<typeof equipmentSchema> => {
  const equipmentData = equipment.getEquipment()

  const equipmentResult = equipmentSchema.safeParse(equipmentData)
  if (!equipmentResult.success) {
    throw new Error(`Failed to save equipment: ${equipmentResult.error}`)
  }

  return equipmentResult.data
}

export function saveToLocalStorage(key: string, data: unknown) {
  const serializedData = JSON.stringify(data)
  localStorage.setItem(key, serializedData)
}

export function saveGame(player: Player, shop: Shop) {
  const serializedSkills = serializeSkills(player.getSkills().getSkills())
  const serializedBank = serializeBank(player.getBank())
  const serializedShop = serializeShop(shop)
  const serializedEquipment = serializeEquipment(player.getEquipment())
  const serializedInventory = serializeInventory(player.getInventory())

  saveToLocalStorage('skills', serializedSkills)
  saveToLocalStorage('bank', serializedBank)
  saveToLocalStorage('shop', serializedShop)
  saveToLocalStorage('equipment', serializedEquipment)
  saveToLocalStorage('inventory', serializedInventory)
}

const unserializeSkills = (skills: unknown): Skills => {
  if (!skills) {
    return beginnerSkills
  }

  const skillsResult = skillsSchema.safeParse(skills)
  if (!skillsResult.success) {
    console.log('Failed to unserialize skills, using beginner skills', skillsResult.error)
    return beginnerSkills
  }

  const unserialized = Object.entries(skillsResult.data).reduce((acc, [key, xp]) => {
    const level = [...levelBreakpoints.entries()]
      .reverse()
      .find(([_, levelBreakpoint]) => xp >= levelBreakpoint)![0]

    acc[key as keyof Skills] = {
      level,
      xp,
    }
    return acc
  }, {} as Skills)

  for (const skill in beginnerSkills) {
    if (!(skill in unserialized)) {
      unserialized[skill as keyof Skills] = beginnerSkills[skill as keyof Skills]
    }
  }
  return unserialized
}

const unserializeBank = (bank: unknown): ItemQuantity[] => {
  if (!bank) {
    return initialBankItems
  }
  const bankResult = bankSchema.safeParse(bank)
  if (!bankResult.success) {
    console.log('Failed to unserialize bank, using initial bank', bankResult.error)
    return initialBankItems
  }

  return bankResult.data.map((item) => ({
    itemId: item.id,
    amount: item.amount,
  }))
}

const unserializeShop = (shop: unknown): ItemQuantity[] => {
  if (!shop) {
    return initialShopItems
  }
  const shopResult = shopSchema.safeParse(shop)
  if (!shopResult.success) {
    console.log('Failed to unserialize shop, using initial shop', shopResult.error)
    return initialShopItems
  }

  return shopResult.data.map((item) => ({
    itemId: item.id,
    amount: item.amount,
  }))
}

const unserializeEquipment = (equipment: unknown): EquippedItems => {
  if (!equipment) {
    return emptyEquipment
  }
  const equipmentResult = equipmentSchema.safeParse(equipment)
  if (!equipmentResult.success) {
    console.log('Failed to unserialize equipment, using empty equipment', equipmentResult.error)
    return emptyEquipment
  }

  return equipmentResult.data
}

const unserializeInventory = (inventory: unknown): ItemQuantity[] => {
  if (!inventory) {
    return []
  }
  const inventoryResult = inventorySchema.safeParse(inventory)
  if (!inventoryResult.success) {
    console.log('Failed to unserialize inventory, using empty inventory', inventoryResult.error)
    return []
  }

  return inventoryResult.data.map((item) => ({
    itemId: item.id,
    amount: item.amount,
  }))
}

export function loadGame(): {
  skills: Skills
  bank: ItemQuantity[]
  equipment: EquippedItems
  shop: ItemQuantity[]
  inventory: ItemQuantity[]
} {
  const skillsData = localStorage.getItem('skills')
  const bankData = localStorage.getItem('bank')
  const equipmentData = localStorage.getItem('equipment')
  const shopData = localStorage.getItem('shop')
  const inventoryData = localStorage.getItem('inventory')

  const unserializedSkills = unserializeSkills(JSON.parse(skillsData as unknown as string))
  const unserializedBank = unserializeBank(JSON.parse(bankData as unknown as string))
  const unserializedShop = unserializeShop(JSON.parse(shopData as unknown as string))
  const unserializedEquipment = unserializeEquipment(JSON.parse(equipmentData as unknown as string))
  const unserializedInventory = unserializeInventory(JSON.parse(inventoryData as unknown as string))

  return {
    skills: unserializedSkills,
    bank: unserializedBank,
    equipment: unserializedEquipment,
    shop: unserializedShop,
    inventory: unserializedInventory,
  }
}
