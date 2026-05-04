import * as THREE from "three";

export class Engine {
  constructor({ container = document.body, background = 0x182233 } = {}) {
    this.container = container;
    this.scenes = [];
    this.activeScene = null;
    this.systems = [];

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.background = new THREE.Color(background);

    this.running = false;
    this._rafId = null;
    this._tick = this._tick.bind(this);

    window.addEventListener("resize", () => this._onResize());
  }

  addScene(scene) {
    this.scenes.push(scene);
    if (!scene.three.background) {
      scene.three.background = this.background;
    }
    if (!this.activeScene) this.activeScene = scene;
    return this;
  }

  removeScene(scene) {
    const idx = this.scenes.indexOf(scene);
    if (idx >= 0) this.scenes.splice(idx, 1);
    if (this.activeScene === scene) {
      this.activeScene = this.scenes[0] ?? null;
    }
    return this;
  }

  setActiveScene(scene) {
    if (!this.scenes.includes(scene)) this.addScene(scene);
    this.activeScene = scene;
    return this;
  }

  addSystem(system) {
    this.systems.push(system);
    system.onAttach?.(this);
    return this;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this._tick();
  }

  stop() {
    this.running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  _tick() {
    if (!this.running) return;
    this._rafId = requestAnimationFrame(this._tick);

    const dt = this.clock.getDelta();

    for (const system of this.systems) {
      system.update?.(dt, this);
    }

    if (this.activeScene) {
      this.activeScene.update(dt);
      this.renderer.render(this.activeScene.three, this.camera);
    }
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
