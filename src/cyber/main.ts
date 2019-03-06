import * as THREE from 'three';
import Sky from '../../lib/three-plugins/Sky';
import OIMO from 'oimo';

console.log('HELLO')
// @ts-ignore
console.log(Sky)

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
import { scale } from 'systems/geometry/Vector';
import { Face3 } from 'three';
import { createOimoBody, createOimoShape } from './init/oimo-objects';

// JSON
scene.forEach(entity => 
    // @ts-ignore
    entities.push(constructEntity(entity)))




const createHeightmapGeometry
    : (heightmap: Array<Array<number>>, scale?: number, height?: number) => THREE.Geometry
    = (heightmap, scale = 1, height = 100) => {
        let geometry = new THREE.Geometry();

        // vertices
        geometry.vertices = 
            heightmap.map((row, rowIndex) => 
                row.map((pixel, pixelIndex) => 
                    new THREE.Vector3(rowIndex * scale, pixel * height, pixelIndex * scale))
            ).flat()

        // faces
        for(let r = 0; r < heightmap.length - 1; r++) {
            let row = heightmap[r];
            let currentRowOffset = row.length * r;
            let nextRowOffset = row.length * (r + 1);
            for(let p = 0; p < row.length - 1; p++) {
                geometry.faces.push(new THREE.Face3(
                    currentRowOffset + p, 
                    currentRowOffset + p + 1, 
                    nextRowOffset + p
                ));
                geometry.faces.push(new THREE.Face3(
                    currentRowOffset + p + 1, 
                    nextRowOffset + p + 1, 
                    nextRowOffset + p
                ));
            }
        }
        
        geometry.verticesNeedUpdate = true;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        geometry.computeFaceNormals();
        return geometry;
    }

const createMeshGeometry
    : (geometry: THREE.Geometry) => Array<OIMO.ConvexHullGeometry>
    = (geometry) => 
        geometry.faces.map(face => new OIMO.ConvexHullGeometry([
            createOimoVecFromThree(geometry.vertices[face.a]),
            createOimoVecFromThree(geometry.vertices[face.b]),
            createOimoVecFromThree(geometry.vertices[face.c])
        ]))
    
const createOimoVecFromThree
    : (vec: THREE.Vector3) => OIMO.Vec3
    = (vec) =>
        new OIMO.Vec3(vec.x, vec.y, vec.z)

let heightmap: Array<Array<number>> = [];
for(let r = 0; r < 10; r++) {
    heightmap.push([]);
    let row = heightmap[r];
    for(let p = 0; p < 10; p++) {
        row.push((r + p) / 20);
    }
}
let geom = createHeightmapGeometry(heightmap, 1, 5);

let terrain = {
    tags: [ 'terrain' ],
    threeObject: new THREE.Mesh(geom, new THREE.MeshStandardMaterial()),
    oimoBody: createOimoBody({
        bodyType: 'STATIC',
        mass: 0
    })
}

createMeshGeometry(geom).forEach(hull => 
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