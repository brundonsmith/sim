import * as THREE from 'three';
import * as OIMO from 'oimo';

export type WithScoutProperties = { scoutProperties: {
    destination: OIMO.Vec3|null,
    speed: 1
} }

export type WithFollow = { 
    followTarget: THREE.Object3D|null,
    followOffset: THREE.Vector3|null
}