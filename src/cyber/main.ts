import * as THREE from 'three';
import OIMO from 'oimo';

import Input from './Input';
import { Entity } from './types';

// ECS
var entities: Array<Entity> = [];
import systems from './systems';
import { FRAME_LENGTH, GRAVITY } from './constants';
import { findInChildren, alreadyAdded } from './utils/three';
import { hasOimoBody } from './utils/entity';

// populate scene

/*
let cam = createCamera();
cam.threeObject.position.set(0, 3, 10)
entities.push(cam);
//*/
/*
let player = createPlayer({ 
    position: new OIMO.Vec3(-5, 5, 20)
})
entities.push(player);//*/

/*
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
*/

//entities.push(createAmbientLight(0xFFFFFF, 0.2));
/*
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
*/
/*
for(let x = -500; x < 500; x += 50)
    for(let z = -500; z < 500; z += 50)
        entities.push(createBuilding({
            x,
            z,
            width: 40,
            depth: 40,
            height: 20 + Math.random() * 40
        }))
*/

import scene from './data/scene1.json';
import { constructEntity } from './init/general';

scene.forEach(entity => 
    // @ts-ignore
    entities.push(constructEntity(entity)))


// BEGIN

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
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // @ts-ignore
    window.game = { entities, threeScene, oimoWorld };
    // @ts-ignore
    console.log(window.game);
}


// register entities
entities.forEach(entity => {
    if(entity.threeObject && !alreadyAdded(threeScene, entity.threeObject)) {
        threeScene.add(entity.threeObject);
    }
    if(hasOimoBody(entity)) {
        oimoWorld.addRigidBody(entity.oimoBody);
    }
})


let mainCam = findInChildren(threeScene, obj => obj instanceof THREE.PerspectiveCamera) as THREE.PerspectiveCamera|void;

const updateAspect = () => {
    console.log('updateAspect()')
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(mainCam) {
        mainCam.aspect = window.innerWidth/window.innerHeight;
        mainCam.updateProjectionMatrix();
    }
}

updateAspect();

// HACK
let sun = findInChildren(threeScene, obj => obj instanceof THREE.DirectionalLight) as THREE.DirectionalLight|void;
if(sun) {
    sun.add(sun.target);
    sun.target.position.set(1, -1, 1);

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 10000;
    
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
}

let player = entities.find(e => e.tags.includes('player'));


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

    // HACK
    if(sun && player) {
        sun.position.set(player.threeObject.position.x - 1000, player.threeObject.position.y + 1000, player.threeObject.position.z - 1000);
    }

    if(!exit) {
        setTimeout(() => requestAnimationFrame(tick), FRAME_LENGTH - delta);
    }
}

renderer.domElement.addEventListener('click', e => 
    //@ts-ignore
    (<HTMLElement>e.target).requestPointerLock()
)
window.addEventListener('resize', updateAspect)
window.addEventListener('keydown', e => {
    if(e.code === 'KeyQ') {
        exit = true;
    }
})
tick();