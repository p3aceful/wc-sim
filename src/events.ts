export type Listener<TEvent> = (event: TEvent) => void

export interface Observable<TEvents> {
  subscribe<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>): void
  unsubscribe<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>): void
  notify<K extends keyof TEvents>(event: K, data: TEvents[K]): void
}

export class EventBus<TEvents> implements Observable<TEvents> {
  private listeners: { [K in keyof TEvents]?: Listener<TEvents[K]>[] } = {}
  constructor() {}

  subscribe<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>) {
    const listeners = this.listeners[event]
    if (listeners) {
      listeners.push(listener)
    } else {
      this.listeners[event] = [listener]
    }
  }

  unsubscribe<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>) {
    const listeners = this.listeners[event]
    if (listeners) {
      this.listeners[event] = listeners.filter((l) => l !== listener)
    }
  }

  notify<K extends keyof TEvents>(event: K, data: TEvents[K]) {
    const listeners = this.listeners[event]
    if (listeners) {
      listeners.forEach((listener) => listener(data))
    }
  }
}

export class Evented<T> {
  private events = new EventBus<T>()

  on<K extends keyof T>(event: K, callback: Listener<T[K]>) {
    this.events.subscribe(event, callback)
  }

  off<K extends keyof T>(event: K, callback: Listener<T[K]>) {
    this.events.unsubscribe(event, callback)
  }

  protected notify(event: keyof T, data: T[keyof T]) {
    this.events.notify(event, data)
  }
}
