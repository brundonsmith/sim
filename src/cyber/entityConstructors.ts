import * as THREE from 'three';
import * as OIMO from 'oimo';
import { Entity, WithThreeCamera, WithThreeLight, WithScoutProperties, WithOimoBody, WithFollow } from './types';
import { initRigidbody, initShape } from './utils/oimo';
import { fallback } from './utils/misc';
/*

type EntityJSON = {
    tags: Array<string>,
    threeObject: ThreeObjectInit,
    oimoBody?: OimoBodyInit,

}

export const constructEntity
    : (json: EntityJSON) => Entity
    = (json) => {
        let entity: Entity & { [key: string]: any  } = {
            tags: json.tags,
            threeObject: createThreeObject(json.threeObject),
        }

        if(json.oimoBody) {
            entity.oimoBody = createOimoBody(json.oimoBody);
        }

        return entity;
    }


export const createCamera
    : () => Entity & WithThreeCamera
    = () => ({
        tags: [ 'camera' ],
        threeObject: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    })
/*
export const createBuilding
    : (props: { x: number, z: number, width: number, depth: number, height: number }) => Entity & WithOimoBody
    = ({ x, z, width, depth, height }) => {
        let oimoBody = initRigidbody({
            config: initRigidbodyConfig({
                type: OIMO.RigidBodyType.STATIC
            }),
            shapes: [
                initShape({
                    config: initShapeConfig({
                        friction: 1,
                        geometry: new OIMO.BoxGeometry(new OIMO.Vec3(width/2, height/2, depth/2)),
                        position: new OIMO.Vec3(width/2, height/2, depth/2)
                    })
                })
            ]
        })

        oimoBody.setPosition(new OIMO.Vec3(x, 0, z));

        let threeObject = Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true })

        threeObject.geometry.translate(width/2, height/2, depth/2)

        return {
            tags: [ 'building' ],
            threeObject,
            oimoBody
        };
    }

/*
export const createBox
    : (props: BasicProps & BasicPhysicsProps & BasicRenderingProps & { width: number, height: number, depth: number }) => Entity & WithOimoBody
    = ({ bodyType, mass, friction, position, orientation, castShadow, receiveShadow, width, height, depth }) => ({
        tags: [],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial()
        ), { castShadow: fallback(castShadow, true), receiveShadow: fallback(receiveShadow, true) }),
        oimoBody: createOimoBody({
            bodyType, mass, friction, position, orientation,
            shape: new OIMO.BoxGeometry(new OIMO.Vec3(width / 2, height / 2, depth / 2))
        })
    })

export const createFloor
    : (props: BasicProps & BasicPhysicsProps & BasicRenderingProps & { width: number, depth: number }) => Entity & WithOimoBody
    = ({ bodyType, mass, friction, position, orientation, castShadow, receiveShadow, width, depth }) => {
        let height = 1;
        let entity = {
            tags: [],
            threeObject: Object.assign(new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial()
            ), { castShadow: fallback(castShadow, false), receiveShadow: fallback(receiveShadow, true) }),
            oimoBody: createOimoBody({
                mass, friction, orientation,
                position: new OIMO.Vec3(0, -1 * height/2, 0),
                bodyType: OIMO.RigidBodyType.STATIC,
                shape: new OIMO.BoxGeometry(new OIMO.Vec3(width/2, height/2, depth/2))
            })
        }

        return entity;
    }
*/
export const createAmbientLight
    : (color: number, intensity: number) => Entity & WithThreeLight
    = (color, intensity) => ({
        tags: [ 'light' ],
        threeObject: new THREE.AmbientLight(color, intensity)
    })

export const createDirectionalLight
    : (color: number, intensity: number, shadows?: boolean) => Entity & WithThreeLight & WithFollow
    = (color, intensity, shadows = true) => {
        let light = Object.assign(new THREE.DirectionalLight(color, intensity), { 
            castShadow: shadows 
        })
        light.castShadow = shadows;
        
        light.add(light.target);
        light.target.position.set(1, -1, 1);

        if(shadows) {
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 10000;
            
            light.shadow.camera.left = -50;
            light.shadow.camera.right = 50;
            light.shadow.camera.top = 50;
            light.shadow.camera.bottom = -50;
        }

        return {
            tags: [ 'light' ],
            threeObject: light,
            followTarget: null,
            followOffset: null
        };
    }

    /*
export const createPlayer
    : (props: BasicProps) => Entity & WithOimoBody
    = ({ position, orientation }) => {
        let cam = createCamera();
        let player = { 
            tags: [ 'player' ],
            threeObject: new THREE.Group(),
            oimoBody: createOimoBody({ 
                position,
                orientation,
                //bodyType: OIMO.RigidBodyType.KINEMATIC, 
                friction: 0,
                shape: new OIMO.CapsuleGeometry(1, 1)
            })
        };

        player.oimoBody.setRotationFactor(ZERO);

        // HACK
        player.threeObject.add(cam.threeObject);

        return player;
    }

export const createScout
    : (props: BasicProps) => Entity & WithScoutProperties & WithOimoBody
    = ({ position, orientation }) => ({
        tags: [ 'scout' ],
        threeObject: Object.assign(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        ), { castShadow: true, receiveShadow: true }),
        oimoBody: createOimoBody({ 
            position, orientation,
            shape: new OIMO.BoxGeometry(new OIMO.Vec3(1/2, 1/2, 1/2)) 
        }),
        scoutProperties: {
            destination: null,
            speed: 1
        }
    })
*/
type ThreeObjectInit = { 
    type: string, 
    position?: VectorInit,
    rotation?: VectorInit,
    geometry?: ThreeGeometryInit,
    children?: Array<ThreeObjectInit>,
    [prop: string]: any
}

