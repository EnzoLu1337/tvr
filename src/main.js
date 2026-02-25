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
    this.lightTime = 0;
    this.lightColorA = new THREE.Color(0xFF00FF);
    this.lightColorB = new THREE.Color(0xCD5C5C);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this._initObjects();

    this.clock = new THREE.Clock();

    window.addEventListener("resize", () => this.onResize());

    this.animate();
  }

  _initObjects() {
    const floorGeo = new THREE.PlaneGeometry(10,10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x808080})
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x44aa88, roughness: 0.7, metalness: 0.3 });
    this.cube = new THREE.Mesh(boxGeo, boxMat);
    this.cube.position.set(0, 1, 0);
    this.cube.receiveShadow = true;
    this.cube.castShadow = true;
    this.scene.add(this.cube);

    const sphereGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({color: 0xFF00FF, metalness: 0.8, roughness: 0.5});
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.sphere.position.set(2,1,0);
    this.sphere.receiveShadow = true;
    this.sphere.castShadow = true;
    this.scene.add(this.sphere);
    
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(3, 5, 2);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    this.pointLight = new THREE.PointLight(0x0000ff, 1);
    this.pointLight.position.set(0.5, 2.5, 0.5);
    this.pointLight.castShadow = true;
    this.scene.add(this.pointLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambLight);
  }

  update(dt) {
    // вращение куба
    this.cube.rotation.y += dt * 1.2;
    this.cube.rotation.x += dt * 0.6;

    // вращение сферы вокруг куба
    this.angle += dt; 

    const radius = 2;

    const cx = this.cube.position.x;
    const cy = this.cube.position.y;
    const cz = this.cube.position.z;

    this.sphere.position.x = cx + Math.cos(this.angle) * radius;
    this.sphere.position.z = cz + Math.sin(this.angle) * radius;
    this.sphere.position.y = cy;

    this.lightTime += dt;
    const s = (Math.sin(this.lightTime * 1.8) + 1) * 0.5;
    this.pointLight.intensity = 1 + 4 * s;
    this.pointLight.color.lerpColors(this.lightColorA, this.lightColorB, s);
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
