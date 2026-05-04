import { Component } from "../Component.js";

export class SelectionPulseComponent extends Component {
  constructor({ amplitude = 0.12, frequency = 5 } = {}) {
    super();
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.time = 0;
  }

  update(dt, entity) {
    if (entity.isSelected) {
      this.time += dt;
      const scale = 1 + this.amplitude * Math.sin(this.time * this.frequency);
      entity.mesh.scale.set(scale, scale, scale);
    } else {
      this.time = 0;
      entity.mesh.scale.set(1, 1, 1);
    }
  }
}
