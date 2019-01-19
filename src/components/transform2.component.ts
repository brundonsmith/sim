import { Vector3 } from "systems/geometry/Vector";
import { Occurence } from '../entity-component/scratch';
import { Entity } from "../entity-component/entity";

type Transform = {
    position: Vector3,
    rotation: Vector3,
    scale: Vector3
}

export default {
    transform2: {

        init: (entity: Entity) =>
            ({
                ...entity,
                position: [ 0, 0, 0 ],
                rotation: [ 0, 0, 0 ],
                scale:    [ 0, 0, 0 ]
            }),

        update: (space: Array<Entity>) => (entity: Transform, message: Occurence) => 
            entity
    }
}

