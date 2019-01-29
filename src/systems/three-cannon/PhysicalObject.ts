import * as THREE from 'three';
import * as CANNON from 'cannon';
import { observable, computed, autorun } from 'mobx';
import { having } from 'utilities/misc';

import { Collider } from './utilities';

const EULER_ORDER = 'YZX';

/**
 * A class that wraps and unifies Three.js and Cannon.js together, 
 * so you don't have to try and align them yourself.
 */
export default class PhysicalObject {

    //public parent: PhysicalObject|null = null;

    public get position(): THREE.Vector3 {
        return observable(this.model.position);
    }
    public set position(value: THREE.Vector3) {
        this.body.position.x = value.x;
        this.body.position.y = value.y;
        this.body.position.z = value.z;
    }
    public get rotation(): THREE.Vector3 {
        return observable(this.bodyEuler);
    }
    public set rotation(value: THREE.Vector3) {
        this.body.quaternion.setFromEuler(value.x, value.y, value.z, EULER_ORDER);
    }
    public get scale(): THREE.Vector3 {
        return observable(this.model.scale);
    }
    public set scale(value: THREE.Vector3) {
        this.model.scale.x = value.x;
        this.model.scale.y = value.y;
        this.model.scale.z = value.z;
    }

    @computed
    private get bodyEuler(): THREE.Vector3 {
        this.body.quaternion.toEuler(this.bodyEulerVec3, EULER_ORDER);
        Object.assign(this.bodyEulerVector3, this.bodyEulerVec3);
        return this.bodyEulerVector3;
    }
    private bodyEulerVec3: CANNON.Vec3 = new CANNON.Vec3();
    private bodyEulerVector3: THREE.Vector3 = new THREE.Vector3();

    // three
    public model: THREE.Object3D;

    // cannon
    @observable private body: CANNON.Body;

    constructor(model: THREE.Object3D, bodyOptions: CANNON.IBodyOptions, colliders: Array<Collider>) {
        

        // three
        this.model = model;


        // cannon
        this.body = new CANNON.Body(bodyOptions);

        colliders.forEach(collider =>
            collider.shapes.forEach((shape, index) =>
                having(collider.shapeOffsets[index], offset => 
                    this.body.addShape(shape, new CANNON.Vec3(offset.x, offset.y, offset.z)))))
        /*
        this.body.addEventListener('collide', (e) => {
            this.gameObject.components.forEach(component => component.onCollision(e))
        })*/


        // sync
        autorun(() => this.model.position.x = this.body.position.x)
        autorun(() => this.model.position.y = this.body.position.y)
        autorun(() => this.model.position.z = this.body.position.z)

        autorun(() => 
            this.model.rotation.setFromVector3(this.bodyEuler, EULER_ORDER))
    }

    register(renderScene: THREE.Scene, physicsWorld: CANNON.World) {
        renderScene.add(this.model);
        physicsWorld.addBody(this.body);
    }

}
