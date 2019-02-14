declare module OIMO {
    export class World {
        constructor(broadPhaseType?: number, gravity?: Vec3);
        aabbTest(aabb: Aabb, callback: AabbTestCallback): void;
        addJoint(joint: Joint): void;
        addRigidBody(rigidBody: RigidBody): void;
        convexCast(convex: ConvexGeometry, begin: Transform, translation: Vec3, callback: RayCastCallback): void;
        debugDraw(): void;
        getBroadPhase(): BroadPhase;
        getContactManager(): ContactManager;
        getDebugDraw(): DebugDraw;
        getGravity(): Vec3;
        getJointList(): Joint;
        getNumIslands(): number;
        getNumJoints(): number;
        getNumPositionIterations(): number;
        getNumRigidBodies(): number;
        getNumShapes(): number;
        getNumVelocityIterations(): number;
        getRigidBodyList(): RigidBody;
        rayCast(begin: Vec3, end: Vec3, callback: RayCastCallback): void;
        removeJoint(joint: Joint): void;
        removeRigidBody(rigidBody: RigidBody): void;
        setDebugDraw(debugDraw: DebugDraw): void;
        setGravity(gravity: Vec3): void;
        setNumPositionIterations(numPositionIterations: number): void;
        setNumVelocityIterations(numVelocityIterations: number): void;
        step(timeStep: number): void;
    }
}