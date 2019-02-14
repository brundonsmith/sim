declare module OIMO {
    export class BoxGeometry extends ConvexGeometry {
        constructor(halfExtents: Vec3);
        getHalfExtents(): Vec3;
        getHalfExtentsTo(halfExtents: Vec3): void;
    }
}