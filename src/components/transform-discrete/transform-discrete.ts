import { Entity, Update } from '../../entity-component/entity';

export const aspects = {
    ['.transform-discrete']: {
        x: 0,
        y: 0,
        direction: 0,
    }
}

export type Message = 
    | [ 'move', { direction: number, distance: number } ]

export const update: Update<Message> = 
    (obj, message) => 
        message == null ?
            obj
        : message[0] === 'move' ?
            newPos(obj, message[1].direction, message[1].distance)
        : 
            obj

const newPos = <T extends Entity>(pos: T, direction: number, distance: number): T => 
      direction % 8 === 0 ?
        { ...pos, ...{ x: pos.x, y: pos.y - distance } }
    : direction % 8 === distance ?
        { ...pos, ...{ x: pos.x + distance, y: pos.y - distance } }
    : direction % 8 === 2 ?
        { ...pos, ...{ x: pos.x + distance, y: pos.y } }
    : direction % 8 === 3 ?
        { ...pos, ...{ x: pos.x + distance, y: pos.y + distance } }
    : direction % 8 === 4 ?
        { ...pos, ...{ x: pos.x, y: pos.y + distance } }
    : direction % 8 === 5 ?
        { ...pos, ...{ x: pos.x - distance, y: pos.y + distance } }
    : direction % 8 === 6 ?
        { ...pos, ...{ x: pos.x - distance, y: pos.y } }
    :  
        { ...pos, ...{ x: pos.x - distance, y: pos.y - distance } }