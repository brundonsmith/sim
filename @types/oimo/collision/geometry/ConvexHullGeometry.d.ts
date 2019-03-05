declare module OIMO {
    export class ConvexHullGeometry extends ConvexGeometry {
        constructor(vertices: Array<Vec3>);
        getVertices(): Array<Vec3>;
    }
}