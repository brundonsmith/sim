
import * as THREE from 'three';

export const findInChildren
    : (obj: THREE.Object3D, match: (child: THREE.Object3D) => boolean) => THREE.Object3D|void
    = (obj, match) =>
        obj.children.find(match) || 
        obj.children
            .map(child => findInChildren(child, match))
            .find(obj => obj != null)

export const alreadyAdded
    : (container: THREE.Object3D, child: THREE.Object3D) => boolean
    = (container, child) =>
        findInChildren(container, c => c === child) != null