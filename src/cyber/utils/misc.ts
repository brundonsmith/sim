
export const clamp
    : (x: number, min: number, max: number) => number
    = (x, min, max) =>
        x < min ? 
            min 
        : x > max ? 
            max 
        :
            x
