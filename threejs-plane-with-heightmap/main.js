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

// create a heightmap
const heightMap = []; // 400 values

// create a plane geometry
const gridSz = 10;
const geometry = new THREE.PlaneGeometry(gridSz, gridSz, gridSz, gridSz); // 20 x 20 with 20 width and height segments
const positions = geometry.attributes.position;

for (let i = 0; i < positions.count; i++) {
  const height = (Math.random() * 4).toFixed(2); // heightMap[i];
  positions.setZ(i, height);
  heightMap.push(height);
}

const wf = new THREE.WireframeGeometry( geometry );

const plane = new THREE.LineSegments( wf );
plane.material.depthTest = false;
plane.material.opacity = 0.4;
plane.material.transparent = true;
plane.rotation.x = Math.PI * -0.5;

scene.add(plane);

camera.position.z = gridSz + 5;
camera.position.y = 5;

// ui
const heightGridTable = document.getElementById('height-grid');
const gridW = gridSz;
const gridH = gridSz;

for (let i = 0; i < gridW; i++) {
  const tr = document.createElement('tr');
  for (let j = 0; j < gridH; j++) {
    const td = document.createElement('td');
    td.contentEditable = true;
    td.innerText = heightMap[(i*gridW) + j];
    td.style.backgroundColor = "#222";
    td.style.padding = "8px";
    td.style.borderRadius = '8px';
    td.addEventListener('input', function() {
	if (isNaN(parseFloat(this.innerText))) return;
	heightMap[(i*gridW) + j] = parseFloat(this.innerText);
	// set position of the plane:q
	positions.setZ((i*gridW+j), parseFloat(this.innerText));
	positions.needsUpdate = true;
	const newWf = new THREE.WireframeGeometry(geometry);
	plane.geometry.dispose();
	plane.geometry = newWf;

    })
    tr.appendChild(td);
  }
  heightGridTable.appendChild(tr);
}

function animate() {

  // plane.rotation.x += 0.001;
  plane.rotation.z += 0.001;
  renderer.render( scene, camera );

}
