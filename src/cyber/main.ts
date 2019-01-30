import * as THREE from 'three';
import * as CANNON from 'cannon';
import { createBox, createQuaternion, createPlane, createDirectionalLight, createPlayer, createAmbientLight } from './entityConstructors';
import { physicsRenderSystem, movementSystem, lookingSystem } from './systems';
import Input from './Input';


// ECS
var entities: Array<Entity> = [];
var systems: Array<System> = [];

// systems
systems.push(physicsRenderSystem);
systems.push(movementSystem);
systems.push(lookingSystem);

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
/*
let cam = createCamera();
cam.threeObject.position.set(0, 3, 10)
entities.push(cam);
*/

let player = createPlayer();
player.cannonBody.position = new CANNON.Vec3(0, 4, 10);
entities.push(player);


let box = createBox(1, 1, 1);
box.cannonBody.position = new CANNON.Vec3(0, 3, 0);
box.cannonBody.quaternion = createQuaternion(1, 1, 1);
entities.push(box);

let plane = createPlane();
plane.cannonBody.quaternion.setFromEuler(-1.5708, 0, 0);
entities.push(plane);

let light = createAmbientLight(0xFFFFFF, 0.2);
entities.push(light);

let light2 = createDirectionalLight(0x00AAAA, 0.5);
light2.threeObject.rotation.set(-1 * Math.PI / 4, -1 * Math.PI / 4, 0);
entities.push(light2);


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
    renderer.render(threeScene, player.threeObject.children[0] as THREE.Camera);

    // systems
    entities.forEach(entity => 
        systems.forEach(system => 
            system.filter(entity) && system.update(entity, delta)))

    Input.update();

    if(!exit) {
        setTimeout(() => requestAnimationFrame(tick), FRAME_LENGTH - delta);
    }
}
interface HTMLElement {
    requestPointerLock: Function
} 
renderer.domElement.addEventListener('click', e => 
    //@ts-ignore
    (<HTMLElement>e.target).requestPointerLock()
)
window.addEventListener('keydown', e => {
    if(e.key === 'Q') {
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