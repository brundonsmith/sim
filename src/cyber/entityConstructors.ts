import * as THREE from 'three';
import * as CANNON from 'cannon';
import { EULER_ORDER } from './constants';

export const createCamera
    : () => Entity & WithThreeCamera
    = () => ({
        threeObject: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    })

export const createBox
    : (width: number, height: number, depth: number) => Entity & WithThreeObject & WithCannonBody
    = (width, height, depth) => ({
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
                width,
                height,
                depth
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
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        cannonBody: new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
        })
    })

export const createDirectionalLight
    : () => Entity & WithThreeLight
    = () => ({
        threeObject: Object.assign(new THREE.DirectionalLight(0xF6CD4B, 1), { 
            castShadow: true 
        })
    })
