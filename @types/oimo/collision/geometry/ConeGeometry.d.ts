declare module OIMO {
    export class ConeGeometry extends ConvexGeometry {
        constructor(radius: number, halfHeight: number);
        getHalfHeight(): number;
        getRadius(): number;
    }
}