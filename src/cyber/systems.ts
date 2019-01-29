import * as THREE from 'three';
import * as CANNON from 'cannon';
import { EULER_ORDER } from "./constants";

export const physicsRenderSystem: System = {
    filter: (entity: Entity) => entity.cannonBody && entity.threeObject,
    update: (entity: Entity & WithCannonBody & WithThreeObject, delta: number) => {

        // position
        entity.threeObject.position.set(
            entity.cannonBody.position.x, 
            entity.cannonBody.position.y, 
            entity.cannonBody.position.z
        )

        // rotation
        let euler = new CANNON.Vec3();
        entity.cannonBody.quaternion.toEuler(euler, EULER_ORDER);
        entity.threeObject.rotation.set(
            euler.x, 
            euler.y, 
            euler.z, 
            EULER_ORDER
        )
    }
}