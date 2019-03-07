import { merge } from "utilities/misc";
import { add as addNums, subtract as subtractNums, multiply as multiplyNums } from "utilities/builtin";

export type Vector = Array<number>
export type Vector2 = [ number, number ]
export type Vector3 = [ number, number, number ]

export const x
    : (vec: Readonly<Vector>) => number
    = (vec) => 
        vec[0]

export const y
    : (vec: Readonly<Vector>) => number
    = (vec) => 
        vec[1]

export const z
    : (vec: Readonly<Vector>) => number
    = (vec) => 
        vec[2]

export const add 
    = <T extends Vector>(vec1: Readonly<T>, vec2: Readonly<T>): T => 
        (merge(addNums)(vec1, vec2) as T)
        
export const subtract 
    = <T extends Vector>(vec1: Readonly<T>, vec2: Readonly<T>): T => 
        (merge(subtractNums)(vec1, vec2) as T)

export const scale 
    = <T extends Vector>(vec: Readonly<T>, factor: number): T =>
        (vec.map(dim => dim * factor) as T)

export const dot 
    : (vec1: Readonly<Vector>, vec2: Readonly<Vector>) => number
    = (vec1, vec2) => 
        merge(multiplyNums)(vec1, vec2).reduce((sum, product) => sum + product, 0)

export const magnitude
    : (vec: Readonly<Vector>) => number
    = (vec) =>
        Math.sqrt(dot(vec, vec))

export const normalized
    = <T extends Vector>(vec: Readonly<T>): T =>
        scale(vec, 1 / magnitude(vec))
