import * as OIMO from 'oimo';

export const forward
    : (quat: OIMO.Quat) => OIMO.Vec3
    = (quat) => new OIMO.Vec3(0, 0, -1).mulMat3Eq(quat.toMat3())

export const backward
    : (quat: OIMO.Quat) => OIMO.Vec3
    = (quat) => new OIMO.Vec3(0, 0, 1).mulMat3Eq(quat.toMat3())

export const left
    : (quat: OIMO.Quat) => OIMO.Vec3
    = (quat) => new OIMO.Vec3(-1, 0, 0).mulMat3Eq(quat.toMat3())

export const right
    : (quat: OIMO.Quat) => OIMO.Vec3
    = (quat) => new OIMO.Vec3(1, 0, 0).mulMat3Eq(quat.toMat3())
