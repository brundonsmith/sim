import * as THREE from 'three';
import OIMO from 'oimo';

import { TURN_SPEED, LOOK_LIMIT, GRAVITY } from "./constants";
import Input from './Input';
import { forward, backward, left, right } from './utils/Vec3';
import { clamp } from './utils/misc';
import { Entity, System, WithThreeObject, WithScoutProperties, WithOimoBody } from './types';
import { almostEqual, almostEqualVec } from './utils/oimo';

export default [

    // physics-mirroring
    {
        filter: (entity) => entity.oimoBody && entity.threeObject,
        update: (entity: Entity & WithOimoBody & WithThreeObject) => {
    
            // position
            entity.threeObject.position.set(
                entity.oimoBody.getPosition().x, 
                entity.oimoBody.getPosition().y, 
                entity.oimoBody.getPosition().z
            )
    
            // rotation
            let physicalRot = entity.oimoBody.getOrientation();
            entity.threeObject.rotation.setFromQuaternion(new THREE.Quaternion(
                physicalRot.x, physicalRot.y, physicalRot.z, physicalRot.w))
        }
    },

    // player movement
    {
        filter: (entity) => entity.tags.includes('player'),
        update: (entity: Entity & WithOimoBody) => {
    
            let moveDirection = new OIMO.Vec3(0, 0, 0);
            if(Input.keyDown('KeyW')) {
                moveDirection.addEq(forward(entity.oimoBody.getOrientation()));
            }
            if(Input.keyDown('KeyS')) {
                moveDirection.addEq(backward(entity.oimoBody.getOrientation()));
            }
            if(Input.keyDown('KeyA')) {
                moveDirection.addEq(left(entity.oimoBody.getOrientation()));
            }
            if(Input.keyDown('KeyD')) {
                moveDirection.addEq(right(entity.oimoBody.getOrientation()));
            }
            moveDirection.normalize();
    
            entity.oimoBody.setLinearVelocity(new OIMO.Vec3(
                moveDirection.x * 10,
                entity.oimoBody.getLinearVelocity().y,
                moveDirection.z * 10
            ))
        }
    },

    // player looking
    {
        filter: (entity) => entity.tags.includes('player'),
        update: (entity: Entity & WithOimoBody & WithThreeObject, delta) => {
            let deltaSeconds = delta / 1000;
            var turnDelta = TURN_SPEED * deltaSeconds;
    /*
            let rigidbodyEuler = new CANNON.Vec3();
            entity.oimoBody.quaternion.toEuler(rigidbodyEuler, 'YZX');
            entity.oimoBody.setRotation(new OIMO.Vec3(
                rigidbodyEuler.x, rigidbodyEuler.y - Input.mouseDeltaX() * turnDelta, rigidbodyEuler.z));
            entity.oimoBody.angularVelocity = new CANNON.Vec3(0, 0, 0);
    */
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
        update: (entity: Entity & WithOimoBody & WithScoutProperties, delta) => {
            let destination = entity.scoutProperties.destination;

            // choose new destination
            if(destination == null || almostEqualVec(entity.oimoBody.getPosition(), destination)) {
                destination = entity.scoutProperties.destination = new OIMO.Vec3(Math.random() * 30 - 15, Math.random() * 5, Math.random() * 30 - 15);
            }
            let direction = destination.subEq(entity.oimoBody.getPosition());
            entity.oimoBody.getOrientation().setArc(new OIMO.Vec3(0, 0, -1), direction);
            motor(entity, direction, entity.scoutProperties.speed, 100);
            entity.oimoBody.applyForceToCenter(new OIMO.Vec3(0, -1 * GRAVITY, 0));
        }
    }

 ] as Array<System>


const motor
    : (entity: Entity & WithOimoBody, direction: OIMO.Vec3, speed: number, acceleration: number) => void
    = (entity, direction, speed = 1, acceleration = 100) => {
        if(almostEqual(direction.length(), 0.01)) {
            console.log('dragging')
            let forceVec = entity.oimoBody.getLinearVelocity().normalized().scale(-1 * acceleration);
            entity.oimoBody.applyForceToCenter(forceVec);
        } else if(entity.oimoBody.getLinearVelocity().length() < speed || !almostEqualVec(direction, entity.oimoBody.getLinearVelocity().normalized(), 0.05)) {
            console.log('motoring')
            direction = direction.normalized().scale(acceleration);
            console.log({ force: JSON.stringify(direction) })
            entity.oimoBody.applyForceToCenter(direction);
        } else {
            entity.oimoBody.applyForceToCenter(new OIMO.Vec3(0, 0, 0))
        }
    }

