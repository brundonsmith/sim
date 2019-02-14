declare module OIMO {
    export class ShapeConfig {
        constructor();
        collisionGroup: number;
        collisionMask: number;
        contactCallback: ContactCallback;
        density: number;
        friction: number;
        geometry: Geometry;
        position: Vec3;
        restitution: number;
        rotation: Mat3
    }
}