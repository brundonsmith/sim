declare module OIMO {
    export class CylinderGeometry extends ConvexGeometry {
        constructor(radius: number, halfHeight: number);
        getHalfHeight(): number;
        getRadius(): number;
    }
}