const createThreeObject
    : (init: ThreeObjectInit) => THREE.Object3D
    = ({ type, position, rotation, geometry, children, ...rawProps }) => {
        // @ts-ignore
        let constructor = THREE[props.type];
        let obj: THREE.Object3D = new constructor();

        if(position) {
            obj.position.set(position.x, position.y, position.z);
        }
        if(rotation) {
            obj.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        if(children) {
            children.forEach(child => 
                obj.add(createThreeObject(child)))
        }
        if(geometry && obj instanceof THREE.Mesh) {
            obj.geometry = createThreeGeometry(geometry);
        }

        Object.assign(obj, rawProps);

        return obj;
    }

type ThreeGeometryInit = {
    type: 'PlaneGeometry'|'BoxGeometry',
    width?: number,
    height?: number,
    depth?: number,
    widthSegments?: number,
    heightSegments?: number,
    depthSegments?: number
}

const createThreeGeometry
    : (init: ThreeGeometryInit) => THREE.Geometry
    = ({ type, width, height, depth, widthSegments, heightSegments, depthSegments }) => {
        switch(type) {
            case 'PlaneGeometry':
                return new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
            case 'BoxGeometry':
                return new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
        }
    }


type OimoBodyInit = {
    position?: VectorInit,
    //orientation?: OIMO.Quat,
    bodyType?: 'DYNAMIC'|'KINEMATIC'|'STATIC',
    mass?: number,
    shape?: OimoShapeInit,
}
/*
const createOimoBody
    : (init: OimoBodyInit) => OIMO.RigidBody
    = ({ bodyType, mass, shape, position }) => {
        let body = initRigidbody({
            config: initRigidbodyConfig({
                type: OIMO.RigidBodyType[bodyType || 'DYNAMIC']
            }),
            massData: initMassData({
                mass: fallback(mass, 1)
            })
        })

        if(shape) {
            body.addShape(createOimoShape(shape))
        }

        if(position) {
            body.setPosition(createOimoVector(position));
        }
        /*
        if(orientation) {
            body.setOrientation(orientation);
        }

        return body;
    }

*/
type OimoShapeInit = {
    geometry: OimoGeometryInit,
    collisionGroup?: number,
    collisionMask?: number,
    density?: number,
    friction?: number,
    localTransform?: VectorInit,
    restitution?: number,
}

const createOimoShape
    : (init: OimoShapeInit) => OIMO.Shape
    = ({ geometry, localTransform, ...rawProps }) =>
        new OIMO.Shape(Object.assign(new OIMO.ShapeConfig(), {
            ...rawProps,
            geometry: createOimoGeometry(geometry),
            position: createOimoVector(localTransform || { x: 0, y: 0, z: 0 })
        }))


type OimoGeometryInit = {
    type: 'BoxGeometry'|'CapsuleGeometry'|'ConeGeometry'|'ConvexHullGeometry'|'CylinderGeometry'|'SphereGeometry',
    halfExtents?: VectorInit,
    radius?: number,
    halfHeight?: number,
    vertices?: Array<VectorInit>
}

const createOimoGeometry
    : (init: OimoGeometryInit) => OIMO.Geometry
    = ({ type, halfExtents, radius, halfHeight, vertices }) => {
        switch(type) {
            case 'BoxGeometry':
                return new OIMO.BoxGeometry(createOimoVector(halfExtents || { x: 1, y: 1, z: 1 }))
            case 'CapsuleGeometry':
                return new OIMO.CapsuleGeometry(radius || 1, halfHeight || 1)
            case 'ConeGeometry':
                return new OIMO.ConeGeometry(radius || 1, halfHeight || 1)
            case 'ConvexHullGeometry':
                return new OIMO.ConvexHullGeometry((vertices || []).map(createOimoVector))
            case 'CylinderGeometry':
                return new OIMO.CylinderGeometry(radius || 1, halfHeight || 1)
            case 'SphereGeometry':
                return new OIMO.SphereGeometry(radius || 1)
        }
    }


type VectorInit = { x: number, y: number, z: number };

const createThreeVector
    : (init: VectorInit) => THREE.Vector3
    = ({ x, y, z }) =>
        new THREE.Vector3(x, y, z)

const createOimoVector
    : (init: VectorInit) => OIMO.Vec3
    = ({ x, y, z }) =>
        new OIMO.Vec3(x, y, z)