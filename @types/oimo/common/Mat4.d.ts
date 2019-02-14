declare module OIMO {
    export class Mat4 {

        public e00: number;
        public e01: number;
        public e02: number;
        public e03: number;
        public e10: number;
        public e11: number;
        public e12: number;
        public e13: number;
        public e20: number;
        public e21: number;
        public e22: number;
        public e23: number;
        public e30: number;
        public e31: number;
        public e32: number;
        public e33: number;

        constructor(e00?: number, e01?: number, e02?: number, e03?: number, e10?: number, e11?: number, e12?: number, e13?: number, e20?: number, e21?: number, e22?: number, e23?: number, e30?: number, e31?: number, e32?: number, e33?: number);
        
        add(m: Mat4): Mat4;
        addEq(m: Mat4): Mat4;
        appendRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;
        appendRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;
        appendScale(sx: number, sy: number, sz: number): Mat4;
        appendScaleEq(sx: number, sy: number, sz: number): Mat4;
        appendTranslation(tx: number, ty: number, tz: number): Mat4;
        appendTranslationEq(tx: number, ty: number, tz: number): Mat4;
        clone(): Mat4;
        copyFrom(m: Mat4): Mat4;
        determinant(): number;
        fromMat3(m: Mat3): Mat4;
        fromTransform(transform: Transform): Mat4;
        identity(): Mat4;
        init(e00?: number, e01?: number, e02?: number, e03?: number, e10?: number, e11?: number, e12?: number, e13?: number, e20?: number, e21?: number, e22?: number, e23?: number, e30?: number, e31?: number, e32?: number, e33?: number): Mat4;
        inverse(): Mat4;
        inverseEq(): Mat4;
        lookAt(eyeX: number, eyeY: number, eyeZ: number, atX: number, atY: number, atZ: number, upX: number, upY: number, upZ: number): Mat4;
        mul(m: Mat4): Mat4;
        mulEq(m: Mat4): Mat4;
        ortho(width: number, height: number, near: number, far: number): Mat4;
        perspective(fovY: number, aspect: number, near: number, far: number): Mat4;
        prependRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;
        prependRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;
        prependScale(sx: number, sy: number, sz: number): Mat4;
        prependScaleEq(sx: number, sy: number, sz: number): Mat4;
        prependTranslation(tx: number, ty: number, tz: number): Mat4;
        prependTranslationEq(tx: number, ty: number, tz: number): Mat4;
        scale(s: number): Mat4;
        scaleEq(s: number): Mat4;
        sub(m: Mat4): Mat4;
        subEq(m: Mat4): Mat4;
        toArray(columnMajor?: boolean): Array<number>;
        toString(): string;
        trace(): number;
        transpose(): Mat4;
        transposeEq(): Mat4;

        static numCreations: number;
    }
}