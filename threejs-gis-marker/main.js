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


const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/planet.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = 1;
texture.repeat.set(repeats, repeats);

// create a cylinder geometries
const mesh = new THREE.Mesh(
  new THREE.CylinderGeometry(2, 2, 1.5, 24),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const mesh2 = new THREE.Mesh(
  new THREE.CylinderGeometry(3, 3, 1, 24),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);

mesh.position.set(0, 0, 0);
scene.add(mesh);
mesh2.position.set(0, 0, 0);
scene.add(mesh2);

camera.position.z = 10;

function animate() {

  mesh.rotation.x += 0.001;
  mesh2.rotation.x = mesh.rotation.x;
  mesh.rotation.y += 0.001;
  mesh2.rotation.y = mesh.rotation.y;

  renderer.render( scene, camera );

}
