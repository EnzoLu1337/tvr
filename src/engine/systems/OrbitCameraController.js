import * as THREE from "three";

export class OrbitCameraController {
  constructor({
    target = new THREE.Vector3(0, 1, 0),
    radius = 8,
    azimuth = Math.PI / 4,
    polar = 1.05,
    minPolar = 0.45,
    maxPolar = 1.45,
    minRadius = 4,
    maxRadius = 14,
    rotateSpeed = 0.008,
    zoomSpeed = 0.01,
    dragThreshold = 4,
  } = {}) {
    this.target = target;
    this.radius = radius;
    this.azimuth = azimuth;
    this.polar = polar;
    this.minPolar = minPolar;
    this.maxPolar = maxPolar;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.rotateSpeed = rotateSpeed;
    this.zoomSpeed = zoomSpeed;
    this.dragThreshold = dragThreshold;

    this.isDragging = false;
    this.hasMoved = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;

    this.engine = null;
  }

  onAttach(engine) {
    this.engine = engine;
    const dom = engine.renderer.domElement;

    dom.addEventListener("mousedown", (e) => this._onMouseDown(e));
    window.addEventListener("mousemove", (e) => this._onMouseMove(e));
    window.addEventListener("mouseup", (e) => this._onMouseUp(e));
    dom.addEventListener("wheel", (e) => this._onWheel(e), { passive: false });

    this._applyToCamera();
  }

  update() {}

  _applyToCamera() {
    const camera = this.engine.camera;
    const sinPolar = Math.sin(this.polar);

    camera.position.set(
      this.target.x + this.radius * sinPolar * Math.sin(this.azimuth),
      this.target.y + this.radius * Math.cos(this.polar),
      this.target.z + this.radius * sinPolar * Math.cos(this.azimuth)
    );
    camera.lookAt(this.target);
  }

  _onMouseDown(event) {
    if (event.button !== 0) return;

    this.isDragging = true;
    this.hasMoved = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  _onMouseMove(event) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;

    if (
      Math.hypot(event.clientX - this.startX, event.clientY - this.startY) >
      this.dragThreshold
    ) {
      this.hasMoved = true;
    }

    this.azimuth -= dx * this.rotateSpeed;
    this.polar += dy * this.rotateSpeed;
    this.polar = THREE.MathUtils.clamp(this.polar, this.minPolar, this.maxPolar);
    this._applyToCamera();

    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  _onMouseUp(event) {
    if (event.button !== 0) return;
    this.isDragging = false;
  }

  _onWheel(event) {
    event.preventDefault();
    this.radius += event.deltaY * this.zoomSpeed;
    this.radius = THREE.MathUtils.clamp(this.radius, this.minRadius, this.maxRadius);
    this._applyToCamera();
  }
}
