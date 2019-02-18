import * as THREE from 'three';
import OIMO from 'oimo';

import { createBox, createFloor, createDirectionalLight, createPlayer, createAmbientLight, createScout, createBuilding, createCamera } from './entityConstructors';
import Input from './Input';
import { Entity } from './types';

// ECS
var entities: Array<Entity> = [];
import systems from './systems';
import { FRAME_LENGTH, GRAVITY } from './constants';
import { findInChildren, alreadyAdded } from './utils/three';

// populate scene

/*
let cam = createCamera();
cam.threeObject.position.set(0, 3, 10)
entities.push(cam);
//*/

let player = createPlayer({ 
    position: new OIMO.Vec3(-5, 5, 20)
})
entities.push(player);//*/

entities.push(createBox({ 
    width: 1, 
    height: 1, 
    depth: 1,

    position: new OIMO.Vec3(45, 3, -5),
    orientation: new OIMO.Quat(1, 1, 1, 1)
}));

entities.push(createFloor({ 
    width: 1000, 
    depth: 1000 
}));

//entities.push(createAmbientLight(0xFFFFFF, 0.2));

let light = createDirectionalLight(0x00AAAA, 0.5);
entities.push(light);
light.followTarget = player.threeObject;
light.followOffset = new THREE.Vector3(-1000, 1000, -1000)

let lightSecondary = createDirectionalLight(0x00AAAA, 0.2, false);
entities.push(lightSecondary);
lightSecondary.followTarget = player.threeObject;
lightSecondary.followOffset = new THREE.Vector3(-1000, 1000, -1000)


entities.push(createScout({ 
    position: new OIMO.Vec3(35, 3, -5) 
}));


for(let x = -500; x < 500; x += 50)
    for(let z = -500; z < 500; z += 50)
        entities.push(createBuilding({
            x,
            z,
            width: 40,
            depth: 40,
            height: 20 + Math.random() * 40
        }))
//*/

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

    console.log({ entities, threeScene, oimoWorld })
}


// register entities
entities.forEach(entity => {
    if(entity.threeObject && !alreadyAdded(threeScene, entity.threeObject)) {
        threeScene.add(entity.threeObject);
    }
    if(entity.oimoBody) {
        oimoWorld.addRigidBody(entity.oimoBody);

        entity.threeObject.position.set(
            entity.oimoBody.getPosition().x, 
            entity.oimoBody.getPosition().y, 
            entity.oimoBody.getPosition().z
        )
    }
})


let mainCam = findInChildren(threeScene, obj => obj instanceof THREE.Camera) as THREE.Camera|void;


// begin and loop
var previousTick: number|null = null;
var exit = false;
const tick = () => {
    let delta = previousTick ? Date.now() / 1000 - previousTick : 0;
    previousTick = Date.now() / 1000;

    // update physics
    oimoWorld.step(delta);

    // systems
    entities.forEach(entity => 
        systems.forEach(system => 
            system.filter(entity) && system.update(entity, delta)))

    Input.update();

    // render
    if(mainCam) {
        renderer.render(threeScene, mainCam);
    } else {
        console.error(`No camera found in scene`);
    }

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