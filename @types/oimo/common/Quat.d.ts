declare module OIMO {
    export class Quat {
        constructor(x?: number, y?: number, z?: number, w?: number);
        w: number;
        x: number;
        y: number;
        z: number;
        add(q: Quat): Quat;
        addEq(q: Quat): Quat;
        clone(): Quat;
        copyFrom(q: Quat): Quat;
        dot(q: Quat): number;
        fromMat3(m: Mat3): Quat;
        identity(): Quat;
        init(x: number, y: number, z: number, w: number): Quat;
        length(): number;
        lengthSq(): number;
        normalize(): Quat;
        normalized(): Quat;
        scale(s: number): Quat;
        scaleEq(s: number): Quat;
        setArc(v1: Vec3, v2: Vec3): Quat;
        slerp(q: Quat, t: number): Quat;
        sub(q: Quat): Quat;
        subEq(q: Quat): Quat;
        toMat3(): Mat3;
        toString(): string;
        static numCreations: number;
    }
}