import * as THREE from 'three';
import * as OIMO from 'oimo';

export type Entity = {
    tags: Array<string>,
    [key: string]: any
}

export type System = {
    filter: (entity: Entity) => boolean,
    update: (entity: Entity, delta: number) => void,
}


export type WithOimoBody = { oimoBody: OIMO.RigidBody }

export type WithThreeObject = { threeObject: THREE.Object3D }

export type WithThreeCamera = { threeObject: THREE.Camera }

export type WithThreeLight = { threeObject: THREE.Light }

export type WithScoutProperties = { scoutProperties: {
    destination: OIMO.Vec3|null,
    speed: 1
} }