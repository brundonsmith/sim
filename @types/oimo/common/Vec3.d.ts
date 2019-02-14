declare module OIMO {

    export class Vec3 {

        public x: number;
        public y: number;
        public z: number;

        constructor(x?: number, y?: number, z?: number);

        add(v: Vec3): Vec3;
        addEq(v: Vec3): Vec3;
        addScaled(v: Vec3, s: number): Vec3;
        addScaledEq(v: Vec3, s: number): Vec3;
        clone(): Vec3;
        copyFrom(v: Vec3): Vec3;
        cross(v: Vec3): Vec3;
        crossEq(v: Vec3): Vec3;
        dot(v: Vec3): number;
        init(x: number, y: number, z: number): Vec3;
        length(): number;
        lengthSq(): number;
        mulMat3(m: Mat3): Vec3;
        mulMat3Eq(m: Mat3): Vec3;
        mulMat4(m: Mat4): Vec3;
        mulMat4Eq(m: Mat4): Vec3;
        mulTransform(m: Transform): Vec3;
        mulTransformEq(m: Transform): Vec3;
        negate(): Vec3;
        negateEq(): Vec3;
        normalize(): Vec3;
        normalized(): Vec3;
        scale(s: number): Vec3;
        scale3(sx: number, sy: number, sz: number): Vec3;
        scale3Eq(sx: number, sy: number, sz: number): Vec3;
        scaleEq(s: number): Vec3;
        sub(v: Vec3): Vec3;
        subEq(v: Vec3): Vec3;
        toString(): string;
        zero(): Vec3;
    }

}