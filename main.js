import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { GUI } from 'dat.gui';

// === Constants ===
const COLORS = {
    red: 0xFF0000,
    green: 0x00FF00,
    blue: 0x0000FF,
    grey: 0x808080
};

// === Globals ===
let scene, camera, gui, renderer, controls;
let velocity, direction, moveForward, moveBackward, moveLeft, moveRight;
let prevTime = performance.now();

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
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // dat.gui for ease of access
    gui = new GUI();

    window.addEventListener('resize', onWindowResize);
}

function initMovement() {
    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();

    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
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
function createCube(x, color) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.caseShadow = true;
    scene.add(cube);

    return cube;

    /* const folder = gui.addFolder('Cube')
    folder.add(cube.rotation, 'x', 0, Math.PI, Math.PI/8);
    folder.add(cube.rotation, 'y', 0, Math.PI, Math.PI/8);
    folder.add(cube.rotation, 'z', 0, Math.PI, Math.PI/8); */
}

function createSphere() {
    const geometry = new THREE.SphereGeometry(5, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: COLORS.green });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 10;

    const folder = gui.addFolder('Sphere')
    folder.add(sphere.rotation, 'x', 0, Math.PI, Math.PI/8);
    folder.add(sphere.rotation, 'y', 0, Math.PI, Math.PI/8);
    folder.add(sphere.rotation, 'z', 0, Math.PI, Math.PI/8);
}

function createDonut() {
    const geometry = new THREE.TorusGeometry(5, 3, 16, 100);
    const material = new THREE.MeshPhongMaterial({ color: COLORS.blue });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.x = -10;
    scene.add(torus);

    const folder = gui.addFolder('Donut')
    folder.add(torus.rotation, 'x', 0, Math.PI, Math.PI/8);
    folder.add(torus.rotation, 'y', 0, Math.PI, Math.PI/8);
    folder.add(torus.rotation, 'z', 0, Math.PI, Math.PI/8);
}

function createGround() {
    const geometry = new THREE.BoxGeometry(8, 0.5, 8);
    const material = new THREE.MeshPhongMaterial({ color: COLORS.grey });
    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;
    ground.position.set(0, -2, 0);
    scene.add(ground);
}

function createObjects() {
    createCube(0, COLORS.red);
    createCube(-2, COLORS.green);
    createCube(2, COLORS.blue);
    /* createSphere();
    createDonut(); */
    createGround();
}

// === Lights ===
function setupAmbientLight() {
    const light = new THREE.AmbientLight(COLORS.white, 0.5);
    scene.add(light);

    const folder = gui.addFolder('Ambient Light');
    const settings = { color: light.color.getHex() };

    folder.add(light, 'visible');
    folder.add(light, 'intensity', 0, 1, 0.2);
    folder.addColor(settings, 'color').onChange(value => light.color.set(value));
}

