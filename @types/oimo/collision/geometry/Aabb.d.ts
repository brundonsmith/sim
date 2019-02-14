declare module OIMO {
    export class Aabb {

        constructor();
        
        clone(): Aabb;
        combine(other: Aabb): Aabb;
        combined(other: Aabb): Aabb;
        copyFrom(aabb: Aabb): Aabb;
        getCenter(): Vec3;
        getCenterTo(center: Vec3): void;
        getExtents(): Vec3;
        getExtentsTo(halfExtents: Vec3): void;
        getIntersection(other: Aabb): Aabb;
        getIntersectionTo(other: Aabb, intersection: Aabb): void;
        getMax(): Vec3;
        getMaxTo(max: Vec3): void;
        getMin(): Vec3;
        getMinTo(min: Vec3): void;
        init(min: Vec3, max: Vec3): Aabb;
        overlap(other: Aabb): boolean;
        setMax(max: Vec3): Aabb;
        setMin(min: Vec3): Aabb;
    }
}