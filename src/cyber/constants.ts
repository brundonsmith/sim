import * as THREE from 'three';
import * as OIMO from 'oimo';

export const EULER_ORDER = 'YZX';

export const FRAME_LENGTH = 1 / 60 * 1000

export const TURN_SPEED = 0.05;

export const LOOK_LIMIT = Math.PI / 4;

export const GRAVITY = -9.82;

export const UPWARD = new THREE.Vector3(0, 1, 0);

export const ZERO = new OIMO.Vec3(0, 0, 0);

export const FORWARD = new OIMO.Vec3(0, 0, -1);
