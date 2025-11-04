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

const wireframe = new THREE.WireframeGeometry( sphereGeo );
const sphereLine = new THREE.LineSegments( wireframe );
sphereLine.material.depthWrite = false;
sphereLine.material.opacity = 0.25;
sphereLine.material.transparent = true;
scene.add( sphereLine );

// scene.add(mesh);

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

  renderer.render( scene, camera );

}
