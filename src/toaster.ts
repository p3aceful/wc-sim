export class Toaster {
  private rootElement: HTMLDivElement
  private timeoutId: number | null = null
  private animationTimeoutId: number | null = null
  constructor() {
    this.rootElement = document.createElement('div')
    this.rootElement.style.position = 'fixed'
    this.rootElement.style.bottom = '0'
    this.rootElement.style.right = '0'
    this.rootElement.style.backgroundColor = 'white'
    this.rootElement.style.padding = '1rem'
    this.rootElement.style.border = '1px solid black'
    this.rootElement.style.borderRadius = '0.5rem'
    this.rootElement.style.margin = '1rem'
    this.rootElement.style.display = 'none'
    this.rootElement.style.transition = 'opacity 0.5s ease-in-out'
    document.body.appendChild(this.rootElement)
  }

  show(message: string) {
    this.rootElement.textContent = message
    this.rootElement.style.display = 'block'
    this.rootElement.style.opacity = '1'
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.rootElement.style.opacity = '0'
      this.animationTimeoutId = setTimeout(() => {
        this.rootElement.style.display = 'none'
      }, 500)
    }, 2000)
  }
}
