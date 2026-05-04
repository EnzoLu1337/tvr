import * as THREE from "three";

export class PickingSystem {
  constructor(orbit) {
    this.orbit = orbit;
    this.engine = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(2, 2);
    this.mouseInside = false;
    this.hoveredEntity = null;
    this.selectedEntity = null;
    this.selectionListeners = [];
  }

  onAttach(engine) {
    this.engine = engine;
    const dom = engine.renderer.domElement;

    dom.addEventListener("mousedown", (e) => this._updateMouse(e));
    window.addEventListener("mousemove", (e) => this._updateMouse(e));
    dom.addEventListener("mouseleave", () => {
      this.mouseInside = false;
      this._setHovered(null);
    });
    window.addEventListener("mouseup", (e) => this._onMouseUp(e));
    dom.addEventListener("wheel", (e) => this._updateMouse(e));
  }

  onSelectionChange(callback) {
    this.selectionListeners.push(callback);
  }

  update() {
    if (!this.engine?.activeScene) return;

    if (this.mouseInside) {
      this._setHovered(this._pick());
    } else {
      this._setHovered(null);
    }
  }

  _updateMouse(event) {
    const dom = this.engine.renderer.domElement;
    const rect = dom.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      this.mouse.set(2, 2);
      this.mouseInside = false;
      return;
    }

    this.mouse.set((x / rect.width) * 2 - 1, -((y / rect.height) * 2 - 1));
    this.mouseInside = true;
  }

  _pick() {
    const scene = this.engine.activeScene;
    this.raycaster.setFromCamera(this.mouse, this.engine.camera);
    const meshes = scene.getEntityMeshes();
    const intersects = this.raycaster.intersectObjects(meshes);
    if (intersects.length === 0) return null;
    return scene.entityFromMesh(intersects[0].object);
  }

  _setHovered(entity) {
    if (this.hoveredEntity === entity) return;
    if (this.hoveredEntity) this.hoveredEntity.isHovered = false;
    this.hoveredEntity = entity;
    if (entity) entity.isHovered = true;
  }

  _setSelected(entity) {
    if (this.selectedEntity === entity) return;
    if (this.selectedEntity) this.selectedEntity.isSelected = false;
    this.selectedEntity = entity;
    if (entity) entity.isSelected = true;
    for (const listener of this.selectionListeners) {
      listener(entity);
    }
  }

  _onMouseUp(event) {
    if (event.button !== 0) return;

    this._updateMouse(event);

    const wasClickWithoutDrag =
      this.orbit?.isDragging !== undefined
        ? !this.orbit.hasMoved
        : true;

    if (wasClickWithoutDrag && this.mouseInside) {
      this._setSelected(this._pick());
    }
  }
}
