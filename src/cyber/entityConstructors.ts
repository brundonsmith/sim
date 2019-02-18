import * as THREE from 'three';
import * as OIMO from 'oimo';
import { Entity, WithThreeCamera, WithThreeObject, WithOimoBody, WithThreeLight, WithScoutProperties } from './types';
import { initRigidbody, initMassData, initShape, initShapeConfig, initRigidbodyConfig } from './utils/oimo';
import { fallback } from './utils/misc';

type BasicProps = {
    position?: OIMO.Vec3,
    orientation?: OIMO.Quat,
}

let foo: BasicPhysicsProps = {
    bodyType: 0
}

type BasicPhysicsProps = {
    bodyType?: number,
    mass?: number,
    friction?: number,
    shape?: OIMO.Geometry,
}

type BasicRenderingProps = {
    castShadow?: boolean,
    receiveShadow?: boolean,
}

export const createCamera
    : () => Entity & WithThreeCamera
    = () => ({
        tags: [ 'camera' ],
        threeObject: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    })

export const createBuilding
    : (props: { x: number, z: number, width: number, depth: number, height: number }) => Entity & WithThreeObject & WithOimoBody
    = ({ x, z, width, depth, height }) => {
        let oimoBody = initRigidbody({
            config: initRigidbodyConfig({
                type: OIMO.RigidBodyType.STATIC
            }),
            shapes: [
                initShape({
                    config: initShapeConfig({
                        friction: 1,
                        geometry: new OIMO.BoxGeometry(new OIMO.Vec3(width/2, height/2, depth/2)),
                        position: new OIMO.Vec3(width/2, height/2, depth/2)
                    })
                })
            ]
        })

        oimoBody.setPosition(new OIMO.Vec3(x, 0, z));

        let threeObject = Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true })

        threeObject.geometry.translate(width/2, height/2, depth/2)

        return {
            tags: [ 'building' ],
            threeObject,
            oimoBody
        };
    }


export const createBox
    : (props: BasicProps & BasicPhysicsProps & BasicRenderingProps & { width: number, height: number, depth: number }) => Entity & WithThreeObject & WithOimoBody
    = ({ bodyType, mass, friction, position, orientation, castShadow, receiveShadow, width, height, depth }) => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: fallback(castShadow, true), receiveShadow: fallback(receiveShadow, true) }),
        oimoBody: createSimpleOimoBody({
            bodyType, mass, friction, position, orientation,
            shape: new OIMO.BoxGeometry(new OIMO.Vec3(width / 2, height / 2, depth / 2))
        })
    })

export const createFloor
    : (props: BasicProps & BasicPhysicsProps & BasicRenderingProps & { width: number, depth: number }) => Entity & WithThreeObject & WithOimoBody
    = ({ bodyType, mass, friction, position, orientation, castShadow, receiveShadow, width, depth }) => {
        let height = 1;
        let entity = {
            tags: [],
            threeObject: Object.assign(new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial()
            ), { castShadow: fallback(castShadow, false), receiveShadow: fallback(receiveShadow, true) }),
            oimoBody: createSimpleOimoBody({
                mass, friction, orientation,
                position: new OIMO.Vec3(0, -1 * height/2, 0),
                bodyType: OIMO.RigidBodyType.STATIC,
                shape: new OIMO.BoxGeometry(new OIMO.Vec3(width/2, height/2, depth/2))
            })
        }

        return entity;
    }

export const createAmbientLight
    : (color: number, intensity: number) => Entity & WithThreeLight
    = (color, intensity) => ({
        tags: [ 'light' ],
        threeObject: new THREE.AmbientLight(color, intensity)
    })

export const createDirectionalLight
    : (color: number, intensity: number, shadows?: boolean) => Entity & WithThreeLight
    = (color, intensity, shadows = true) => {
        let light = Object.assign(new THREE.DirectionalLight(color, intensity), { 
            castShadow: shadows 
        })
        
        light.add(light.target);
        light.target.position.set(1, -1, 1);

        if(shadows) {
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 10000;
            
            light.shadow.camera.left = -50;
            light.shadow.camera.right = 50;
            light.shadow.camera.top = 50;
            light.shadow.camera.bottom = -50;
        }

        return {
            tags: [ 'light' ],
            threeObject: light
        };
    }

export const createPlayer
    : (props: BasicProps) => Entity & WithThreeObject & WithOimoBody
    = ({ position, orientation }) => {
        let cam = createCamera();
        let player = { 
            tags: [ 'player' ],
            threeObject: new THREE.Group(),
            oimoBody: createSimpleOimoBody({ 
                position,
                orientation,
                //bodyType: OIMO.RigidBodyType.KINEMATIC, 
                friction: 0,
                shape: new OIMO.CapsuleGeometry(1, 1)
            })
        };

        player.oimoBody.setRotationFactor(ZERO);

        // HACK
        player.threeObject.add(cam.threeObject);

        return player;
    }

export const createScout
    : (props: BasicProps) => Entity & WithThreeObject & WithOimoBody & WithScoutProperties
    = ({ position, orientation }) => ({
        tags: [ 'scout' ],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        oimoBody: createSimpleOimoBody({ 
            position, orientation,
            shape: new OIMO.BoxGeometry(new OIMO.Vec3(1/2, 1/2, 1/2)) 
        }),
        scoutProperties: {
            destination: null,
            speed: 1
        }
    })


const createSimpleOimoBody
    : (props: BasicProps & BasicPhysicsProps) => OIMO.RigidBody
    = ({ bodyType, mass, friction, shape, position, orientation }) => {
        let body = initRigidbody({
            config: initRigidbodyConfig({
                type: fallback(bodyType, OIMO.RigidBodyType.DYNAMIC)
            }),
            shapes: [
                initShape({
                    config: initShapeConfig({
                        friction: fallback(friction, 1),
                        geometry: shape
                    })
                })
            ],
            massData: initMassData({
                mass: fallback(mass, 1)
            })
        })

        if(position) {
            body.setPosition(position);
        }
        if(orientation) {
            body.setOrientation(orientation);
        }

        return body;
    }
