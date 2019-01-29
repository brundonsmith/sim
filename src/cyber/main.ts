import * as THREE from 'three';
import * as CANNON from 'cannon';
import { createCamera, createBox, createQuaternion, createPlane, createDirectionalLight } from './entityCreators';
import { physicsRenderSystem } from './systems';


// ECS
var entities: Array<Entity> = [];
var systems: Array<System> = [];

// systems
systems.push(physicsRenderSystem);

// initialize
var threeScene: THREE.Scene;
var cannonWorld: CANNON.World;
var renderer: THREE.WebGLRenderer;
{
    threeScene = new THREE.Scene();
    threeScene.add(new THREE.AmbientLight(0x404040));
    threeScene.add(new THREE.AxesHelper(1));

    cannonWorld = new CANNON.World();
    cannonWorld.gravity.set(0, -9.82, 0);
    cannonWorld.broadphase = new CANNON.NaiveBroadphase();
    cannonWorld.solver.iterations = 15;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    console.log({ threeScene, cannonWorld })
}


// populate scene
let cam = createCamera();
cam.threeObject.position.set(0, 3, 20)
entities.push(cam);

let box = createBox(1, 1, 1);
box.cannonBody.position = new CANNON.Vec3(0, 3, 0);
box.cannonBody.quaternion = createQuaternion(1, 1, 1);
entities.push(box);

let plane = createPlane();
plane.cannonBody.quaternion.setFromEuler(-1.5708, 0, 0);
entities.push(plane);

let light = createDirectionalLight();
light.threeObject.rotation.set(-0.785, 0.2, 0);
entities.push(light);


// begin and loop
const FRAME_LENGTH = 1 / 60 * 1000
var previousTick: number|null = null;
var exit = false;
const tick = () => {
    let delta = previousTick ? Date.now() - previousTick : 0;
    previousTick = Date.now();

    // update physics
    cannonWorld.step(1 / 600, delta / 1000, 10);

    // render
    renderer.render(threeScene, cam.threeObject);

    // systems
    entities.forEach(entity => 
        systems.forEach(system => 
            system.filter(entity) && system.update(entity, delta)))

    if(!exit) {
        setTimeout(() => requestAnimationFrame(tick), FRAME_LENGTH - delta);
    }
}
window.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
        exit = true;
    }
})

entities.forEach(entity => {
    if(entity.threeObject) {
        threeScene.add(entity.threeObject);
    }
    if(entity.cannonBody) {
        cannonWorld.addBody(entity.cannonBody);
    }
})

tick();