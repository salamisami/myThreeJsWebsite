import './style.css'

import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {
  AmbientLight
} from 'three';
import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass';
import {
  ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass';

import {
  RGBShiftShader
} from 'three/examples/jsm/shaders/RGBShiftShader.js';
import {
  DotScreenShader
} from 'three/examples/jsm/shaders/DotScreenShader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000); //fieldOfView, AspectRatio, ViewFrustum (What objects are visible in relation to the camera?)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// postprocessing 
let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const effect1 = new ShaderPass(DotScreenShader);
effect1.uniforms['scale'].value = 4;
composer.addPass(effect1);

const effect2 = new ShaderPass(RGBShiftShader);
effect2.uniforms['amount'].value = 0.0015;
composer.addPass(effect2);

window.addEventListener('resize', onWindowResize);
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // 1. Creates the object
const material = new THREE.MeshStandardMaterial({
  color: 0xFF6347,
}); //2. Adds Material to it "wraps it"
const torus = new THREE.Mesh(geometry, material); //3.Combines geometry+material CMe

scene.add(torus)
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
//Show grid and lightsource
//const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper) //TODO why not work
//Mouse controls for camera
const controls = new OrbitControls(camera, renderer.domElement);

//Sami cube
const samiTexture = new THREE.TextureLoader().load('./Pictures/DSCF9075.jpg')

const sami = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    map: samiTexture
  })
);
scene.add(sami);
// Moon
const moonTexture = new THREE.TextureLoader().load('./Pictures/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./Pitctures/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
scene.add(moon);
moon.position.z = 20;
moon.position.setX(-10);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  // const space = new THREE.TextureLoader().load('./Pictures/space.jpg')
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff
  })


  /*const material = new THREE.MeshStandardMaterial({
    map: space,
    normalMap: normalTexture
  })*/
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)
}
Array(200).fill().forEach(addStar)
const backgroundTexture = new THREE.TextureLoader().load('./Pictures/Schalplatte.jpg');
scene.background = backgroundTexture;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // Make some objects rotate on scrolling
  moon.rotation.x += 0.005;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.005;
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.0005;
  torus.rotation.z += 0.001;
  sami.rotation.z += 0.0075;
  sami.rotation.y += 0.0075;

  camera.position.z = t * -0.01; // Camera scroll effect
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;


}
document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.001;

  sami.rotation.z += 0.001;
  sami.rotation.y += 0.005;

  controls.update;
  composer.render();
}
animate()

function init(){

}

function onWindowResize(){
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
}