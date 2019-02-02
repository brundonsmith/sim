import * as THREE from 'three';
import * as CANNON from 'cannon';
import { EULER_ORDER, TURN_SPEED, LOOK_LIMIT, GRAVITY } from "./constants";
import Input from './Input';
import { forward, backward, left, right, normalized } from './utils/Vec3';
import { clamp } from './utils/misc';
import { Entity, System, WithThreeObject, WithCannonBody, WithScoutProperties } from './types';

export default [

    // physics-mirroring
    {
        filter: (entity) => entity.cannonBody && entity.threeObject,
        update: (entity: Entity & WithCannonBody & WithThreeObject) => {
    
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
    },

    // player movement
    {
        filter: (entity) => entity.tags.includes('player'),
        update: (entity: Entity & WithCannonBody) => {
    
            let moveDirection = new CANNON.Vec3(0, 0, 0);
            if(Input.keyDown('KeyW')) {
                moveDirection.vadd(forward(entity.cannonBody.quaternion), moveDirection);
            }
            if(Input.keyDown('KeyS')) {
                moveDirection.vadd(backward(entity.cannonBody.quaternion), moveDirection);
            }
            if(Input.keyDown('KeyA')) {
                moveDirection.vadd(left(entity.cannonBody.quaternion), moveDirection);
            }
            if(Input.keyDown('KeyD')) {
                moveDirection.vadd(right(entity.cannonBody.quaternion), moveDirection);
            }
            moveDirection.normalize();
    
            entity.cannonBody.velocity.x = moveDirection.x * 10;
            entity.cannonBody.velocity.z = moveDirection.z * 10;
        }
    },

    // player looking
    {
        filter: (entity) => entity.tags.includes('player'),
        update: (entity: Entity & WithThreeObject, delta) => {
            let deltaSeconds = delta / 1000;
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
    },

    // scouts
    {
        filter: (entity) => entity.tags.includes('scout'),
        update: (entity: Entity & WithCannonBody & WithScoutProperties, delta) => {
            let destination = entity.scoutProperties.destination;

            // choose new destination
            if(destination == null || entity.cannonBody.position.almostEquals(destination, 0.1)) {
                destination = entity.scoutProperties.destination = new CANNON.Vec3(Math.random() * 30 - 15, Math.random() * 5, Math.random() * 30 - 15);
            }
            let direction = destination.vsub(entity.cannonBody.position);
            entity.cannonBody.quaternion.setFromVectors(new CANNON.Vec3(0, 0, -1), direction);
            motor(entity, direction, entity.scoutProperties.speed, 100);
            entity.cannonBody.force.vadd(new CANNON.Vec3(0, -1 * GRAVITY, 0), entity.cannonBody.force);
        }
    }

 ] as Array<System>


const motor
    : (entity: Entity & WithCannonBody, direction: CANNON.Vec3, speed: number, acceleration: number) => void
    = (entity, direction, speed = 1, acceleration = 100) => {
        if(direction.almostZero(0.01)) {
            console.log('dragging')
            let forceVec = normalized(entity.cannonBody.velocity).scale(-1 * acceleration);
            entity.cannonBody.force.set(forceVec.x, forceVec.y, forceVec.z);
        } else if(entity.cannonBody.velocity.length() < speed || !direction.almostEquals(normalized(entity.cannonBody.velocity), 0.05)) {
            console.log('motoring')
            direction = normalized(direction).scale(acceleration);
            console.log({ force: JSON.stringify(direction) })
            entity.cannonBody.force.set(direction.x, direction.y, direction.z);
        } else {
            entity.cannonBody.force.set(0, 0, 0);
        }
    }

