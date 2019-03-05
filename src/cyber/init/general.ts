import { OimoBodyInit, createOimoBody } from "./oimo-objects";
import { ThreeObjectInit, createThreeObject } from "./three-objects";
import { Entity } from "../types";


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

    
export type VectorInit = { x: number, y: number, z: number };
