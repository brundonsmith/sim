import { Update } from '../../entity-component/entity';
import { Vector3 } from 'systems/geometry/Vector3';

export const aspects = {
    ['.transform']: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale:    { x: 0, y: 0, z: 0 }
    }
}

export type Message = 
    | [ 'set-position', Vector3 ]
    | [ 'set-rotation', Vector3 ]
    | [ 'set-scale', Vector3 ]

export const update: Update<Message> = 
    (obj, message) => 
          message == null ?
            obj
        : message[0] === 'set-position' ?
            { ...obj, ...{ position: message[1] } }
        : message[0] === 'set-rotation' ?
            { ...obj, ...{ rotation: message[1] } }
        : message[0] === 'set-scale' ?
            { ...obj, ...{ scale: message[1] } }
        : 
            obj