function setupHemisphereLight() {
    const light = new THREE.HemisphereLight(0xEEEEFF, 0x777788, 2.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const folder = gui.addFolder('Hemisphere Light');
    const settings = { color: light.color.getHex() };

    folder.add(light, 'visible');
    folder.add(light, 'intensity', 0, 1, 0.2);
    folder.addColor(settings, 'color').onChange(value => light.color.set(value));
}

function setupDirectionalLight() {
    const light = new THREE.DirectionalLight(COLORS.red, 0.5);
    light.position.set(0, 2, 0);
    light.castShadow = true;
    scene.add(light);

    const helper = new THREE.DirectionalLightHelper(light, 3);
    scene.add(helper);

    const settings = {
        visible: true,
        color: light.color.getHex()
    };

    const folder = gui.addFolder('Directional Light');
    folder.add(settings, 'visible').onChange(value => {
        light.visible = value;
        helper.visible = value;
    });
    folder.add(light, 'intensity', 0, 1, 0.2);
    folder.add(light, 'castShadow');
    folder.addColor(settings, 'color').onChange(value => light.color.set(value));
}

function setupSpotLight() {
    const light = new THREE.SpotLight(COLORS.green, 1, 8, Math.PI / 8, 0);
    light.position.set(0, 2, 2);
    light.castShadow = true;
    scene.add(light);

    const helper = new THREE.SpotLightHelper(light);
    scene.add(helper);

    const settings = { visible: true };

    const folder = gui.addFolder('Spot Light');
    folder.add(settings, 'visible').onChange(value => {
        light.visible = value;
        helper.visible = value;
    });
    folder.add(light, 'intensity', 0, 4, 0.5);
    folder.add(light, 'angle', Math.PI / 16, Math.PI / 2, Math.PI / 16);
    folder.add(light, 'castShadow');
}

function setupPointLight() {
    const light = new THREE.PointLight(COLORS.white, 1, 0, 2);
    light.position.set(2, 2, 2);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light, 0.5);
    scene.add(helper);

    const settings = { visible: true, color: light.color.getHex() };

    const folder = gui.addFolder('Point Lights');
    folder.add(settings, 'visible').onChange(value => {
        light.visible = value;
        helper.visible = value;
    });
    folder.add(light, 'intensity', 0, 2, 0.2);
    folder.add(light.position, 'x', -2, 4, 0.5);
    folder.add(light.position, 'y', -2, 4, 0.5);
    folder.add(light.position, 'z', -2, 4, 0.5);
    folder.add(light, 'castShadow');
    folder.addColor(settings, 'color').onChange(value => light.color.set(value));
}

function setupLights() {
    setupHemisphereLight();
    /* setupAmbientLight();
    setupDirectionalLight();
    setupSpotLight();
    setupPointLight(); */
}

// === GLTF Model Loader ===
function loadModel() {
    // let loadedModel;
    const loader = new GLTFLoader();
    loader.load('/models/tiny_isometric_room/scene.gltf', (gltf) => {
        // loadedModel = gltf;

        scene.add(gltf.scene);
    }, undefined, (error) => {
        console.error(error);
    });

    /* const animate = () => {
        if (loadedModel) {
            loadedModel.scene.scale.set(10, 10, 10);
            loadedModel.scene.rotation.x += 0.01;
            loadedModel.scene.rotation.y += 0.01;
            loadedModel.scene.rotation.z += 0.01;
        }
        requestAnimationFrame(animate);
    }
    animate(); */
}

// === Pointer Lock Controls ===
function setupPointerLockCtrl() {
    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function() {
        controls.lock();
    })

    controls.addEventListener('lock', function() {
        blocker.style.display = 'none';
        instructions.style.display = 'none';
    })

    controls.addEventListener('unlock', function() {
        blocker.style.display = 'block';
        instructions.style.display = '';
    })

    scene.add(controls.object);
}

// === Keyboard Movement ===
function setupMovement() {
    const onKeyDown = function(event) {
        switch(event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    const onKeyUp = function(event) {
        switch(event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

// === Animation Loop ===
function animate() {
    renderer.setAnimationLoop(() => {
        const time = performance.now();

        if (controls.isLocked === true) {
            // amount of time (seconds) since the last frame
            // ensures movement is frame rate INDEPENDENT reagardless of fps
            const delta = (time - prevTime) / 1000;

            // opposing force such as friction/air resistance, slowing down movement over time
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();      // ensures consistent movements in all direction

            if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta;
            if ( moveLeft || moveRight ) velocity.x -= direction.x * 100.0 * delta;

            controls.moveRight( - velocity.x * delta );
            controls.moveForward( - velocity.z * delta );
        }
        prevTime = time;
        renderer.render(scene, camera);
    });
}

function main() {
    initScene();
    initMovement();
    setupMovement();

    //setupControls();
    setupPointerLockCtrl();

    createObjects();
    // loadModel();
    setupLights();

    animate();
}
main();