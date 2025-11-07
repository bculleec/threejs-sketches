import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

const viewCanvas = document.getElementById('my-view-canvas');
const mapLoaderCanvas = document.querySelector('.map-loader');

// set up controls
const controls = new OrbitControls(camera, viewCanvas);
controls.maxDistance = 100;
controls.minDistance = 15.1;
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


const texture = new THREE.CanvasTexture(mapLoaderCanvas);
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

let radOffset = 0;
let lines = [];
for (let i = 0; i < 8; i++){ // for 8 segments
  const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  const points = [];
  points.push( new THREE.Vector3( 0, 0, 0 ) );
  points.push( new THREE.Vector3( 25, 0, 0 ) );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
  const line = new THREE.Line( lineGeometry, lineMaterial );
  line.rotation.y = radOffset;
  scene.add( line );
  lines.push(line);

  // find the next deg
  radOffset += Math.PI / 4;
}

camera.position.z = 35;
controls.target.set(0, 0, 0);
controls.update()

let cameraDir = new THREE.Vector3();
let zoomLevel = 0;

// load onto map
const fullImage = new Image;
fullImage.crossOrigin = 'anonymous';
fullImage.src = 'https://tile.openstreetmap.org/0/0/0.png';

fullImage.onload = function() {
  mapLoaderCanvas.getContext('2d').drawImage(fullImage, 0, 0, 1920, 1920);
  texture.needsUpdate = true;
}

window.addEventListener("keypress", async (e) => {
  if (e.key === 'e') {
    mapLoaderCanvas.getContext('2d').clearRect(0, 0, 1920, 1920);
    texture.needsUpdate = true;
  } else {
    await loadImageLevels(parseInt(e.key), mapLoaderCanvas);
    texture.needsUpdate = true;
  }
})

async function loadImageLevels(level) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 256 * (2 ** level);
  tempCanvas.height = 256 * (2 ** level);

  for (let i = 0; i < 2 ** level; i++) {
    for (let j = 0; j < 2 ** level; j++) {
      const tempImage = new Image;
      tempImage.crossOrigin = 'anonymous';
      tempImage.src = `https://tile.openstreetmap.org/${level}/${i}/${j}.png`;
      await tempImage.decode();
      tempCanvas.getContext('2d').drawImage(tempImage, i * 256, j * 256);
      
      showWaiting(`${(i * (2 ** level)) + j + 1}/${(2 ** level) ** 2}`)
      
    }
  }

  // document.body.appendChild(tempCanvas);
  // draw the temp canvas on the main canvas

  mapLoaderCanvas.getContext('2d').drawImage(tempCanvas, 0, 0, 1920, 1920);
  hideWaiting();
}

function showWaiting(message) {
  console.log(message);
}

function hideWaiting() {

}

let prevZoomLevel = -1;
let isLoading = false;

async function checkZoomLevelChange(level) {
  if (isLoading || prevZoomLevel === level) return;
  isLoading = true;
  prevZoomLevel = level;
  await loadImageLevels(level);
  texture.needsUpdate = true;
  isLoading = false;
}

function animate() {

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  camera.getWorldDirection(cameraDir);
  // console.log(cameraDir);

  lines.forEach(line => {
    let lineDir = line.localToWorld(new THREE.Vector3(25, 0, 0));
    const facing = cameraDir.dot(lineDir);
    
    if (facing > 0) { line.material.color.set('#ff0000') }
    else { line.material.color.set('#0000ff') }
  })

  const camDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
  if ( camDistance > 25) {
    zoomLevel = 0;
  } else if (camDistance > 20) {
    zoomLevel = 1;
  } else if (camDistance > 17) {
    zoomLevel = 2 ;
  } else if (camDistance > 15) {
    zoomLevel = 3 ;
  }

  
  controls.rotateSpeed = 1 / (10 * (zoomLevel || 1) ** 2);

  checkZoomLevelChange(zoomLevel);
  console.log(zoomLevel);

  renderer.render( scene, camera );

}
