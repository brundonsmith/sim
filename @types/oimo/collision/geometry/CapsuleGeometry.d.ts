declare module OIMO {
    export class CapsuleGeometry extends ConvexGeometry {
        constructor(radius: number, halfHeight: number);
        getHalfHeight(): number;
        getRadius(): number;
    }
}