export type Item = {
  id: string
  name: string
  asset: string
}

export const items = new Map<string, Item>([
  [
    'log',
    {
      id: 'log',
      name: 'Log',
      asset: 'https://oldschool.runescape.wiki/images/Logs_detail.png?6c104',
    },
  ],
  [
    'oakLog',
    {
      id: 'oakLog',
      name: 'Oak log',
      asset: 'https://oldschool.runescape.wiki/images/Oak_logs_detail.png?d4b7f',
    },
  ],
  [
    'willowLog',
    {
      id: 'willowLog',
      name: 'Willow log',
      asset: 'https://oldschool.runescape.wiki/images/Willow_logs_detail.png?b9e7b',
    },
  ],
  [
    'mapleLog',
    {
      id: 'mapleLog',
      name: 'Maple log',
      asset: 'https://oldschool.runescape.wiki/images/Maple_logs_detail.png?e2b6b',
    },
  ],
  [
    'yewLog',
    {
      id: 'yewLog',
      name: 'Yew log',
      asset: 'https://oldschool.runescape.wiki/images/Yew_logs_detail.png?7e4d0',
    },
  ],
  [
    'magicLog',
    {
      id: 'magicLog',
      name: 'Magic log',
      asset: 'https://oldschool.runescape.wiki/images/Magic_logs_detail.png?1e0f5',
    },
  ],
])
