import { levelUpMessages } from './database/level-up-messages'
import { skills } from './database/skills'
import { Skills } from './skills'

export class Toaster {
  private static instance: Toaster
  private rootContainerElement: HTMLDivElement
  private toastCount = 0

  private constructor() {
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

  static getInstance() {
    if (!Toaster.instance) {
      Toaster.instance = new Toaster()
    }
    return Toaster.instance
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

  levelUpToast(skill: keyof Skills, level: number) {
    const skillData = skills.get(skill)

    if (!skillData) {
      throw new Error(`Skill ${skill} not found`)
    }

    const toast = document.createElement('div')
    toast.style.position = 'fixed'
    toast.style.top = '50%'
    toast.style.left = '50%'
    toast.style.border = '1px solid black'
    toast.style.padding = '1rem'
    toast.style.background = '#EAEAB4'
    toast.style.color = '#333'
    toast.style.marginBottom = '1rem'
    toast.style.width = '100%'
    toast.style.maxWidth = '30rem'
    toast.style.height = '20rem'
    toast.style.justifyContent = 'center'
    toast.style.transition = 'opacity 0.3s ease-in-out'
    toast.style.transform = 'translate(-50%, -50%)'
    toast.style.display = 'flex'
    toast.style.flexDirection = 'column'
    toast.style.alignItems = 'center'
    toast.style.textAlign = 'center'
    toast.style.gap = '1rem'
    toast.style.borderRadius = '0.25rem'
    toast.style.boxShadow = '0 0 1rem rgba(0,0,0,0.5)'

    const image = document.createElement('img')
    image.src = skillData.asset
    image.style.position = 'static'
    image.style.display = 'block'
    image.style.width = '8rem'
    image.style.height = '8rem'
    image.style.objectFit = 'contain'
    toast.appendChild(image)

    const text = document.createElement('div')
    text.textContent = `Level up! ${skillData.name} is now level ${level}`
    toast.appendChild(text)
    document.body.appendChild(toast)

    const customMessage = levelUpMessages.get(skill)?.get(level)
    if (customMessage) {
      const customMessageElement = document.createElement('div')
      customMessageElement.textContent = customMessage
      toast.appendChild(customMessageElement)
    }

    const okButton = document.createElement('button')
    okButton.textContent = 'Thanks!'

    let timeoutId = setTimeout(() => {
      toast.style.opacity = '0'
      setTimeout(() => {
        clearTimeout(timeoutId)
        toast.remove()
      }, 300)
    }, 20000)

    toast.appendChild(okButton)
    okButton.addEventListener('click', () => {
      toast.remove()
    })

    this.toastCount++
  }
}
