export type Skill = {
  id: string
  name: string
  asset: string
}

export const skills = new Map<string, Skill>([
  [
    'woodcutting',
    {
      id: 'woodcutting',
      name: 'Woodcutting',
      asset: 'https://oldschool.runescape.wiki/images/Woodcutting_icon_%28detail%29.png?a4903',
    },
  ],
])
