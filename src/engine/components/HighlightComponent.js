import { Component } from "../Component.js";

export class HighlightComponent extends Component {
  constructor({ hover = 0.2, selected = 0.4 } = {}) {
    super();
    this.hoverIntensity = hover;
    this.selectedIntensity = selected;
  }

  update(_dt, entity) {
    const material = entity.mesh.material;
    if (entity.userData.baseColor) {
      material.color.copy(entity.userData.baseColor);
    }
    material.emissive.setHex(0x000000);

    if (entity.isHovered) {
      const v = this.hoverIntensity;
      material.emissive.setRGB(v, v, v);
    }
    if (entity.isSelected) {
      const v = this.selectedIntensity;
      material.emissive.setRGB(v, v, v);
    }
  }
}
