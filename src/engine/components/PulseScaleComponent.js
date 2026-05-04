import { Component } from "../Component.js";

export class PulseScaleComponent extends Component {
  constructor({ amplitude = 0.12, frequency = 5, base = 1 } = {}) {
    super();
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.base = base;
    this.time = 0;
  }

  update(dt, entity) {
    this.time += dt;
    const scale = this.base + this.amplitude * Math.sin(this.time * this.frequency);
    entity.mesh.scale.set(scale, scale, scale);
  }
}
