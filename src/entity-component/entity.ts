import { updates } from 'components/index';
import { pipe, having, capture, partialAssign } from 'utilities/funcs';

const ID = Symbol('id');

export type Entity = {
    [ID]: string,
    parent?: string,
    name: string,
    type: Array<string>,

    [key: string]: any,
}

export type StructuredEntity = {
    name?: string,
    type?: Array<string>,
    $?: Array<StructuredEntity>,

    [key: string]: any,
}

export type Message = 
    | [ 'tick', number ]
    | [ string, any ]

export type StructuredAspect = {[key: string]: any};
export type FlatAspect = [ string, {[key: string]: any} ]
    
export type Update<M extends Message> = (obj: Entity, message?: M) => Entity;


// ----------------------------------------------------------------
// entities
// ----------------------------------------------------------------
export const update
    : Update<Message> 
    = (entity, message) =>
        pipe(componentUpdateFuncs(entity), entity, message)

const componentUpdateFuncs
    : (entity: Entity) => Array<Update<Message>>
    = (entity) => 
        entity.type.map(componentName => updates[componentName])

export const derived
    : (space: Array<Entity>) => (entity: Entity) => (aspects: Array<FlatAspect>) => Entity
    = (space) => (entity) => (aspects) =>
        Object.assign(
            {},
            ...aspects.filter(a => matches(space)(a[0])(entity)),
            entity
        )
        
export const matches
    : (space: Array<Entity>) => (selector: string) => (entity: Entity) => boolean
    = (space) => (selector) => (entity) => {
        let segments = tokenizeSelector(selector).reverse();
        let focalEntity: Entity|null = entity;

        for(let i = 0; i < segments.length && focalEntity != null;) {
            let [ segment, conjunction ] = segments.slice(i);
            if(!matchesSegment(segment)(focalEntity)) {
                if(conjunction === '|') {
                    focalEntity = parentOf(space)(focalEntity);
                } else {
                    return false;
                }
            } else {
                i += 2;
            }
        }

        if(focalEntity == null) { // ran out of ancestors before running out of selectors
            return false;
        } else {
            return true;
        }
    }

const matchesSegment
    : (segment: string) => (entity: Entity) => boolean 
    = (segment) => (entity) =>
        having(capture(segment, /\#([a-z\-]+)/gi)[0], name =>
        having(capture(segment, /\.([a-z\-]+)/gi),    types =>
            (name == null || name == entity.name) &&
            types.every(type => entity.types.includes(type))
        ))

export const destructureEntity
    : (structuredEntity: StructuredEntity) => Array<Entity>
    = (structuredEntity) => destructureEntityRecursive(undefined)(structuredEntity)

const destructureEntityRecursive
    : (parent: string|undefined) => (structuredEntity: StructuredEntity) => Array<Entity>
    = (parent = undefined) => (structuredEntity) =>
        having(`${Math.random()}`, id =>
            [
                partialAssign(Object.keys(structuredEntity).filter(k => k !== '$'))(
                    {
                        [ID]: id,
                        parent: parent,
                        name: id,
                        type: [],
                    },
                    (<Entity> structuredEntity)
                )
            ].concat(
                structuredEntity.$ == null
                    ? []
                    : structuredEntity.$
                        .map(destructureEntityRecursive(id))
                        .flat()
            ))


const parentOf
    : (space: Array<Entity>) => (entity: Entity) => Entity|null
    = (space) => (entity) => 
        space.find(e => e[ID] === entity.parent) || null


// ----------------------------------------------------------------
// aspects
// ----------------------------------------------------------------
export const flattenAspects
    : (hierarchy: StructuredAspect) => Array<FlatAspect>
    = (hierarchy) => flattenAspectsRecursive('')(hierarchy)

const flattenAspectsRecursive
    : (baseSelector: string) => (hierarchy: StructuredAspect) => Array<FlatAspect>
    = (baseSelector = '') => (hierarchy) => {
        let aspects: Array<FlatAspect> = [];
        let currentLevel: StructuredAspect = {};

        Object.keys(hierarchy).forEach(key => {
            let val = hierarchy[key];
            if(key[0] === '>' || key[0] === '|' ) {
                if(typeof val === 'object') {
                    aspects.push(...flattenAspectsRecursive(baseSelector + ' ' + key)(val))
                } else {
                    console.error(`Selector ${key} must have an object as its value`)
                }
            } else {
                currentLevel[key] = val;
            }
        })

        let currentAspect: FlatAspect = [ baseSelector, currentLevel ]
        return [ currentAspect ].concat(aspects)
                    .sort((a1, a2) => compareSpecificity(a1[0], a2[0])).reverse();
    }

const compareSpecificity
    : (selector1: string, selector2: string) => number
    = (selector1, selector2) =>
        computeSpecificity(selector1) - computeSpecificity(selector2)

const computeSpecificity
    : (selector: string) => number
    = (selector) =>
        having(tokenizeSelector(selector), tokens =>
            tokens.reduce((conjunctionScore, segment) => 
                segment === '|' ?
                    conjunctionScore + 1
                : segment === '>' ?
                    conjunctionScore + 2
                : 
                    conjunctionScore + 0
            , 0) * 10000 +
            (tokens[0].includes('#') ? 1000 : 0) +
            tokens.reduce((conditionsScore, segment) => 
                conditionsScore + (segment.match(/\.#/g) || []).length
            , 0)
        )

const tokenizeSelector
    : (selector: string) => Array< '>' | '|' | string >
    = (selector) => 
        selector.replace(/[\s]*>[\s]*/g, ' > ').replace(/[\s]*\|[\s]*/g, ' | ').split(/[\s]+/g)
