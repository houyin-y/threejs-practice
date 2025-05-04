import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// === Constants ===
const COLORS = {
    red: 0xFF0000,
    green: 0x00FF00,
    blue: 0x0000FF
};

// === Globals ===
let scene, camera, renderer;

// === Initialization ===
function initScene() {
    // first you need a scene
    scene = new THREE.Scene();
    
    // then a camera
    camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
    camera.position.z = 25;
    
    // and a renderer, which renders the scene
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
}

// === Controls === 
function setupControls() {
    new OrbitControls(camera, renderer.domElement);
}

// === Objects ===
function createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: COLORS.red });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

function createSphere() {
    const geometry = new THREE.SphereGeometry(5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: COLORS.green });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 10;
    scene.add(sphere)
}

function createDonut() {
    const geometry = new THREE.TorusGeometry(5, 3, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: COLORS.blue });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.x = -10;
    scene.add(torus);
}

function createObjects() {
    createCube();
    createSphere();
    createDonut();
}

// === Animation Loop ===
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

function main() {
    initScene();
    setupControls();
    createObjects();
    animate();
}
main()