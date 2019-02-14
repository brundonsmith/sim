import * as THREE from 'three';
import * as OIMO from 'oimo';
import { EULER_ORDER } from './constants';
import { Entity, WithThreeCamera, WithThreeObject, WithOimoBody, WithThreeLight, WithScoutProperties } from './types';
import { initRigidbody, initMassData, initShape, initShapeConfig, initRigidbodyConfig } from './utils/oimo';

export const createCamera
    : () => Entity & WithThreeCamera
    = () => ({
        tags: [ 'camera' ],
        threeObject: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    })

export const createBox
    : (width: number, height: number, depth: number) => Entity & WithThreeObject & WithOimoBody
    = (width, height, depth) => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        oimoBody: initRigidbody({
            shapes: [
                initShape({
                    config: initShapeConfig({
                        friction: 0.3,
                        geometry: new OIMO.BoxGeometry(new OIMO.Vec3(width / 2, height / 2, depth / 2))
                    })
                })
            ],
            massData: initMassData({
                mass: 1
            })
        })
    })

export const createFloor
    : () => Entity & WithThreeObject & WithOimoBody
    = () => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(100, 0.1, 100),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        oimoBody: initRigidbody({
            config: initRigidbodyConfig({
                type: OIMO.RigidBodyType.STATIC,
            }),
            shapes: [
                initShape({
                    config: initShapeConfig({
                        friction: 1,
                        geometry: new OIMO.BoxGeometry(new OIMO.Vec3(100, 0.1, 100))
                    })
                })
            ]
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
            oimoBody: initRigidbody({
                config: initRigidbodyConfig({
                }),
                shapes: [
                    initShape({
                        config: initShapeConfig({
                            friction: 0,
                            geometry: new OIMO.CapsuleGeometry(1, 1)
                        })
                    })
                ],
                massData: initMassData({
                    mass: 1
                })
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
        oimoBody: initRigidbody({
            shapes: [
                initShape({
                    config: initShapeConfig({
                        friction: 0.3,
                        geometry: new OIMO.BoxGeometry(new OIMO.Vec3(1/2, 1/2, 1/2))
                    })
                })
            ],
            massData: initMassData({
                mass: 1
            })
        }),
        scoutProperties: {
            destination: null,
            speed: 1
        }
    })
