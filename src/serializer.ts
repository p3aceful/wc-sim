import { z } from 'zod'
import { Skills, beginnerSkills } from './skills/player-skills'
import { Bank, ItemQuantity, initialBankItems } from './bank'
import { levelBreakpoints } from './database/skills'
import { ShopModel } from './shop/shop-model'
import { InventoryModel } from './inventory/inventory-model'
import { SkillsModel } from './skills/skills-model'
import { EquipmentModel, EquippedItems, emptyEquipment } from './equipment/equipment-model'

const skillsSchema = z.object({
  woodcutting: z.number().optional(),
  firemaking: z.number().optional(),
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

const shopSchemaNew = z
  .record(z.string(), z.array(z.object({ id: z.string(), amount: z.number() })))
  .nullable()

const equipmentSchema = z.object({
  head: z.string().nullable(),
  weapon: z.string().nullable(),
  body: z.string().nullable(),
  feet: z.string().nullable(),
})

export const serializeShops = (shops: ShopModel[]) => {
  let shopsData: { [key: string]: { id: string; amount: number }[] } = {}

  shops.forEach((shop) => {
    const items = shop.getItems().map((item) => ({
      id: item.itemId,
      amount: item.amount,
    }))
    shopsData[shop.getId()] = items
  })
  const shopsResult = shopSchemaNew.safeParse(shopsData)
  if (!shopsResult.success) {
    throw new Error(`Failed to save shops: ${shopsResult.error}`)
  }

  return shopsResult.data
}

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

const serializeInventory = (inventory: InventoryModel): z.infer<typeof inventorySchema> => {
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

const serializeEquipment = (equipment: EquipmentModel): z.infer<typeof equipmentSchema> => {
  const equipmentData = equipment.getEquippedItems()

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

export function saveGame(
  skills: SkillsModel,
  bank: Bank,
  inventory: InventoryModel,
  equipment: EquipmentModel,
  shops: ShopModel[]
) {
  const serialiedSkills = serializeSkills(skills.getSkillSet())
  const serializedBank = serializeBank(bank)
  const serializedInventory = serializeInventory(inventory)
  const serializedShops = serializeShops(shops)
  const serializedEquipment = serializeEquipment(equipment)

  saveToLocalStorage('skills', serialiedSkills)
  saveToLocalStorage('bank', serializedBank)
  saveToLocalStorage('inventory', serializedInventory)
  saveToLocalStorage('shops', serializedShops)
  saveToLocalStorage('equipment', serializedEquipment)

  // Remove the old shop
  localStorage.removeItem('shop') // This should be loaded and put in the general store by now.
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

const unserializeShop = (shop: unknown): ItemQuantity[] | null => {
  if (!shop) {
    return null
  }
  const shopResult = shopSchema.safeParse(shop)
  if (!shopResult.success) {
    console.log('Failed to unserialize shop using initial shop', shopResult.error)
    return null
  }

  return shopResult.data.map((item) => ({
    itemId: item.id,
    amount: item.amount,
  }))
}

const unserializeShops = (shops: unknown): Record<string, ItemQuantity[]> => {
  if (!shops) {
    return {}
  }
  const shopResult = shopSchemaNew.safeParse(shops)
  if (!shopResult.success) {
    console.log('Failed to unserialize shop, using initial shops', shopResult.error)
    return {}
  }

  if (!shopResult.data) {
    console.log('Could not find any shops')
    return {}
  }
  return Object.entries(shopResult.data).reduce(
    (acc: Record<string, ItemQuantity[]>, [key, items]) => {
      acc[key] = items.map((item) => ({
        itemId: item.id,
        amount: item.amount,
      }))
      return acc
    },
    {}
  )
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
  shops: Record<string, ItemQuantity[]>
  inventory: ItemQuantity[]
} {
  const skillsData = localStorage.getItem('skills')
  const bankData = localStorage.getItem('bank')
  const equipmentData = localStorage.getItem('equipment')
  const inventoryData = localStorage.getItem('inventory')
  const shopsData = localStorage.getItem('shops')

  const shopData = localStorage.getItem('shop')

  const unserializedSkills = unserializeSkills(JSON.parse(skillsData as unknown as string))
  const unserializedBank = unserializeBank(JSON.parse(bankData as unknown as string))
  const unserializedEquipment = unserializeEquipment(JSON.parse(equipmentData as unknown as string))
  const unserializedInventory = unserializeInventory(JSON.parse(inventoryData as unknown as string))
  const unserializedShops = unserializeShops(JSON.parse(shopsData as unknown as string))

  const unserializedShop = unserializeShop(JSON.parse(shopData as unknown as string))

  // Shop is no longer used. Put the items in the general store instead. And remove the shop.

  if (unserializedShop && unserializedShop.length > 0) {
    console.log('There is a shop and we will put the items in the general store', {
      unserializedShop,
    })
    // If there is a shop, put the items in the general store. The old shop is no longer used.
    unserializedShops['generalStore'] = unserializedShop
  }

  return {
    skills: unserializedSkills,
    bank: unserializedBank,
    equipment: unserializedEquipment,
    shops: unserializedShops,
    inventory: unserializedInventory,
  }
}
