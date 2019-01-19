import { Entity } from "../entity-component/entity";
import { Occurence } from '../entity-component/scratch';
import { set } from '../utilities/immutable';
import { given } from "utilities/misc";
import { add } from "systems/geometry/Vector";

export default {
    move: {

        init: (entity: Entity) =>
            entity,

        update: (space: Array<Entity>) => (entity: Entity, message: Occurence) => 
            message.name === 'tick' ?
                move(entity, message)
            :
                entity
    }
}

const move 
    = (entity: Entity, message: Occurence) =>
        given(message.args, args =>
            set(entity, '.position', add(entity.position, [ args.distance, 0, 0 ])))
        