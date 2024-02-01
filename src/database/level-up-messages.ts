import { Skills } from '../skills/player-skills'

export const levelUpMessages = new Map<keyof Skills, Map<number, string>>([
  [
    'woodcutting',
    new Map([
      [1, 'You can now chop regular trees'],
      [15, 'You can now chop oak trees'],
      [30, 'You can now chop willow trees'],
      [45, 'You can now chop maple trees'],
      [60, 'You can now chop yew trees'],
      [75, 'You can now chop magic trees'],
      [90, 'You can now chop redwood trees'],
      [99, 'Congratulations, you have achieved the maximum level in this skill!'],
    ]),
  ],
])
