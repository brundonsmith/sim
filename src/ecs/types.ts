import * as THREE from 'three';
import * as OIMO from 'oimo';

export type Entity = {
    tags: Array<string>,
    threeObject: THREE.Object3D,
}

export type System = {
    filter: (entity: Entity) => boolean,
    update: (entity: Entity, delta: number) => void,
}

export type WithOimoBody = { oimoBody: OIMO.RigidBody }

export type WithThreeCamera = { threeObject: THREE.Camera }

export type WithThreeLight = { threeObject: THREE.Light }
