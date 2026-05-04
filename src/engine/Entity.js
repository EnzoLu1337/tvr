export class Entity {
  constructor(mesh, { name = "", type = "" } = {}) {
    this.mesh = mesh;
    this.components = [];
    this.isHovered = false;
    this.isSelected = false;

    this.userData = {
      name,
      type,
      baseColor: mesh.material?.color ? mesh.material.color.clone() : null,
      baseScale: mesh.scale.clone(),
    };

    mesh.userData.entity = this;
  }

  addComponent(component) {
    this.components.push(component);
    component.onAdd?.(this);
    return this;
  }

  removeComponent(component) {
    const idx = this.components.indexOf(component);
    if (idx >= 0) {
      this.components.splice(idx, 1);
      component.onRemove?.(this);
    }
    return this;
  }

  getComponent(Class) {
    return this.components.find((c) => c instanceof Class) ?? null;
  }

  update(dt) {
    for (const component of this.components) {
      component.update(dt, this);
    }
  }
}
