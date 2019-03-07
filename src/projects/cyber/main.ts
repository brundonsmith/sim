import * as THREE from 'three';
import Sky from 'lib/three-plugins/Sky';
import OIMO from 'oimo';

import { Entity } from 'ecs/types';
import { hasOimoBody } from 'ecs/utils';
import { constructEntity } from 'init/general';
import { createOimoBody } from 'init/oimo-objects';
import { createHeightmapGeometry, createOimoGeometry } from 'subsystems/terrain/utils';
import { generateTerrain } from 'subsystems/terrain/diamond-square';
import Input from 'utilities/Input';
import { findInChildren, alreadyAdded } from 'utilities/three';

import systems from './systems';
import { FRAME_LENGTH, GRAVITY } from './constants';

// ECS
var entities: Array<Entity> = [];

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

// JSON
scene.forEach(entity => 
    // @ts-ignore
    entities.push(constructEntity(entity)))




let heightmap: Array<Array<number>> = generateTerrain(129, 129);
let geom = createHeightmapGeometry(heightmap, 1, 5);

let terrain = {
    tags: [ 'terrain' ],
    threeObject: new THREE.Mesh(geom, new THREE.MeshStandardMaterial({
        color: 0x3f704d,
        roughness: 1,
        metalness: 0.75
    })),
    oimoBody: createOimoBody({
        bodyType: 'STATIC',
        mass: 0
    })
}

createOimoGeometry(geom, 10, 1, 10).forEach(hull => 
    terrain.oimoBody.addShape(new OIMO.Shape(Object.assign(new OIMO.ShapeConfig(), { geometry: hull }))))

entities.push(terrain)





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


{
    // Add Sky
    // @ts-ignore
    let sky = new Sky();
    sky.scale.setScalar( 450000 );
    threeScene.add( sky );
    // Add Sun Helper
    let sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    threeScene.add( sunSphere );

    const distance = 400000;

    sky.material.uniforms.turbidity.value = 10; // 1.0 - 20.0
    sky.material.uniforms.rayleigh.value = 2; // 0.0 - 4.0
    sky.material.uniforms.mieCoefficient.value = 0.005; // 0.0 - 0.1
    sky.material.uniforms.mieDirectionalG.value = 0.8; // 0.0 - 1.0
    sky.material.uniforms.luminance.value = 1; // 0.0 - 2.0

    const inclination = 0.49; // 0 - 1
    const azimuth = 0.25; // 0 - 1
    const theta = Math.PI * ( inclination - 0.5 );
    const phi = 2 * Math.PI * ( azimuth - 0.5 );
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    sunSphere.visible = true;
    sky.material.uniforms.sunPosition.value.copy( sunSphere.position );
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