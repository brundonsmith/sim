declare module OIMO {
    export class Geometry {
        getType(): number;
        getVolume(): number;
        rayCast(begin: Vec3, end: Vec3, transform: Transform, hit: RayCastHit): boolean;
    }
}