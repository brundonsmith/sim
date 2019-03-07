import * as OIMO from 'oimo';
import { VectorInit } from "./general";

export type OimoBodyInit = {
    position?: VectorInit,
    orientation?: VectorInit,
    bodyType?: 'DYNAMIC'|'KINEMATIC'|'STATIC',
    mass?: number,
    rotationFactor?: VectorInit,
    shapes?: Array<OimoShapeInit>,
}

export const createOimoBody
    : (init: OimoBodyInit) => OIMO.RigidBody
    = ({ position, orientation, bodyType, mass, rotationFactor, shapes }) => {
        let body = new OIMO.RigidBody(
            Object.assign(new OIMO.RigidBodyConfig(), {
                type: OIMO.RigidBodyType[bodyType || 'DYNAMIC']
            })
        )

        if(position != null) {
            body.setPosition(createOimoVector(position));
        }
        
        if(orientation != null) {
            let rot = new OIMO.Mat3();
            rot.fromEulerXyz(createOimoVector(orientation));
            body.setRotation(rot);
        }
        
        body.setMassData(Object.assign(new OIMO.MassData(), {
            mass: mass == null ? 1 : mass
        }))

        if(rotationFactor != null) {
            body.setRotationFactor(createOimoVector(rotationFactor));
        }

        if(shapes != null) {
            shapes.forEach(s => body.addShape(createOimoShape(s)))
        }


        return body;
    }

type OimoShapeInit = {
    geometry: OimoGeometryInit,
    collisionGroup?: number,
    collisionMask?: number,
    density?: number,
    friction?: number,
    position?: VectorInit,
    rotation?: VectorInit,
    restitution?: number,
}

export const createOimoShape
    : (init: OimoShapeInit) => OIMO.Shape
    = ({ geometry, position, rotation, ...rawProps }) => 
        new OIMO.Shape(Object.assign(new OIMO.ShapeConfig(), {
            ...rawProps,
            geometry: createOimoGeometry(geometry),
            position: createOimoVector(position || { x: 0, y: 0, z: 0 }),
            rotation: createOimoRotationMatrix(rotation || { x: 0, y: 0, z: 0 })
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

const createOimoRotationMatrix
    : (init: VectorInit) => OIMO.Mat3
    = (init) => {
        let mat = new OIMO.Mat3();
        mat.fromEulerXyz(createOimoVector(init));
        return mat;
    }

const createOimoVector
    : (init: VectorInit) => OIMO.Vec3
    = ({ x, y, z }) =>
        new OIMO.Vec3(x, y, z)
