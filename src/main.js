import "./style.css";
import * as THREE from "three";

import { Engine } from "./engine/Engine.js";
import { Scene } from "./engine/Scene.js";
import { Entity } from "./engine/Entity.js";

import { OrbitCameraController } from "./engine/systems/OrbitCameraController.js";
import { PickingSystem } from "./engine/systems/PickingSystem.js";
import { FpsCounter } from "./engine/systems/FpsCounter.js";
import { InfoPanel } from "./engine/systems/InfoPanel.js";

import { RotationComponent } from "./engine/components/RotationComponent.js";
import { PulseScaleComponent } from "./engine/components/PulseScaleComponent.js";
import { SelectionPulseComponent } from "./engine/components/SelectionPulseComponent.js";
import { HighlightComponent } from "./engine/components/HighlightComponent.js";

function buildFloor() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshStandardMaterial({ color: 0x7d8aa1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
}

function buildLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);

  const directional = new THREE.DirectionalLight(0xffffff, 1.2);
  directional.position.set(5, 8, 4);
  directional.castShadow = true;

  const point = new THREE.PointLight(0xffffff, 0.8);
  point.position.set(0, 3, 0);

  return [ambient, directional, point];
}

function buildEntity(name, type, geometry, color, position) {
  const material = new THREE.MeshStandardMaterial({ color, emissive: 0x000000 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return new Entity(mesh, { name, type });
}

const engine = new Engine();
const scene = new Scene();

scene.add(buildFloor());
for (const light of buildLights()) scene.add(light);

const cube = buildEntity(
  "Куб",
  "Куб (BoxGeometry)",
  new THREE.BoxGeometry(1.3, 1.3, 1.3),
  0x44aa88,
  [-2.2, 0.65, 2.2]
);
cube.addComponent(new HighlightComponent());
cube.addComponent(new RotationComponent({ axis: "y", speed: 0.8 }));
scene.add(cube);

const sphere = buildEntity(
  "Сфера",
  "Сфера (SphereGeometry)",
  new THREE.SphereGeometry(0.75, 32, 32),
  0xde6c95,
  [2.2, 0.75, 2.2]
);
sphere.addComponent(new HighlightComponent());
sphere.addComponent(new PulseScaleComponent({ amplitude: 0.1, frequency: 2 }));
scene.add(sphere);

const cone = buildEntity(
  "Конус",
  "Конус (ConeGeometry)",
  new THREE.ConeGeometry(0.75, 1.6, 32),
  0xf4b860,
  [-2.2, 0.8, -2.2]
);
cone.addComponent(new HighlightComponent());
cone.addComponent(new RotationComponent({ axis: "x", speed: 1.2 }));
scene.add(cone);

const cylinder = buildEntity(
  "Цилиндр",
  "Цилиндр (CylinderGeometry)",
  new THREE.CylinderGeometry(0.6, 0.6, 1.4, 32),
  0x6fa7ff,
  [2.2, 0.7, -2.2]
);
cylinder.addComponent(new HighlightComponent());
cylinder.addComponent(new SelectionPulseComponent({ amplitude: 0.12, frequency: 5 }));
scene.add(cylinder);

engine.addScene(scene);
engine.setActiveScene(scene);

const orbit = new OrbitCameraController();
const picking = new PickingSystem(orbit);
engine.addSystem(orbit);
engine.addSystem(picking);
engine.addSystem(new FpsCounter());
engine.addSystem(new InfoPanel(picking));

engine.start();
