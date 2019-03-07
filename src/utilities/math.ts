
export const avg
    : (...nums: Array<number>) => number
    = (...nums) =>
        nums.reduce((num, sum) => num + sum, 0) / nums.length

export const almostEqual
    : (num1: number, num2: number, threshold?: number) => boolean
    = (num1, num2, threshold = 0.1) =>
        Math.abs(num1 - num2) < threshold

export const clamp
    : <T>(x: T, min: T, max: T) => T
    = (x, min, max) => 
        x > max ? max : (x < min ? min : x)