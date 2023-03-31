import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { AmbientLight, DoubleSide, Scene } from 'three'

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

const parameters = {
	color: '#404040'
}
// controls
const controls = new OrbitControls(camera, canvas);
controls.maxPolarAngle = Math.PI
controls.update();
console.enableDamping = true;
controls.maxDistance = 500;
controls.minDistance = 160;


// axes helper
const axesHelper = new THREE.AxesHelper(500);
axesHelper.setColors('red', 'yellow', 'pink')
//scene.add(axesHelper);

console.log(window.devicePixelRatio)
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
})

// object
//const geometry = new THREE.BoxGeometry(2,2,2);

// texture loader
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const moonTexture = textureLoader.load('/textures/moon-map.jpg');
const moonDispTexture = textureLoader.load('/textures/moon-disp.jpg');
const moonAoTexture = textureLoader.load('/textures/moon-2.jpg');

const material = new THREE.MeshBasicMaterial({ });
const starMaterial = new THREE.MeshBasicMaterial({color: 'yellow'});
material.map = moonTexture


moonTexture.minFilter = THREE.NearestFilter
moonTexture.magFilter = THREE.NearestFilter
moonTexture.generateMipmaps = false


for (let i=0; i<100; i++) {
	const starGeometry = new THREE.TetrahedronGeometry(1, 0);
	const star = new THREE.Mesh(starGeometry, starMaterial);
	scene.add(star)
	star.position.x = (Math.random() - 0.5) * 500
	star.position.y = (Math.random() - 0.5) * 500
	star.position.z = (Math.random() - 0.5) * 500
}

//sphere
const sphereGeometry = new THREE.SphereGeometry(100,40,16)
const moon = new THREE.Mesh(sphereGeometry, material);
//material.wireframe = true
//scene.add(moon)

// minimoon using phong material
const miniMoonMaterial = new THREE.MeshPhongMaterial({
	map: moonTexture,
	bumpMap: moonDispTexture,
	displacementMap: moonDispTexture,
	shininess: 5,
	aoMap: moonAoTexture
})

const miniMoon = new THREE.Mesh(sphereGeometry, miniMoonMaterial);
//material.wireframe = true
scene.add(miniMoon)

// miniMoon.position.z = 200

const clock = new THREE.Clock();

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-100, 100, 900);
scene.add(light);

const ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambLight );


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
gui.add(light.position,'z')
	.min(-100)
	.max(1000)
	.step(0.001)
	.name('light-Z');
gui.add(light,'isDirectionalLight')
    .name('direction light?')

gui.addColor(parameters, 'color')
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

animate()

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// /**
//  * Textures
//  */
// const textureLoader = new THREE.TextureLoader()
// const matcapTexture = textureLoader.load('textures/matcaps/8.png')

// /**
//  * Fonts
//  */
// const fontLoader = new FontLoader()

// fontLoader.load(
//     '/fonts/helvetiker_regular.typeface.json',
//     (font) =>
//     {
//         // Material
//         const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

//         // Text
//         const textGeometry = new TextGeometry(
//             'Emma Walsh',
//             {
//                 font: font,
//                 size: 0.5,
//                 height: 0.2,
//                 curveSegments: 12,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelOffset: 0,
//                 bevelSegments: 5
//             }
//         )
//         textGeometry.center()

//         const text = new THREE.Mesh(textGeometry, material)
//         scene.add(text)

//         // Donuts
//         const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

//         for(let i = 0; i < 100; i++)
//         {
//             const donut = new THREE.Mesh(donutGeometry, material)
//             donut.position.x = (Math.random() - 0.5) * 10
//             donut.position.y = (Math.random() - 0.5) * 10
//             donut.position.z = (Math.random() - 0.5) * 10
//             donut.rotation.x = Math.random() * Math.PI
//             donut.rotation.y = Math.random() * Math.PI
//             const scale = Math.random()
//             donut.scale.set(scale, scale, scale)

//             scene.add(donut)

//         }
//     }
// )

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }



// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
// camera.position.y = 1
// camera.position.z = 2
// scene.add(camera)



// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()

//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()