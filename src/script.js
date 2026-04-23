import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

import { Sky } from "three/addons/objects/Sky.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Helper function to get asset path
const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL || "/hunted_house/";
  return base + path;
};

// Textures
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(getAssetPath("floor/alpha.jpg"));
const floorColorTexture = textureLoader.load(
  getAssetPath("floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"),
);
const floorARMTexture = textureLoader.load(
  getAssetPath("floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"),
);
const floorNormalTexture = textureLoader.load(
  getAssetPath(
    "floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg",
  ),
);
const floorDisTexture = textureLoader.load(
  getAssetPath("floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"),
);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.repeat.set(4, 4);

floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.repeat.set(4, 4);

floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.repeat.set(4, 4);

floorDisTexture.wrapS = THREE.RepeatWrapping;
floorDisTexture.wrapT = THREE.RepeatWrapping;
floorDisTexture.repeat.set(4, 4);
/**
 * House
 */

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#0e1a22ff", 1.25);
gui.addColor(directionalLight, "color").name("directionalLightColor");
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

//door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.5, 2.7);
scene.add(doorLight);

//ghost lights
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

[ghost1, ghost2, ghost3].forEach((ghost) => {
  ghost.castShadow = true;
  ghost.shadow.mapSize.width = 256;
  ghost.shadow.mapSize.height = 256;
  ghost.shadow.camera.far = 7;
  scene.add(ghost);
});
/**
 * floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisTexture,
    displacementScale: 0.3,
    displacementBias: -0.15,
  }),
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("displacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("displacementBias");

/**
 * House components
 */
const house = new THREE.Group();
scene.add(house);

const wallColorTexture = textureLoader.load(
  getAssetPath("wall/old_stone_wall_1k/old_stone_wall_diff_1k.jpg"),
);
const wallARMTexture = textureLoader.load(
  getAssetPath("wall/old_stone_wall_1k/old_stone_wall_arm_1k.jpg"),
);
const wallNormalTexture = textureLoader.load(
  getAssetPath("wall/old_stone_wall_1k/old_stone_wall_nor_gl_1k.jpg"),
);
const wallDisTexture = textureLoader.load(
  getAssetPath("wall/old_stone_wall_1k/old_stone_wall_disp_1k.jpg"),
);

wallColorTexture.wrapS = THREE.RepeatWrapping;
wallColorTexture.wrapT = THREE.RepeatWrapping;
wallColorTexture.repeat.set(1, 1);

wallARMTexture.wrapS = THREE.RepeatWrapping;
wallARMTexture.wrapT = THREE.RepeatWrapping;
wallARMTexture.repeat.set(1, 1);

wallNormalTexture.wrapS = THREE.RepeatWrapping;
wallNormalTexture.wrapT = THREE.RepeatWrapping;
wallNormalTexture.repeat.set(1, 1);

