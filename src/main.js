import "./style.css";
import * as THREE from "three";

class Engine {
  constructor() {
    this.info = document.getElementById("info");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x182233);

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
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(2, 2);
    this.objects = [];

    this.target = new THREE.Vector3(0, 1, 0);
    this.radius = 8;
    this.azimuth = Math.PI / 4;
    this.polar = 1.05;

    this.isDragging = false;
    this.hasMoved = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;

    this.hoveredObject = null;
    this.selectedObject = null;
    this.animationTime = 0;

    this.createScene();
    this.updateCamera();
    this.updateInfo();
    this.bindEvents();
    this.animate();
  }

  createScene() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({ color: 0x7d8aa1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 8, 4);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 3, 0);
    this.scene.add(pointLight);

    this.addObject(
      "Куб",
      "Куб (BoxGeometry)",
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      0x44aa88,
      -2.2,
      0.65,
      2.2
    );
    this.addObject(
      "Сфера",
      "Сфера (SphereGeometry)",
      new THREE.SphereGeometry(0.75, 32, 32),
      0xde6c95,
      2.2,
      0.75,
      2.2
    );
    this.addObject(
      "Конус",
      "Конус (ConeGeometry)",
      new THREE.ConeGeometry(0.75, 1.6, 32),
      0xf4b860,
      -2.2,
      0.8,
      -2.2
    );
    this.addObject(
      "Цилиндр",
      "Цилиндр (CylinderGeometry)",
      new THREE.CylinderGeometry(0.6, 0.6, 1.4, 32),
      0x6fa7ff,
      2.2,
      0.7,
      -2.2
    );
  }

  addObject(name, type, geometry, color, x, y, z) {
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: 0x000000,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      name,
      type,
      baseColor: new THREE.Color(color),
      baseScale: 1,
    };

    this.scene.add(mesh);
    this.objects.push(mesh);
  }

  bindEvents() {
    this.renderer.domElement.addEventListener("mousedown", (event) =>
      this.onMouseDown(event)
    );
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
    window.addEventListener("mouseup", (event) => this.onMouseUp(event));
    this.renderer.domElement.addEventListener("mouseleave", () =>
      this.setHoveredObject(null)
    );
    this.renderer.domElement.addEventListener("wheel", (event) =>
      this.onWheel(event)
    );
    window.addEventListener("resize", () => this.onResize());
  }

  updateCamera() {
    const sinPolar = Math.sin(this.polar);

    this.camera.position.set(
      this.target.x + this.radius * sinPolar * Math.sin(this.azimuth),
      this.target.y + this.radius * Math.cos(this.polar),
      this.target.z + this.radius * sinPolar * Math.cos(this.azimuth)
    );

    this.camera.lookAt(this.target);
  }

  updateMouse(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      this.mouse.set(2, 2);
      return false;
    }

    this.mouse.set((x / rect.width) * 2 - 1, -((y / rect.height) * 2 - 1));
    return true;
  }

  getIntersectedObject() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects);
    return intersects.length > 0 ? intersects[0].object : null;
  }

  setHoveredObject(object) {
    this.hoveredObject = object;
    this.updateObjectStyles();
  }

  setSelectedObject(object) {
    this.selectedObject = object;
    this.animationTime = 0;
    this.updateObjectStyles();
    this.updateInfo();
  }

  updateObjectStyles() {
    for (const object of this.objects) {
      object.material.color.copy(object.userData.baseColor);
      object.material.emissive.setHex(0x000000);

      if (object === this.hoveredObject) {
        object.material.emissive.setRGB(0.2, 0.2, 0.2);
      }

      if (object === this.selectedObject) {
        object.material.emissive.setRGB(0.4, 0.4, 0.4);
      }
    }
  }

  updateInfo() {
    if (!this.selectedObject) {
      this.info.textContent = "Выбранный объект: нет";
      return;
    }

    this.info.textContent =
      `Имя: ${this.selectedObject.userData.name}\n` +
      `Тип: ${this.selectedObject.userData.type}`;
  }

  onMouseDown(event) {
    if (event.button !== 0 || !this.updateMouse(event)) {
      return;
    }

    this.isDragging = true;
    this.hasMoved = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseMove(event) {
    const inside = this.updateMouse(event);

    if (this.isDragging) {
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;

      if (Math.hypot(event.clientX - this.startX, event.clientY - this.startY) > 4) {
        this.hasMoved = true;
      }

      this.azimuth -= dx * 0.008;
      this.polar += dy * 0.008;
      this.polar = THREE.MathUtils.clamp(this.polar, 0.45, 1.45);
      this.updateCamera();

      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }

    if (inside) {
      this.setHoveredObject(this.getIntersectedObject());
    } else {
      this.setHoveredObject(null);
    }
  }

  onMouseUp(event) {
    if (event.button !== 0) {
      return;
    }

    const inside = this.updateMouse(event);

    if (this.isDragging && !this.hasMoved && inside) {
      this.setSelectedObject(this.getIntersectedObject());
    }

    this.isDragging = false;
    this.hasMoved = false;
  }

  onWheel(event) {
    if (!this.updateMouse(event)) {
      return;
    }

    event.preventDefault();
    this.radius += event.deltaY * 0.01;
    this.radius = THREE.MathUtils.clamp(this.radius, 4, 14);
    this.updateCamera();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    const dt = this.clock.getDelta();
    this.animationTime += dt;

    for (const object of this.objects) {
      if (object === this.selectedObject) {
        const scale = 1 + 0.12 * Math.sin(this.animationTime * 5);
        object.scale.set(scale, scale, scale);
      } else {
        object.scale.set(1, 1, 1);
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.renderer.render(this.scene, this.camera);
  }
}

new Engine();
