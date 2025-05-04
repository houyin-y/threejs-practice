import * as THREE from 'three'


// === Globals ===
let scene, camera, renderer;

// === Initialization ===
function initScene() {
    // first you need a scene
    scene = new THREE.Scene();
    
    // then a camera
    camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
    camera.position.z = 10;
    
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

// === Animation Loop ===
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

function main() {
    initScene();
    animate();
}
main()