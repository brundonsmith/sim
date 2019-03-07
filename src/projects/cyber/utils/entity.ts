import { Entity } from "ecs/types";
import { WithFollow } from '../types'

export const hasFollow = (entity: Entity): entity is Entity & WithFollow =>
    'followTarget' in entity && 'followOffset' in entity