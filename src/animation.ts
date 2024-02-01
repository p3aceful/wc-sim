export class SpriteAnimation {
  private currentFrame = 0
  private currentFrameTime = 0
  constructor(
    private image: HTMLImageElement,
    private frameWidth: number,
    private frameHeight: number,
    private totalDuration: number,
    private totalFrames: number
  ) {}

  update(delta: number) {
    this.currentFrameTime += delta
    if (this.currentFrameTime > this.totalDuration / this.totalFrames) {
      this.currentFrameTime = 0
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames
    }
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    // Calculate the x position of the current frame in the sprite sheet
    const frameX = this.currentFrame * this.frameWidth

    // Draw the current frame
    ctx.drawImage(this.image, frameX, 0, this.frameWidth, this.frameHeight, x, y, width, height)
  }
}

export class Animation {
  private spriteAnimation: SpriteAnimation
  private animationIntervalId: number | null = null
  private root: HTMLElement
  private canvasContext: CanvasRenderingContext2D
  constructor(root: HTMLElement, spriteAnimation: SpriteAnimation) {
    this.root = root
    this.spriteAnimation = spriteAnimation
    const canvas = document.createElement('canvas')
    canvas.width = 50
    canvas.height = 50
    canvas.style.position = 'absolute'
    canvas.style.bottom = '0'
    canvas.style.left = '100%'
    this.root.appendChild(canvas)
    this.canvasContext = canvas.getContext('2d')!
  }

  start(): number {
    this.animationIntervalId = setInterval(() => {
      this.spriteAnimation.update(600 / 4)
      this.spriteAnimation.render(this.canvasContext, 0, 0, 50, 50)
    }, 600 / 4)

    return this.animationIntervalId
  }

  stop() {
    clearInterval(this.animationIntervalId!)
  }
}
