import * as THREE from 'three';
import { VectorInit } from "./general";

export type ThreeObjectInit = { 
    type: string, 
    position?: VectorInit,
    rotation?: VectorInit,
    material?: ThreeMaterialInit,
    castShadow?: boolean,
    receiveShadow?: boolean,
    geometry?: ThreeGeometryInit,
    children?: Array<ThreeObjectInit>,
    [prop: string]: any
}

export const createThreeObject
    : (init: ThreeObjectInit) => THREE.Object3D
    = ({ type, position, rotation, material, geometry, children, ...rawProps }) => {
        // @ts-ignore
        let obj: THREE.Object3D = new THREE[type]();

        if(position != null) {
            obj.position.set(position.x, position.y, position.z);
        }
        if(rotation != null) {
            obj.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        if(children != null) {
            children.forEach(child => 
                obj.add(createThreeObject(child)))
        }
        if(obj instanceof THREE.Mesh) {
            if(material != null) {
                obj.material = createThreeMaterial(material);
            }
            if(geometry != null) {
                obj.geometry = createThreeGeometry(geometry);
            }
        }

        Object.assign(obj, rawProps);

        return obj;
    }



type ThreeMaterialInit = {
    type: 'MeshStandardMaterial', // TODO
    [propName: string]: any // TODO
}

const createThreeMaterial
    : (init: ThreeMaterialInit) => THREE.Material
    = ({ type, color, ...rawProps }) => 
        new THREE[type]({ 
            color: color == null ? undefined : createThreeColor(color),
            ...rawProps
        })



type ThreeColorInit = {
    r?: number,
    g?: number,
    b?: number,

    colorString?: string
}

const createThreeColor
    : (init: ThreeColorInit) => THREE.Color
    = ({ r, g, b, colorString }) =>
        colorString
            ? new THREE.Color(colorString)
            // @ts-ignore
            : new THREE.Color(r, g, b)



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

const createThreeVector
    : (init: VectorInit) => THREE.Vector3
    = ({ x, y, z }) =>
        new THREE.Vector3(x, y, z)
