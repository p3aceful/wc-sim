export class TabViewUI {
  private tabs: { [key: string]: HTMLElement } = {}

  constructor(
    private root: HTMLElement,
    private tabContentGenerators: { [key: string]: () => HTMLElement }
  ) {
    this.createTabs()
  }

  private createTabs() {
    console.log('Creating tabs')
    const tabContainer = document.createElement('div')
    tabContainer.classList.add('tab-container')

    Object.keys(this.tabContentGenerators).forEach((tabName) => {
      const tabButton = document.createElement('button')
      tabButton.innerText = tabName
      tabButton.classList.add('tab-button')
      tabButton.dataset.tab = tabName
      tabContainer.appendChild(tabButton)
      tabButton.addEventListener('click', () => {
        this.selectTab(tabName)
      })

      const tabContent = this.tabContentGenerators[tabName]()
      tabContent.classList.add('tab-content')
      tabContent.id = tabName
      this.root.appendChild(tabContent)

      this.tabs[tabName] = tabContent
    })

    this.root.prepend(tabContainer)
    this.selectTab(Object.keys(this.tabContentGenerators)[0])
  }

  selectTab(tabName: string) {
    const tabContainer = this.root.querySelector('.tab-container')!

    Object.keys(this.tabs).forEach((tab) => {
      const tabButton = tabContainer.querySelector(`[data-tab="${tab}"]`)!
      if (tab === tabName) {
        this.tabs[tab].style.display = 'block'
        tabButton.classList.add('tab-button--active')
      } else {
        this.tabs[tab].style.display = 'none'
        tabButton.classList.remove('tab-button--active')
      }
    })
  }
}
