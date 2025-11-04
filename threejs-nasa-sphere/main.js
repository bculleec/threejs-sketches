import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

const viewCanvas = document.getElementById('my-view-canvas');

// set up controls
const controls = new OrbitControls(camera, viewCanvas);
controls.maxDistance = 100;
controls.minDistance = 20;
controls.rotateSpeed = 0.3;


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


const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/eo_base.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = 1;
texture.repeat.set(repeats, repeats);

// create a plane geometry
const sphereRadius = 15;
const sphereWidthDivisions = 128;
const sphereHeightDivisions = 64;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
const sphereMat = new THREE.MeshBasicMaterial({
  map: texture
});
const mesh = new THREE.Mesh(sphereGeo, sphereMat);
mesh.position.set(0, 0, 0);
scene.add(mesh);


camera.position.z = 35;
controls.target.set(0, 0, 0);
controls.update()

function animate() {

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render( scene, camera );

}
