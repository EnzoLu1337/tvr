export class FpsCounter {
  constructor({ elementId = "fps", interval = 0.3 } = {}) {
    this.element = document.getElementById(elementId);
    this.interval = interval;
    this.frameCount = 0;
    this.elapsed = 0;
  }

  update(dt) {
    this.frameCount++;
    this.elapsed += dt;
    if (this.elapsed >= this.interval && this.element) {
      const fps = Math.round(this.frameCount / this.elapsed);
      this.element.textContent = `FPS: ${fps}`;
      this.frameCount = 0;
      this.elapsed = 0;
    }
  }
}
