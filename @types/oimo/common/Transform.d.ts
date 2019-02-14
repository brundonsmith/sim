declare module OIMO {
    export class Transform {
        
        constructor();

        clone(): Transform;
        copyFrom(transform: Transform): Transform;
        getOrientation(): Quat;
        getOrientationTo(orientation: Quat): void;
        getPosition(): Vec3;
        getPositionTo(position: Vec3): void;
        getRotation(): Mat3;
        getRotationTo(out: Mat3): void;
        identity(): Transform;
        rotate(rotation: Mat3): void;
        rotateXyz(eulerAngles: Vec3): void;
        setOrientation(quaternion: Quat): Transform;
        setPosition(position: Vec3): Transform;
        setRotation(rotation: Mat3): Transform;
        setRotationXyz(eulerAngles: Vec3): void;
        translate(tranlsation: Vec3): void;
    }
}