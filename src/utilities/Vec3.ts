import * as OIMO from 'oimo';
import { almostEqual } from 'utilities/math';

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

export const almostEqualVec 
    : (vec1: OIMO.Vec3, vec2: OIMO.Vec3, threshold?: number) => boolean
    = (vec1, vec2, threshold = 0.1) => 
        almostEqual(vec1.x, vec2.x, threshold) &&
        almostEqual(vec1.y, vec2.y, threshold) &&
        almostEqual(vec1.z, vec2.z, threshold)
