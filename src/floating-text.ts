export class FloatingText {
  private elapsed = 0
  constructor(
    public text: string,
    public icon: string,
    public duration: number,
    public element: HTMLElement
  ) {}

  // Update the position and opacity of the text based on the elapsed time
  update(delta: number) {
    // ...
    const oldBottom = this.element.style.bottom
    // console.log({ oldBottom, delta })
    this.element.style.bottom = `${parseFloat(oldBottom) + Math.round(delta / 50)}px`
    this.elapsed += delta
    const opacity = 1 - this.elapsed / this.duration
    this.element.style.opacity = opacity.toString()
  }

  // Check if the animation is finished
  isFinished() {
    // ...
    return this.elapsed >= this.duration
  }
}

export class FloatingTextManager {
  private texts: FloatingText[] = []
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  // Create a new floating text animation
  createText(text: string, icon: string) {
    const element = document.createElement('div')
    element.innerHTML = `<img src="${icon}" alt="icon" style="width:2rem;height:2rem;object-fit:contain;"><span> ${text}</span>`
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.style.gap = '0.5rem'
    element.style.position = 'fixed'
    element.style.bottom = '50px'
    element.style.left = '50%'
    element.style.textShadow = '1px 1px 2px black'
    element.style.color = 'yellow'
    element.style.fontSize = '1.25rem'

    element.style.transform = 'translateX(-50%)'
    this.container.appendChild(element)

    const duration = 2000 // 2 seconds
    this.texts.push(new FloatingText(text, icon, duration, element))
  }

  // Update all active animations
  update(delta: number) {
    for (const text of this.texts) {
      text.update(delta)
    }
    // Remove finished animations
    this.texts = this.texts.filter((text) => !text.isFinished())
  }
}
