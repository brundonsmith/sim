import * as THREE from 'three';
import * as OIMO from 'oimo';
import { Entity, WithThreeCamera, WithThreeObject, WithOimoBody, WithThreeLight, WithScoutProperties } from './types';
import { initRigidbody, initMassData, initShape, initShapeConfig, initRigidbodyConfig } from './utils/oimo';
import { fallback } from './utils/misc';

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

export const createBox
    : (props: BasicPhysicsProps & BasicRenderingProps & { width: number, height: number, depth: number }) => Entity & WithThreeObject & WithOimoBody
    = ({ bodyType, mass, friction, castShadow, receiveShadow, width, height, depth }) => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: fallback(castShadow, true), receiveShadow: fallback(receiveShadow, true) }),
        oimoBody: createOimoBody({
            bodyType, mass, friction, 
            shape: new OIMO.BoxGeometry(new OIMO.Vec3(width / 2, height / 2, depth / 2))
        })
    })

export const createFloor
    : (props: BasicPhysicsProps & BasicRenderingProps & { width: number, depth: number }) => Entity & WithThreeObject & WithOimoBody
    = ({ bodyType, mass, friction, castShadow, receiveShadow, width, depth }) => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.1, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: fallback(castShadow, true), receiveShadow: fallback(receiveShadow, true) }),
        oimoBody: createOimoBody({
            bodyType, mass, friction, 
            shape: new OIMO.BoxGeometry(new OIMO.Vec3(width / 2, 0.1, depth / 2))
        })
    })

export const createAmbientLight
    : (color: number, intensity: number) => Entity & WithThreeLight
    = (color, intensity) => ({
        tags: [ 'light' ],
        threeObject: new THREE.AmbientLight(color, intensity)
    })

export const createDirectionalLight
    : (color: number, intensity: number) => Entity & WithThreeLight
    = (color, intensity) => ({
        tags: [ 'light' ],
        threeObject: Object.assign(new THREE.DirectionalLight(color, intensity), { 
            castShadow: true 
        })
    })

export const createPlayer
    : () => Entity & WithThreeObject & WithOimoBody
    = () => {
        let cam = createCamera();
        let player = { 
            tags: [ 'player' ],
            threeObject: new THREE.Group(),
            oimoBody: createOimoBody({ 
                //bodyType: OIMO.RigidBodyType.KINEMATIC, 
                friction: 0,
                shape: new OIMO.CapsuleGeometry(1, 1)
            })
        };

        // HACK
        player.threeObject.add(cam.threeObject);

        return player;
    }

export const createScout
    : () => Entity & WithThreeObject & WithOimoBody & WithScoutProperties
    = () => ({
        tags: [ 'scout' ],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        oimoBody: createOimoBody({ shape: new OIMO.BoxGeometry(new OIMO.Vec3(1/2, 1/2, 1/2)) }),
        scoutProperties: {
            destination: null,
            speed: 1
        }
    })


const createOimoBody
    : (props: BasicPhysicsProps) => OIMO.RigidBody
    = ({ bodyType, mass, friction, shape }) =>
        initRigidbody({
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
