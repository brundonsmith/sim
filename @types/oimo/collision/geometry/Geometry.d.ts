declare module OIMO {
    export class Geometry {
        getType(): number;
        getVolume(): number;
        rayCast(begin: Vec3, end: Vec3, transform: Transform, hit: RayCastHit): boolean;
    }
    export class ConvexGeometry extends Geometry {
        computeLocalSupportingVertex(dir: Vec3, out: Vec3): void;
        getGjkMergin(): number;
        setGjkMergin(gjkMergin: number): void;
    }
}