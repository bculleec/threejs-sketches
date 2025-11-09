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

// create a bunch of torus knots, each with a different material
const material1 = new THREE.MeshBasicMaterial( { color: 0x4400aa} );
const material2 = new THREE.MeshPhongMaterial( { color: 0x4400aa} );
const material3 = new THREE.MeshToonMaterial( { color: 0x4400aa} );
const material4 = new THREE.MeshLambertMaterial( { color: 0x4400aa} );
const material5 = new THREE.MeshMatcapMaterial( { color: 0x4400aa} );
const material6 = new THREE.MeshNormalMaterial( { color: 0x4400aa} );
const material7 = new THREE.MeshPhysicalMaterial( { color: 0x4400aa} );
const material8 = new THREE.MeshStandardMaterial( { color: 0x4400aa} );
const material9 = new THREE.MeshLambertMaterial({ color: 0x4400aa });

const materials = [
  material1,
  material2,
  material3,
  material4,
  material5,
  material6,
  material7,
  material8,
  material9,
];

let xPosTorus = -50;
let yPosTorus = -50;
let torusKnots = [];

for (const material of materials) {
  // create a torus knot geometry
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(10, 3, 100, 16, 2, 3),
    material
  );

  torusKnot.position.x = xPosTorus;
  torusKnot.position.y = yPosTorus;
  console.log(xPosTorus, yPosTorus)


  if (xPosTorus < 50) xPosTorus += 50;
  else {
    xPosTorus = -50;
    yPosTorus += 50;
  }
  
  scene.add(torusKnot);
  torusKnots.push(torusKnot);
}


camera.position.z = 105;

function animate() {

  torusKnots.forEach(t => {
    
    t.rotation.x += 0.001;
    t.rotation.y += 0.001;
  });
  renderer.render( scene, camera );

}
