import * as THREE from 'three';
import * as OIMO from 'oimo';

import { Entity, WithOimoBody } from "./types";

export const setParent = (entity: Entity, parent: Entity) => {
    let currentScene = getThreeScene(entity.threeObject.parent);
    let destinationScene = getThreeScene(parent.threeObject)

    if(currentScene != null && destinationScene != null) {
        if(entity.threeObject.parent != null) {
            THREE.SceneUtils.detach(entity.threeObject, entity.threeObject.parent, currentScene);
        }
        THREE.SceneUtils.attach(entity.threeObject, destinationScene, parent.threeObject);
    }

    // TODO: Move corresponding OIMO shape if necessary
}

export const setPosition = (entity: Entity, vec: THREE.Vector3) => {
    if(hasOimoBody(entity)) {
        entity.oimoBody.setPosition(new OIMO.Vec3(vec.x, vec.y, vec.z))
    } else {
        entity.threeObject.position.x = vec.x;
        entity.threeObject.position.y = vec.y;
        entity.threeObject.position.z = vec.z;
    }
}

export const getThreeScene = (object: THREE.Object3D|null): THREE.Scene|null =>
    object == null ?
        null
    : object instanceof THREE.Scene ?
        object
    : 
        getThreeScene(object.parent)

// HACK
export const hasOimoBody = (entity: Entity): entity is Entity & WithOimoBody =>
    'oimoBody' in entity

