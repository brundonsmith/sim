declare module OIMO {
    export class SphereGeometry extends ConvexGeometry {
        constructor(radius: number);
        getRadius(): number;
    }
}