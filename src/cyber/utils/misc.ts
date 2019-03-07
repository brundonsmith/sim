
export const clamp
    : (x: number, min: number, max: number) => number
    = (x, min, max) =>
        x < min ? 
            min 
        : x > max ? 
            max 
        :
            x

export const fallback = <T>(val: T, def: NonNullable<T>): NonNullable<T> =>
    val == null ? def : (val as NonNullable<T>)
        

const combinations
    : <T>(a: Array<T>, b: Array<T>) => Array<[T, T]>
    = <T>(a, b) =>
        a.map(aVal => b.map(bVal => [ aVal, bVal ] as [ T, T ])).flat()