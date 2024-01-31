export interface Command<T> {
  id: string
  name: string
  execute: (context: T) => void
}
