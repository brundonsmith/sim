
export const add
    : (a: number, b: number) => number
    = (a, b) => a + b

export const subtract
    : (a: number, b: number) => number
    = (a, b) => a - b

export const multiply
    : (a: number, b: number) => number
    = (a, b) => a * b

export const divide
    : (a: number, b: number) => number
    = (a, b) => a / b

export const map
    : <T,R>(arr: Array<T>, func: (el: T, index: number, arr: Array<T>) => R) => Array<R>
    = Array.prototype.map.call

export const reduce
    : <T,R>(arr: Array<T>, func: (accum: R, el: T, index: number, arr: Array<T>) => R, init: R) => Array<R>
    = Array.prototype.reduce.call
