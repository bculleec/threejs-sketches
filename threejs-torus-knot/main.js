import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

const viewCanvas = document.getElementById('my-view-canvas');

// set up controls
const controls = new OrbitControls(camera, viewCanvas);
controls.target.set(0, 0, 0);
controls.update()

const renderer = new THREE.WebGLRenderer({canvas: viewCanvas});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

// lights
const dirLight = new THREE.DirectionalLight( 0xffffff, 3.7);
dirLight.position.set(10, 10, 10).normalize();
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight( 0xcc22cc, 3.7);
dirLight2.position.set(-10, -10, -10).normalize();
scene.add(dirLight2);

// create a torus knot geometry
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(10, 3, 100, 16, 2, 3),
  new THREE.MeshBasicMaterial( { color: 0xff00ff} )
);

scene.add(torusKnot);


camera.position.z = 35;

let r = 0.3;
let g = 0;
let b = 0.6;

function animate() {
  r += 0.01;
  g += 0.01;
  b += 0.01;

  if (r > 1) r = 0;
  if (g > 1) g = 0;
  if (b > 1) b = 0;

  // console.log(r, g, b);

  torusKnot.rotation.x += 0.001;
  torusKnot.rotation.y += 0.001;
  torusKnot.material.color.setRGB(r, g, b);
  renderer.render( scene, camera );

}
