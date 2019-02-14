declare module OIMO {
    export class Mat3 {

        public e00: number;
        public e01: number;
        public e02: number;
        public e10: number;
        public e11: number;
        public e12: number;
        public e20: number;
        public e21: number;
        public e22: number;

        constructor(e00?: number, e01?: number, e02?: number, e10?: number, e11?: number, e12?: number, e20?: number, e21?: number, e22?: number);
        
        add(m: Mat3): Mat3;
        addEq(m: Mat3): Mat3;
        appendRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;
        appendRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;
        appendScale(sx: number, sy: number, sz: number): Mat3;
        appendScaleEq(sx: number, sy: number, sz: number): Mat3;
        clone(): Mat3;
        copyFrom(m: Mat3): Mat3;
        determinant(): number;
        fromCols(col0: Vec3, col1: Vec3, col2: Vec3): Mat3;
        fromEulerXyz(eulerAngles: Vec3): Mat3;
        fromQuat(q: Quat): Mat3;
        fromRows(row0:Vec3, row1:Vec3, row2:Vec3): Mat3;
        getCol(index: number): Vec3;
        getColTo(index: number, dst: Vec3): void;
        getRow(index: number): Vec3;
        getRowTo(index: number, dst: Vec3): void;
        identity(): Mat3;
        init(e00?: number, e01?: number, e02?: number, e10?: number, e11?: number, e12?: number, e20?: number, e21?: number, e22?: number): Mat3;
        inverse(): Mat3;
        inverseEq(): Mat3;
        mul(m: Mat3): Mat3;
        mulEq(m: Mat3): Mat3;
        prependRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;
        prependRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;
        prependScale(sx: number, sy: number, sz: number): Mat3;
        prependScaleEq(sx: number, sy: number, sz: number): Mat3;
        scale(s: number): Mat3;
        scaleEq(s: number): Mat3;
        sub(m: Mat3): Mat3;
        subEq(m: Mat3): Mat3;
        toArray(columnMajor?: boolean): Array<number>;
        toEulerXyz(): Vec3;
        toQuat(): Quat;
        toString(): string;
        trace(): number;
        transpose(): Mat3;
        transposeEq(): Mat3;

        static numCreations: number;
    }
}