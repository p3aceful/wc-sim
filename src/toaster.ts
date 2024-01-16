export class Toaster {
  private rootContainerElement: HTMLDivElement
  private toastCount = 0
  constructor() {
    this.rootContainerElement = document.createElement('div')
    this.rootContainerElement.style.position = 'fixed'
    this.rootContainerElement.style.bottom = '0'
    this.rootContainerElement.style.right = '0'
    this.rootContainerElement.style.display = 'flex'
    this.rootContainerElement.style.flexDirection = 'column'
    this.rootContainerElement.style.alignItems = 'flex-end'
    this.rootContainerElement.style.padding = '1rem'
    this.rootContainerElement.style.pointerEvents = 'none'
    this.rootContainerElement.style.zIndex = '1000'
    document.body.appendChild(this.rootContainerElement)
  }

  toast(message: string) {
    const toast = document.createElement('div')
    toast.style.position = 'relative'
    toast.style.border = '1px solid black'
    toast.style.padding = '1rem'
    toast.style.background = '#555'
    toast.style.color = 'yellow'
    toast.style.pointerEvents = 'none'
    toast.style.marginBottom = '1rem'
    toast.style.width = '20rem'
    toast.style.justifyContent = 'center'
    toast.style.transition = 'opacity 0.3s ease-in-out'
    toast.innerHTML = message
    toast.addEventListener('click', () => {
      this.rootContainerElement.removeChild(toast)
    })

    this.rootContainerElement.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = '0'
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 4000)

    this.toastCount++
  }
}
