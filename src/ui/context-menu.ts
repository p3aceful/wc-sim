export interface ContextMenuOptions {
  id: string
  name: string
}

export class ContextMenu {
  private menuElement: HTMLElement | null = null
  private static currentMenu: ContextMenu | null = null

  constructor(private parent: HTMLElement) {}

  show(
    name: string,
    event: MouseEvent,
    options: ContextMenuOptions[],
    onOptionSelected: (optionId: string) => void
  ) {
    if (this.menuElement) {
      this.hide()
    }

    const menu = document.createElement('div')
    menu.classList.add('context-menu')
    const menuTitle = document.createElement('div')
    menuTitle.classList.add('context-menu__title')
    menuTitle.textContent = name
    menu.appendChild(menuTitle)
    const content = this.createContextMenuContent(options, onOptionSelected)
    menu.appendChild(content)
    this.parent.appendChild(menu)
    this.menuElement = menu

    const spaceRight = window.innerWidth - event.clientX
    const spaceBottom = window.innerHeight - event.clientY

    const dropdownWidth = menu.offsetWidth
    const dropdownHeight = menu.offsetHeight

    if (spaceRight < dropdownWidth) {
      menu.style.left = `${event.clientX - dropdownWidth}px`
    } else {
      menu.style.left = `${event.clientX}px`
    }

    if (spaceBottom < dropdownHeight) {
      menu.style.top = `${event.clientY - dropdownHeight}px`
    } else {
      menu.style.top = `${event.clientY}px`
    }
    menu.style.position = 'fixed'
    menu.style.zIndex = '1000'

    this.handleClickOutside = this.handleClickOutside.bind(this)
    document.addEventListener('click', this.handleClickOutside)
    ContextMenu.currentMenu = this
  }

  private handleClickOutside(event: MouseEvent) {
    if (this.menuElement && !this.menuElement.contains(event.target as Node)) {
      this.hide()
    } else {
      // console.log('Wont hide')
    }
  }

  private createContextMenuContent(
    options: ContextMenuOptions[],
    onOptionSelected: (optionId: string) => void
  ) {
    const menu = document.createElement('div')
    menu.classList.add('context-menu__content')
    for (const option of options) {
      const element = document.createElement('button')
      element.classList.add('context-menu__item')
      element.textContent = option.name
      element.addEventListener('click', () => {
        onOptionSelected(option.id)
        this.hide()
      })
      menu.appendChild(element)
    }

    return menu
  }

  hide() {
    if (this.menuElement) {
      this.menuElement.remove()
      this.menuElement = null
      document.removeEventListener('click', this.handleClickOutside)
    }

    if (ContextMenu.currentMenu === this) {
      ContextMenu.currentMenu = null
    }
  }
}
