import * as THREE from 'three';
import * as CANNON from 'cannon';
import { having } from 'utilities/misc';

export type Collider = {
    shapes: Array<CANNON.Shape>,
    shapeOffsets: Array<THREE.Vector3>,
    wireframe: THREE.Object3D,
}

export const boxCollider
    : (width: number, height: number, depth: number) => Collider
    = (width, height, depth) =>
        ({
            shapes: [ 
                new CANNON.Box(new CANNON.Vec3(
                    width,
                    height,
                    depth
                ))
            ],
            shapeOffsets: [
                new THREE.Vector3()
            ],
            wireframe: new THREE.Mesh(new THREE.BoxGeometry(
                width,
                height,
                depth
            ), wireframeMaterial())
        })

export const capsuleCollider
    : (radius: number, height: number, segments: number) => Collider
    = (radius, height, segments = 16) =>
        ({
            shapes: [
                new CANNON.Cylinder(radius, radius, height, segments),
                new CANNON.Sphere(radius),
                new CANNON.Sphere(radius)
            ],
            shapeOffsets: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, height / 2, 0),
                new THREE.Vector3(0, -1 * height / 2, 0)
            ],
            wireframe: having(new THREE.Group(), group => {
                group.add(new THREE.Mesh(
                    new THREE.SphereGeometry(radius, segments, segments),
                    wireframeMaterial()
                ))
                group.add(new THREE.Mesh(
                    new THREE.SphereGeometry(radius, segments, segments),
                    wireframeMaterial()
                ))
                group.add(new THREE.Mesh(
                    new THREE.CylinderGeometry(radius, radius, height, segments, segments),
                    wireframeMaterial()
                ))
                return group;
            })
        })

export const wireframeMaterial
    : () => THREE.Material
    = () =>
        new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
