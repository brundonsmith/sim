import * as THREE from 'three';
import OIMO from 'oimo';

import { createBox, createPlane, createDirectionalLight, createPlayer, createAmbientLight, createScout } from './entityConstructors';
import Input from './Input';
import { Entity } from './types';

// ECS
var entities: Array<Entity> = [];
import systems from './systems';
import { FRAME_LENGTH, GRAVITY } from './constants';


// populate scene
/*
let cam = createCamera();
cam.threeObject.position.set(0, 3, 10)
entities.push(cam);
*/

let player = createPlayer();
player.oimoBody.setPosition(new OIMO.Vec3(0, 4, 10));
entities.push(player);

let box = createBox(1, 1, 1);
box.oimoBody.setPosition(new OIMO.Vec3(0, 3, 0));
box.oimoBody.setOrientation(new OIMO.Quat(1, 1, 1, 1));
entities.push(box);

let plane = createPlane();
entities.push(plane);

let light = createAmbientLight(0xFFFFFF, 0.2);
entities.push(light);

let light2 = createDirectionalLight(0x00AAAA, 0.5);
light2.threeObject.rotation.set(-1 * Math.PI / 4, -1 * Math.PI / 4, 0);
entities.push(light2);

let scout = createScout();
scout.oimoBody.setPosition(new OIMO.Vec3(1, 4, 1));
entities.push(scout);


// initialize containers
var threeScene: THREE.Scene;
var oimoWorld: OIMO.World;
var renderer: THREE.WebGLRenderer;
{
    threeScene = new THREE.Scene();
    threeScene.add(new THREE.AmbientLight(0x404040));
    threeScene.add(new THREE.AxesHelper(1));

    oimoWorld = new OIMO.World(OIMO.BroadPhaseType.BVH, new OIMO.Vec3(0, GRAVITY, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    console.log({ threeScene, oimoWorld })
}


// register entities
entities.forEach(entity => {
    if(entity.threeObject) {
        threeScene.add(entity.threeObject);
    }
    if(entity.oimoBody) {
        oimoWorld.addRigidBody(entity.oimoBody);
    }
})


// begin and loop
var previousTick: number|null = null;
var exit = false;
const tick = () => {
    let delta = previousTick ? Date.now() / 1000 - previousTick : 0;
    previousTick = Date.now() / 1000;

    // update physics
    oimoWorld.step(delta);

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
renderer.domElement.addEventListener('click', e => 
    //@ts-ignore
    (<HTMLElement>e.target).requestPointerLock()
)
window.addEventListener('keydown', e => {
    if(e.code === 'KeyQ') {
        exit = true;
    }
})
tick();