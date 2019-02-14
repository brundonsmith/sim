declare module OIMO {
    export class Shape {

        constructor(config: ShapeConfig);

        userData: any;

        getAabb(): Aabb;
        getAabbTo(aabb: Aabb): void;
        getCollisionGroup(): number;
        getCollisionMask(): number;
        getContactCallback(): ContactCallback;
        getDensity(): number;
        getFriction(): number;
        getGeometry(): Geometry;
        getLocalTransform(): Transform;
        getLocalTransformTo(transform: Transform): void;
        getNext(): Shape;
        getPrev(): Shape;
        getRestitution(): number;
        getRigidBody(): RigidBody;
        getTransform(): Transform;
        getTransformTo(transform: Transform): void;
        setCollisionGroup(collisionGroup: number): void;
        setCollisionMask(collisionMask: number): void;
        setContactCallback(callback: ContactCallback): void;
        setDensity(density: number): void;
        setFriction(friction: number): void;
        setLocalTransform(transform: Transform): void;
        setRestitution(restitution: number): void;

    }
}