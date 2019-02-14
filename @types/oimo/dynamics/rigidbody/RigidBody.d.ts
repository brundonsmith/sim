declare module OIMO {
    export class RigidBody {

        constructor(config: RigidBodyConfig);

        userData: any;
;
        addAngularVelocity(angularVelocityChange: Vec3): void;
        addLinearVelocity(linearVelocityChange: Vec3): void;
        addShape(shape: Shape): void;
        applyAngularImpulse(impulse: Vec3): void;
        applyForce(force: Vec3, positionInWorld: Vec3): void;
        applyForceToCenter(force: Vec3): void;
        applyImpulse(impulse: Vec3, positionInWorld: Vec3): void;
        applyLinearImpulse(impulse: Vec3): void;
        applyTorque(torque: Vec3): void;
        getAngularDamping(): number;
        getAngularVelocity(): Vec3;
        getAngularVelocityTo(angularVelocity: Vec3): void;
        getContactLinkList(): ContactLink;
        getGravityScale(): number;
        getJointLinkList(): JointLink;
        getLinearDamping(): number;
        getLinearVelocity(): Vec3;
        getLinearVelocityTo(linearVelocity: Vec3): void;
        getLocalInertia(): Mat3;
        getLocalInertiaTo(inertia: Mat3): void;
        getLocalPoint(worldPoint: Vec3): Vec3;
        getLocalPointTo(worldPoint: Vec3, localPoint: Vec3): void;
        getLocalVector(worldVector: Vec3): Vec3;
        getLocalVectorTo(worldVector: Vec3, localVector: Vec3): void;
        getMass(): number;
        getMassData(): MassData;
        getMassDataTo(massData: MassData): void;
        getNext(): RigidBody;
        getNumContectLinks(): number;
        getNumJointLinks(): number;
        getNumShapes(): number;
        getOrientation():Quat;
        getOrientationTo(orientation:Quat): void;
        getPosition(): Vec3;
        getPositionTo(position: Vec3): void;
        getPrev(): RigidBody;
        getRotation(): Mat3;
        getRotationFactor(): Vec3;
        getRotationTo(rotation: Mat3): void;
        getShapeList(): Shape;
        getSleepTime(): number;
        getTransform(): Transform;
        getTransformTo(transform: Transform): void;
        getType(): number;
        getWorldPoint(localPoint: Vec3): Vec3;
        getWorldPointTo(localPoint: Vec3, worldPoint: Vec3): void;
        getWorldVector(localVector: Vec3): Vec3;
        getWorldVectorTo(localVector: Vec3, worldVector: Vec3): void;
        isSleeping(): boolean;
        removeShape(shape: Shape): void;
        rotate(rotation: Mat3): void;
        rotateXyz(eulerAngles: Vec3): void;
        setAngularDamping(damping: number): void;
        setAngularVelocity(angularVelocity: Vec3): void;
        setAutoSleep(autoSleepEnabled: boolean): void;
        setGravityScale(gravityScale: number): void;
        setLinearDamping(damping: number): void;
        setLinearVelocity(linearVelocity: Vec3): void;
        setMassData(massData: MassData): void;
        setOrientation(quaternion:Quat): void;
        setPosition(position: Vec3): void;
        setRotation(rotation: Mat3): void;
        setRotationFactor(rotationFactor: Vec3): void;
        setRotationXyz(eulerAngles: Vec3): void;
        setTransform(transform: Transform): void;
        setType(type: number): void;
        sleep(): void;
        translate(translation: Vec3): void;
        wakeUp(): void
    }
}