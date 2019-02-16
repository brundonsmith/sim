declare module OIMO {
    export class Pool {
        constructor();
        dispose(obj: Vec3|Mat3|Mat4|Quat): void;
        disposeMat3(m: Mat3): void;
        disposeMat4(m: Mat4): void;
        disposeQuat(q: Quat): void;
        disposeVec3(v: Vec3): void;
        mat3(): Mat3;
        mat4(): Mat4;
        quat(): Quat;
        vec3(): Vec3;
    }
}