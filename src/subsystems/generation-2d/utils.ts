
export const generate
    : <T>(length: number, generator: (index: number) => T) => Array<T>
    = (length, generator) => {
        let arr = new Array(length);

        for(let i = 0; i < arr.length; i++) {
            arr[i] = generator(i);
        }

        return arr;
    }

export const generate2d
    : <T>(length: number, width: number, generator: (row: number) => (column: number) => T) => Array<Array<T>>
    = (length, width, generator) => 
        generate(length, row => 
            generate(width, col =>
                generator(row)(col)))

export const lerp
    : (w: number) => (n1: number, n2: number) => number
    = (w) => (n1, n2) =>
        (1 - w) * n1 + w * n2