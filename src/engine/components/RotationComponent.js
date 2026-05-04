import { Component } from "../Component.js";

export class RotationComponent extends Component {
  constructor({ axis = "y", speed = 1 } = {}) {
    super();
    this.axis = axis;
    this.speed = speed;
  }

  update(dt, entity) {
    entity.mesh.rotation[this.axis] += this.speed * dt;
  }
}