wallDisTexture.wrapS = THREE.RepeatWrapping;
wallDisTexture.wrapT = THREE.RepeatWrapping;
wallDisTexture.repeat.set(1, 1);
// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
    displacementMap: wallDisTexture,
    displacementScale: 0.07,
    displacementBias: -0.05,
  }),
);
gui
  .add(walls.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("wallDisplacementScale");
gui
  .add(walls.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("wallDisplacementBias");
walls.position.y = 1.25;
house.add(walls);
// Roof Textures
const roofColorTexture = textureLoader.load(
  getAssetPath("roof/roof_09_1k/roof_09_diff_1k.jpg"),
);
const roofARMTexture = textureLoader.load(
  getAssetPath("roof/roof_09_1k/roof_09_arm_1k.jpg"),
);
const roofNormalTexture = textureLoader.load(
  getAssetPath("roof/roof_09_1k/roof_09_nor_gl_1k.jpg"),
);
const roofDisTexture = textureLoader.load(
  getAssetPath("roof/roof_09_1k/roof_09_disp_1k.jpg"),
);

roofColorTexture.wrapS = THREE.RepeatWrapping;
// roofColorTexture.wrapT = THREE.RepeatWrapping;
roofColorTexture.repeat.set(8, 1);

roofARMTexture.wrapS = THREE.RepeatWrapping;
// roofARMTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.repeat.set(8, 1);

roofNormalTexture.wrapS = THREE.RepeatWrapping;
// roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.repeat.set(8, 1);

roofDisTexture.wrapS = THREE.RepeatWrapping;
// roofDisTexture.wrapT = THREE.RepeatWrapping;
roofDisTexture.repeat.set(8, 1);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
    displacementMap: roofDisTexture,
    displacementScale: 0.1,
    displacementBias: -0.05,
  }),
);
gui
  .add(roof.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("roofDisplacementScale");
gui
  .add(roof.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("roofDisplacementBias");
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);
// Door Textures
const doorColorTexture = textureLoader.load(getAssetPath("door/color.jpg"));
const doorAlphaTexture = textureLoader.load(getAssetPath("door/alpha.jpg"));
const doorAmbientOcclusionTexture = textureLoader.load(
  getAssetPath("door/ambientOcclusion.jpg"),
);
const doorHeightTexture = textureLoader.load(getAssetPath("door/height.jpg"));
const doorNormalTexture = textureLoader.load(getAssetPath("door/normal.jpg"));
const doorMetalnessTexture = textureLoader.load(
  getAssetPath("door/metalness.jpg"),
);
const doorRoughnessTexture = textureLoader.load(
  getAssetPath("door/roughness.jpg"),
);

//door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  }),
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushColorTexture = textureLoader.load(
  getAssetPath("leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg"),
);
const bushARMTexture = textureLoader.load(
  getAssetPath("leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg"),
);
const bushNormalTexture = textureLoader.load(
  getAssetPath("leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg"),
);
const bushDisTexture = textureLoader.load(
  getAssetPath("leaves_forest_ground_1k/leaves_forest_ground_disp_1k.jpg"),
);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushColorTexture.wrapT = THREE.RepeatWrapping;
bushColorTexture.repeat.set(1, 1);

bushARMTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapT = THREE.RepeatWrapping;
bushARMTexture.repeat.set(1, 1);

bushNormalTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapT = THREE.RepeatWrapping;
bushNormalTexture.repeat.set(1, 1);

bushDisTexture.wrapS = THREE.RepeatWrapping;
bushDisTexture.wrapT = THREE.RepeatWrapping;
bushDisTexture.repeat.set(1, 1);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
  displacementMap: bushDisTexture,
  displacementScale: 0.1,
  displacementBias: -0.05,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
[bush1, bush2, bush3, bush4].forEach((bush) => {
  bush.rotation.x = -0.75;
  house.add(bush);
});

const graveColorTexture = textureLoader.load(
  getAssetPath("plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg"),
);
const graveARMTexture = textureLoader.load(
  getAssetPath("plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg"),
);
const graveNormalTexture = textureLoader.load(
  getAssetPath("plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg"),
);
const graveDisTexture = textureLoader.load(
  getAssetPath("plastered_stone_wall_1k/plastered_stone_wall_disp_1k.jpg"),
);
// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
  displacementMap: graveDisTexture,
  displacementScale: 0,
  displacementBias: 0,
});

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.4, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
doorLight.castShadow = true;

floor.receiveShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

graves.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
// sky
const sky = new Sky();
scene.add(sky);

sky.scale.setScalar(100);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
const fog = new THREE.Fog("#02343f", 1, 15);
scene.fog = fog;

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update ghost positions
  ghost1.position.x = Math.cos(elapsedTime * 0.5) * 4;
  ghost1.position.z = Math.sin(elapsedTime * 0.5) * 4;

  ghost2.position.x = Math.cos(-elapsedTime * 0.32) * 6;
  ghost2.position.z = Math.sin(-elapsedTime * 0.32) * 6;

  ghost3.position.x =
    Math.cos(-elapsedTime * 0.18) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z =
    Math.sin(-elapsedTime * 0.18) * (7 + Math.sin(elapsedTime * 0.5));

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
