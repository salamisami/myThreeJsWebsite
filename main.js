import './style.css'

import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import { AmbientLight } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //fieldOfView, AspectRatio, ViewFrustum (What objects are visible in relation to the camera?)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

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
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper) //TODO why not work
//Mouse controls for camera
const controls = new OrbitControls(camera, renderer.domElement);

//Sami cube
const samiTexture = new THREE.TextureLoader().load('./Pictures/DSCF9075.jpg')

const sami = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: samiTexture})
);
scene.add(sami);
// Moon
const moonTexture = new THREE.TextureLoader().load('./Pictures/moon.jpg');
//const normalTexture = new THREE.TextureLoader().load('./Pitctures/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map:moonTexture
    //normalMap: normalTexture
  })
);
scene.add(moon);
 
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material= new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);
  const [x,y,z]=Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}
Array(200).fill().forEach(addStar)
const backgroundTexture = new THREE.TextureLoader().load('./Pictures/pexels-juan-agustin-2340254.jpg');
scene.background=backgroundTexture;
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update;
  renderer.render(scene, camera);
}
animate()