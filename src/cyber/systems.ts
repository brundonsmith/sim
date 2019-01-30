import * as THREE from 'three';
import * as CANNON from 'cannon';
import { EULER_ORDER } from "./constants";
import Input from './Input';
import { forward, backward, left, right, normalized } from './utils/Vec3';
import { clamp } from './utils/misc';

export const physicsRenderSystem: System = {
    filter: (entity) => entity.cannonBody && entity.threeObject,
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

export const movementSystem: System = {
    filter: (entity: Entity) => entity.tags.includes('player'),
    update: (entity: Entity & WithCannonBody) => {

        let moveDirection = new CANNON.Vec3(0, 0, 0);
        if(Input.keyDown('W')) {
            moveDirection.vadd(forward(entity.cannonBody.quaternion));
        }
        if(Input.keyDown('S')) {
            moveDirection.vadd(backward(entity.cannonBody.quaternion));
        }
        if(Input.keyDown('A')) {
            moveDirection.vadd(left(entity.cannonBody.quaternion));
        }
        if(Input.keyDown('D')) {
            moveDirection.vadd(right(entity.cannonBody.quaternion));
        }
        moveDirection.normalize();

        entity.cannonBody.velocity.x = moveDirection.x * 10;
        entity.cannonBody.velocity.z = moveDirection.z * 10;
    }
}
export const lookingSystem: System = {
    filter: (entity: Entity) => entity.tags.includes('player'),
    update: (entity: Entity & WithThreeObject, delta: number) => {
        let deltaSeconds = delta / 1000;
        const TURN_SPEED = 0.05;
        const LOOK_LIMIT = Math.PI / 4;
        var turnDelta = TURN_SPEED * deltaSeconds;

        let rigidbodyEuler = new CANNON.Vec3();
        entity.cannonBody.quaternion.toEuler(rigidbodyEuler, 'YZX');
        entity.cannonBody.quaternion.setFromEuler(rigidbodyEuler.x, rigidbodyEuler.y - Input.mouseDeltaX() * turnDelta, rigidbodyEuler.z, 'YZX');
        entity.cannonBody.angularVelocity = new CANNON.Vec3(0, 0, 0);

        let camera = entity.threeObject.children.find(child => child instanceof THREE.Camera);
        if(camera != null) {
            camera.rotation.x = clamp(camera.rotation.x - Input.mouseDeltaY() * turnDelta,
                                        -1 * LOOK_LIMIT,
                                        LOOK_LIMIT)
        }   
    }
}

export const motor
    : (entity: Entity & WithCannonBody, direction: CANNON.Vec3, speed: number, acceleration: number) => void
    = (entity, direction, speed = 1, acceleration = 100) => {
        if(direction.almostZero(0.01)) {
            //console.log('dragging')
            let forceVec = normalized(entity.cannonBody.velocity).scale(-1 * acceleration);
            //entity.cannonBody.force.set(forceVec.x, forceVec.y, forceVec.z);
        } else if(entity.cannonBody.velocity.length() < speed || !direction.almostEquals(normalized(entity.cannonBody.velocity), 0.05)) {
            //console.log('motoring')
            direction = normalized(direction).scale(acceleration);
            entity.cannonBody.force.set(direction.x, direction.y, direction.z);
        } else {
            entity.cannonBody.force.set(0, 0, 0);
        }
    }

