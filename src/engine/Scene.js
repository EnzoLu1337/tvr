import * as THREE from "three";
import { Entity } from "./Entity.js";

export class Scene {
  constructor() {
    this.three = new THREE.Scene();
    this.entities = [];
    this.meshToEntity = new Map();
  }

  add(item) {
    if (item instanceof Entity) {
      this.entities.push(item);
      this.meshToEntity.set(item.mesh, item);
      this.three.add(item.mesh);
    } else {
      this.three.add(item);
    }
    return this;
  }

  remove(item) {
    if (item instanceof Entity) {
      const idx = this.entities.indexOf(item);
      if (idx >= 0) this.entities.splice(idx, 1);
      this.meshToEntity.delete(item.mesh);
      this.three.remove(item.mesh);
    } else {
      this.three.remove(item);
    }
    return this;
  }

  entityFromMesh(mesh) {
    return this.meshToEntity.get(mesh) ?? null;
  }

  getEntityMeshes() {
    return this.entities.map((e) => e.mesh);
  }

  update(dt) {
    for (const entity of this.entities) {
      entity.update(dt);
    }
  }
}
