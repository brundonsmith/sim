
import { update, Entity, Message, matches, FlatAspect, StructuredAspect, StructuredEntity, destructureEntity, flattenAspects } from 'entity-component/entity';

const TICK_INTERVAL = 33;

// state
var previousTick: number|null = null;
var worldEntities: Array<Entity> = [];
var worldAspects: Array<FlatAspect> = [];

export const message
    : <T extends Message>(filter: string | ((entity: Entity) => boolean), ...message: T) => void
    = (filter, ...message) =>
        worldEntities
            .filter(
                typeof filter === 'string'
                    ? matches(worldEntities)(filter)
                    : filter)
            .forEach(entity => 
                Object.assign(entity, update(entity, message)))

export const start
    : (entities?: Array<StructuredEntity>, aspects?: Array<StructuredAspect>) => void
    = (entities = [], aspects = []) => {
        if(previousTick == null) {
            worldEntities = entities.map(destructureEntity).flat();
            worldAspects = aspects.map(flattenAspects).flat()

            tick();
        }
    }

const tick
    : () => void
    = () => {
        let delta = previousTick == null 
            ? 0 
            : Date.now() - previousTick;
        previousTick = Date.now();

        worldEntities.forEach(entity => 
            Object.assign(entity, update(entity, [ 'tick', delta ])))
        
        setTimeout(tick, TICK_INTERVAL)
    }
