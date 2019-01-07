
export type Vector3 = {
    x: number,
    y: number,
    z: number
}

export const add = (vec1: Vector3, vec2: Vector3) => 
    eachDimension(vec1, vec2, (n1, n2) => n1 + n2)

export const subtract = (vec1: Vector3, vec2: Vector3) => 
    eachDimension(vec1, vec2, (n1, n2) => n1 - n2)

export const scale = (vec: Vector3, factor: number) =>
    ({ 
        x: vec.x * factor,
        y: vec.y * factor,
        z: vec.z * factor,
    })

// inner
const eachDimension = (vec1: Vector3, vec2: Vector3, func: (n1: number, n2: number) => number) =>
    ({ 
        x: func(vec1.x, vec2.x),
        y: func(vec1.y, vec2.y),
        z: func(vec1.z, vec2.z),
    })