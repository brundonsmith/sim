import * as THREE from 'three';
import OIMO from 'oimo';

import { TURN_SPEED, LOOK_LIMIT, GRAVITY, ZERO, FORWARD } from "./constants";
import Input from './Input';
import { forward, backward, left, right } from './utils/Vec3';
import { clamp } from './utils/misc';
import { Entity, System, WithThreeObject, WithScoutProperties, WithOimoBody, WithFollow } from './types';
import { almostEqual, almostEqualVec } from './utils/oimo';
import { findInChildren } from './utils/three';

const GRAVITY_VEC = new OIMO.Vec3(0, GRAVITY, 0);
const INVERSE_GRAVITY_VEC = new OIMO.Vec3(0, -1 * GRAVITY, 0);

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
            let physicsRot = entity.oimoBody.getOrientation();
            entity.threeObject.quaternion.set(physicsRot.x, physicsRot.y, physicsRot.z, physicsRot.w);
        }
    },

    // player movement
    {
        filter: (entity) => entity.tags.includes('player'),
        update: (entity: Entity & WithOimoBody) => {
    
            let move = entity.oimoBody.getLinearVelocity();
            let yVel = move.y;

            move.init(0, 0, 0);
            if(Input.keyDown('KeyW')) {
                move.addEq(forward(entity.oimoBody.getOrientation()));
            }
            if(Input.keyDown('KeyS')) {
                move.addEq(backward(entity.oimoBody.getOrientation()));
            }
            if(Input.keyDown('KeyA')) {
                move.addEq(left(entity.oimoBody.getOrientation()));
            }
            if(Input.keyDown('KeyD')) {
                move.addEq(right(entity.oimoBody.getOrientation()));
            }
            move.normalize().scaleEq(10);

            move.y = yVel;

            entity.oimoBody.setLinearVelocity(move);
        }
    },

    // player looking
    {
        filter: (entity) => entity.tags.includes('player'),
        update: (entity: Entity & WithOimoBody & WithThreeObject, delta) => {
            var turnDelta = TURN_SPEED * delta;

            entity.oimoBody.setAngularVelocity(ZERO);
            entity.oimoBody.setRotation(entity.oimoBody.getRotation().appendRotation(-1 * Input.mouseDeltaX() * turnDelta, 0, 1, 0))

            let camera = findInChildren(entity.threeObject, child => child instanceof THREE.Camera);
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
                if(destination == null) {
                    destination = new OIMO.Vec3();
                }

                destination.x = Math.random() * 30 - 15;
                destination.y = Math.random() * 5;
                destination.z = Math.random() * 30 - 15;
            }
            let direction = destination.subEq(entity.oimoBody.getPosition());
            entity.oimoBody.getOrientation().setArc(FORWARD, direction);
            motor(entity, direction, entity.scoutProperties.speed, 100);
            entity.oimoBody.applyForceToCenter(INVERSE_GRAVITY_VEC);
        }
    },

    // following
    {
        filter: (entity) => entity.followTarget,
        update: (entity: Entity & WithThreeObject & WithFollow, delta) => {
            entity.threeObject.position.set(
                entity.followTarget.position.x + (entity.followOffset ? entity.followOffset.x : 0),
                entity.followTarget.position.y + (entity.followOffset ? entity.followOffset.y : 0),
                entity.followTarget.position.z + (entity.followOffset ? entity.followOffset.z : 0)
            );
        }
    }

 ] as Array<System>


const motor
    : (entity: Entity & WithOimoBody, direction: OIMO.Vec3, speed: number, acceleration: number) => void
    = (entity, direction, speed = 1, acceleration = 100) => {
        if(almostEqual(direction.length(), 0.01)) {
            //console.log('dragging')
            let forceVec = entity.oimoBody.getLinearVelocity().normalized().scale(-1 * acceleration);
            entity.oimoBody.applyForceToCenter(forceVec);
        } else if(entity.oimoBody.getLinearVelocity().length() < speed || !almostEqualVec(direction, entity.oimoBody.getLinearVelocity().normalized(), 0.05)) {
            //console.log('motoring')
            direction = direction.normalized().scale(acceleration);
            //console.log({ force: JSON.stringify(direction) })
            entity.oimoBody.applyForceToCenter(direction);
        } else {
            entity.oimoBody.applyForceToCenter(ZERO)
        }
    }

