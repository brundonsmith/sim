declare module OIMO {
    export class RigidBodyConfig {

        constructor();

        public angularDamping: number;
        public angularVelocity: Vec3;
        public autoSleep: boolean;
        public linearDamping: number;
        public linearVelocity: Vec3;
        public position: Vec3;
        public rotation: Mat3;
        public type: number;
    }
}