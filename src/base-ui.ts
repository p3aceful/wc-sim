export class BaseUI {
  private static currentPopover: BaseUI | null = null
  private existingPopover: Popover | null = null
  private items = new Map<string, UIItem>()

  constructor(
    private element: HTMLElement,
    private shouldOpenPopover: (target: HTMLElement) => boolean,
    private getPopoverContent: (target: HTMLElement) => HTMLElement
  ) {
    this.setupPopover()
  }

  setupPopover() {
    this.element.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return
      }

      if (this.shouldOpenPopover(event.target)) {
        this.openPopover(event.target, event, this.getPopoverContent(event.target))
        event.stopPropagation()
      }
    })

    document.addEventListener('click', () => {
      this.closePopover()
    })
  }

  addItem(item: UIItem) {
    this.items.set(item.id, item)
  }

  openPopover(target: HTMLElement, event: MouseEvent, content: HTMLElement) {
    if (BaseUI.currentPopover) {
      BaseUI.currentPopover.closePopover()
    }
    this.closePopover()
    this.existingPopover = new Popover(target, event, content)
    this.existingPopover.open()
    BaseUI.currentPopover = this
  }

  closePopover() {
    if (this.existingPopover) {
      this.existingPopover.close()
      this.existingPopover = null
    }

    if (BaseUI.currentPopover === this) {
      BaseUI.currentPopover = null
    }
  }
}

export class Popover {
  private popoverElement: HTMLElement | null = null
  private static popoverContainer: HTMLElement = document.body.appendChild(
    document.createElement('div')
  )
  constructor(
    private target: HTMLElement,
    private event: MouseEvent,
    private content: HTMLElement
  ) {}

  open() {
    this.popoverElement = document.createElement('div')
    this.popoverElement.classList.add('popover')
    this.content.classList.add('popover__content')
    this.popoverElement.appendChild(this.content)

    Popover.popoverContainer.appendChild(this.popoverElement)

    const targetRect = this.target.getBoundingClientRect()
    console.log({ targetRect, target: this.target })
    this.popoverElement.style.left = `${this.event.clientX + window.scrollX}px`
    this.popoverElement.style.top = `${this.event.clientY + window.scrollY}px`
  }

  close() {
    if (this.popoverElement) {
      this.popoverElement.remove()
      this.popoverElement = null
    }
  }
}

export type UIItem = {
  id: string
  name: string
  popoverContent?: HTMLElement
  command?: () => void
}
