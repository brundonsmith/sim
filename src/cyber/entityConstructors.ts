import * as THREE from 'three';
import * as CANNON from 'cannon';
import { EULER_ORDER } from './constants';

export const createCamera
    : () => Entity & WithThreeCamera
    = () => ({
        tags: [ 'camera' ],
        threeObject: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    })

export const createBox
    : (width: number, height: number, depth: number) => Entity & WithThreeObject & WithCannonBody
    = (width, height, depth) => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        cannonBody: new CANNON.Body({
            mass: 1,
            material: new CANNON.Material({
                friction: 0.3
            }),
            shape: new CANNON.Box(new CANNON.Vec3(
                width / 2,
                height / 2,
                depth / 2
            )),
        })
    })

export const createQuaternion
    : (x: number, y: number, z: number) => CANNON.Quaternion
    = (x, y, z) => {
        let q = new CANNON.Quaternion();
        q.setFromEuler(x, y, z, EULER_ORDER)
        return q;
    }

export const createPlane
    : () => Entity & WithThreeObject & WithCannonBody
    = () => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        cannonBody: new CANNON.Body({
            mass: 0,
            material: new CANNON.Material({
                friction: 0.3
            }),
            shape: new CANNON.Plane(),
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
    : () => Entity & WithThreeObject & WithCannonBody
    = () => {
        let cam = createCamera();
        let player = { 
            tags: [ 'player' ],
            threeObject: new THREE.Group(),
            cannonBody: createCapsule(1, 2),
        };

        // HACK
        player.threeObject.add(cam.threeObject);

        return player;
    }


export const createCapsule
    : (radius: number, height: number, segments?: number) => CANNON.Body
    = (radius, height, segments = 16) => {
        let body = new CANNON.Body({
            mass: 1,
            material: new CANNON.Material({
                friction: 0
            }),
            fixedRotation: true
        })

        body.addShape(
            new CANNON.Cylinder(radius, radius, height, segments), 
            new CANNON.Vec3(0, 0, 0)
        )
        body.addShape(
            new CANNON.Sphere(radius), 
            new CANNON.Vec3(0, height / 2, 0)
        )
        body.addShape(
            new CANNON.Sphere(radius), 
            new CANNON.Vec3(0, -1 * height / 2, 0)
        )

        return body;
    }

