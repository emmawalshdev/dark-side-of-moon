import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'
import { AmbientLight, DoubleSide, Scene } from 'three'

const clock = new THREE.Clock();

// scene
const scene = new THREE.Scene();

// objects
const sizes = {
	height: window.innerHeight,
	width: window.innerWidth
}

// camera
const camera = new THREE.PerspectiveCamera(95, sizes.width/sizes.height, 0.1, 450)
camera.position.set(200,150, 200)
//camera.up.set( 1, 0, 0 );
scene.add(camera)

// canvas
const canvas = document.querySelector('canvas.webgl');

// renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera);

// axes helper
const axesHelper = new THREE.AxesHelper(500);
axesHelper.setColors('red', 'yellow', 'pink')
//scene.add(axesHelper);

// debug
const gui = new dat.GUI();

// window resize
window.addEventListener('resize', () => {
	// update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//update camera
	camera.aspect = sizes.width/sizes.height
	camera.updateProjectionMatrix()

	//update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	
});

// texture loader
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const moonTexture = textureLoader.load('/textures/moon-map.jpg');
const moonDispTexture = textureLoader.load('/textures/moon-disp.jpg');

const material = new THREE.MeshBasicMaterial({ });
const starMaterial = new THREE.MeshBasicMaterial({color: 'yellow'});
material.map = moonTexture


moonTexture.minFilter = THREE.NearestFilter
moonTexture.magFilter = THREE.NearestFilter;
moonTexture.generateMipmaps = false;

// stars
for (let i=0; i<100; i++) {
	const starGeometry = new THREE.TetrahedronGeometry(1, 0);
	const star = new THREE.Mesh(starGeometry, starMaterial);
	scene.add(star)
	star.position.x = (Math.random() - 0.5) * 500
	star.position.y = (Math.random() - 0.5) * 500
	star.position.z = (Math.random() - 0.5) * 500
}

// moon
const sphereGeometry = new THREE.SphereGeometry(100,50,100)

//  phong material
const miniMoonMaterial = new THREE.MeshPhongMaterial({
	map: moonTexture,
	bumpMap: moonDispTexture,
	displacementMap: moonDispTexture,
	shininess: 5,
})

const miniMoon = new THREE.Mesh(sphereGeometry, miniMoonMaterial);
scene.add(miniMoon)

// light
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-100, 100, 900);
scene.add(light);

const ambLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambLight);

// parameters
const parameters = {
	color: '#404040'
}

// controls
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.maxDistance = 500;
controls.minDistance = 160;
controls.update();

// gui tool
gui
    .add(miniMoonMaterial, 'shininess')
	.min(0)
	.max(30)
	.step(0.1)
gui
    .add(miniMoonMaterial, 'wireframe')
gui
	.add(light.position,'x')
	.min(-100)
	.max(1000)
	.step(0.001)
	.name('light-X');
gui
	.add(light.position,'y')
	.min(-100)
	.max(1000).step(0.001)
	.name('light-Y');
gui
	.add(light.position,'z')
	.min(-100)
	.max(1000)
	.step(0.001)
	.name('light-Z');
gui
	.add(light,'isDirectionalLight')
    .name('direction light?')

gui
	.addColor(parameters, 'color')
    .onChange(()=> {
		ambLight.color.set(parameters.color)
	})
	.name('ambient light color')

// animate on each frame
function animate(){
	
	const elapsedTime = clock.getElapsedTime();
	miniMoon.rotation.y = -(0.1 * elapsedTime)

	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.6;
	
	controls.update();

	window.requestAnimationFrame(animate)

	renderer.render(scene, camera);
}

animate();