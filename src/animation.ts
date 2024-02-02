export class SpriteAnimation {
  private currentFrame = 0
  private currentFrameTime = 0
  private loopCount = 0
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
      if (this.currentFrame === 0) {
        this.loopCount++
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    // Calculate the x position of the current frame in the sprite sheet
    const frameX = this.currentFrame * this.frameWidth

    // Draw the current frame
    ctx.drawImage(this.image, frameX, 0, this.frameWidth, this.frameHeight, x, y, width, height)
  }

  hasLooped() {
    return this.loopCount > 0
  }
}

export class Animation {
  private spriteAnimation: SpriteAnimation
  private root: HTMLElement
  private canvasContext: CanvasRenderingContext2D
  private isLooping: boolean
  private onFinish?: () => void

  constructor(
    root: HTMLElement,
    spriteAnimation: SpriteAnimation,
    options: { isLooping?: boolean; onFinish?: () => void }
  ) {
    this.root = root
    this.spriteAnimation = spriteAnimation
    this.isLooping = options.isLooping ?? true
    this.onFinish = options.onFinish
    const canvas = document.createElement('canvas')
    canvas.width = 75
    canvas.height = 75
    this.root.appendChild(canvas)
    this.canvasContext = canvas.getContext('2d')!
  }

  update(delta: number) {
    this.spriteAnimation.update(delta)
    this.spriteAnimation.render(this.canvasContext, 0, 0, 75, 75)

    if (this.isFinished()) {
      this.onFinish?.()
    }
  }

  isFinished(): boolean {
    return !this.isLooping && this.spriteAnimation.hasLooped()
  }
}

export type AnimationConfig = {
  imageUrl: string
  frameWidth: number
  frameHeight: number
  totalDuration: number
  totalFrames: number
}

export const animationConfigs: Record<string, AnimationConfig> = {
  woodcutting: {
    imageUrl: '../woodcut-animation.png',
    frameWidth: 200,
    frameHeight: 200,
    totalDuration: 1000,
    totalFrames: 4,
  },
  'light-fire': {
    imageUrl: '../light-fire-animation.png',
    frameWidth: 200,
    frameHeight: 200,
    totalDuration: 1000,
    totalFrames: 4,
  },
  'succeed-light-fire': {
    imageUrl: '../succeed-light-fire-animation.png',
    frameWidth: 200,
    frameHeight: 200,
    totalDuration: 1200,
    totalFrames: 4,
  },
}

export class AnimationFactory {
  createAnimation(
    imageUrl: string,
    frameWidth: number,
    frameHeight: number,
    totalDuration: number,
    totalFrames: number
  ): Promise<SpriteAnimation> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        resolve(new SpriteAnimation(image, frameWidth, frameHeight, totalDuration, totalFrames))
      }

      image.onerror = reject
      image.src = imageUrl
    })
  }

  getAnimation(animationType: keyof typeof animationConfigs): Promise<SpriteAnimation> {
    const config = animationConfigs[animationType]

    return this.createAnimation(
      config.imageUrl,
      config.frameWidth,
      config.frameHeight,
      config.totalDuration,
      config.totalFrames
    )
  }
}

export class AnimationManager {
  private animations: Map<string, Animation> = new Map()
  private lastTime: number | null = null

  startAnimation(animationId: string, animation: Animation) {
    this.animations.set(animationId, animation)
    if (this.animations.size === 1) {
      this.update()
    }
  }

  stopAnimation(id: string) {
    this.animations.delete(id)
  }

  private update() {
    const now = performance.now()
    const delta = this.lastTime !== null ? now - (this.lastTime || now) : 0
    this.lastTime = now

    this.animations.forEach((animation, id) => {
      animation.update(delta)
      if (animation.isFinished()) {
        this.stopAnimation(id)
      }
    })

    if (this.animations.size > 0) {
      requestAnimationFrame(() => this.update())
    }
  }

  clear() {
    this.animations.clear()
  }
}

// export class SpriteAnimation {
//   private currentFrame = 0
//   private currentFrameTime = 0
//   private frameDuration: number
//   public hasLooped = false
//   public shouldLoop: boolean

//   constructor(
//     private image: HTMLImageElement,
//     private frameWidth: number,
//     private frameHeight: number,
//     private totalDuration: number,
//     private totalFrames: number,
//     shouldLoop: boolean = true
//   ) {
//     this.shouldLoop = shouldLoop
//     this.frameDuration = this.totalDuration / totalFrames
//   }

//   update(delta: number) {
//     this.currentFrameTime += delta
//     if (this.currentFrameTime > this.frameDuration) {
//       this.currentFrameTime -= this.frameDuration
//       this.currentFrame = (this.currentFrame + 1) % this.totalFrames
//       if (this.currentFrame === 0) {
//         this.hasLooped = true
//       }
//     }
//   }

//   render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
//     // Calculate the x position of the current frame in the sprite sheet
//     const frameX = this.currentFrame * this.frameWidth

//     // Draw the current frame
//     ctx.drawImage(this.image, frameX, 0, this.frameWidth, this.frameHeight, x, y, width, height)
//   }
// }

// export class Animation {
//   private spriteAnimation: SpriteAnimation
//   private animationIntervalId: number | null = null
//   private root: HTMLElement
//   private canvasContext: CanvasRenderingContext2D
//   constructor(root: HTMLElement, spriteAnimation: SpriteAnimation, private onFinish: () => void) {
//     this.root = root
//     this.spriteAnimation = spriteAnimation
//     const canvas = document.createElement('canvas')
//     canvas.width = 50
//     canvas.height = 50
//     this.root.appendChild(canvas)
//     this.canvasContext = canvas.getContext('2d')!
//   }

//   isFinished() {
//     return this.spriteAnimation.hasLooped && !this.spriteAnimation.shouldLoop
//   }

//   update(delta: number) {
//     this.spriteAnimation.update(delta)
//     this.spriteAnimation.render(this.canvasContext, 0, 0, 50, 50)
//   }

//   start(): number {
//     this.animationIntervalId = setInterval(() => {
//       this.spriteAnimation.update(600 / 4)
//       this.spriteAnimation.render(this.canvasContext, 0, 0, 50, 50)
//     }, 600 / 4)

//     return this.animationIntervalId
//   }

//   stop() {
//     clearInterval(this.animationIntervalId!)
//   }
// }
