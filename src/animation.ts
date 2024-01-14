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
