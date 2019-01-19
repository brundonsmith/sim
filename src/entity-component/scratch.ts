
import { Entity } from './entity';
import { pipe, having } from 'utilities/misc';

let space: Array<Entity> = [];

const update
    : (updateFunctions: {[component: string]: ComponentUpdate}, space: Array<Entity>) => (entity: Entity, message: Event) => Entity
    = (updateFunctions, space) => (entity, message) =>
        having(pipe(entity.type.map(type => updateFunctions[type](space))), updatePipe => 
            updatePipe(entity, message))

export type Occurence = { name: string, args?: {[key: string]: any} }

export type ComponentUpdate = (space: Array<Entity>) => <T extends Entity>(entity: T, message: Event) => T


