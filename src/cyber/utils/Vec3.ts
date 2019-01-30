import * as CANNON from 'cannon';

export const normalized
    : (vec: CANNON.Vec3) => CANNON.Vec3
    = (vec) => {
        let norm = vec.clone();
        norm.normalize();
        return norm;
    }

export const forward
    : (quat: CANNON.Quaternion) => CANNON.Vec3
    = (quat) => quat.vmult(new CANNON.Vec3(0, 0, -1))

export const backward
    : (quat: CANNON.Quaternion) => CANNON.Vec3
    = (quat) => quat.vmult(new CANNON.Vec3(0, 0, 1))

export const left
    : (quat: CANNON.Quaternion) => CANNON.Vec3
    = (quat) => quat.vmult(new CANNON.Vec3(-1, 0, 0))

export const right
    : (quat: CANNON.Quaternion) => CANNON.Vec3
    = (quat) => quat.vmult(new CANNON.Vec3(1, 0, 0))