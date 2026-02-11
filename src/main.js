import * as THREE from "three";

class Engine {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x223344);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(3, 2, 5);
    this.camera.lookAt(0, 0, 0);
    this.angle = 0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this._initObjects();

    this.clock = new THREE.Clock();

    window.addEventListener("resize", () => this.onResize());

    this.animate();
  }

  _initObjects() {
    const floorGeo = new THREE.PlaneGeometry(10,10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x88aa33})
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    this.cube = new THREE.Mesh(boxGeo, boxMat);
    this.cube.position.set(0, 1, 0);
    this.scene.add(this.cube);

    const sphereGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({color: 0xFF00FF});
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.sphere.position.set(2,1,0);
    this.scene.add(this.sphere);
    
    
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 5, 2);
    this.scene.add(dir);
    
    const dir1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dir1.position.set(-3, 5, -2);
    this.scene.add(dir1);
  }

  update(dt) {
    // вращение куба
    this.cube.rotation.y += dt * 1.2;
    this.cube.rotation.x += dt * 0.6;

    // вращение сферы вокруг куба
    this.angle += dt; // скорость (можно умножить: this.angle += dt * 1.5)

    const radius = 2;

    const cx = this.cube.position.x;
    const cy = this.cube.position.y; // если хочешь на той же высоте
    const cz = this.cube.position.z;

    this.sphere.position.x = cx + Math.cos(this.angle) * radius;
    this.sphere.position.z = cz + Math.sin(this.angle) * radius;
    this.sphere.position.y = cy; // или cy + 0.0 / +0.5 как надо
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate = () => {
    const dt = this.clock.getDelta();
    this.update(dt);
    this.render();
    requestAnimationFrame(this.animate);
  };

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

new Engine();
