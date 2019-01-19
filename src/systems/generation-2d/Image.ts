
export type Resolution = [ number, number ]

export type Pixel = Gray|Color;

export type Gray = number;

export type Color = [ number, number, number, number ]

export type Image<T extends Pixel> = Array<Array<T>>;

export const resolution
    : (image: Image<Pixel>) => Resolution
    = (image) =>
        [ image.length, image[0] ? image[0].length : 0 ]

/*
export const scale
    : (img: ImageMap) => (newResolution: Resolution) => ImageMap
    = (img) => (newResolution) =>
        Object.assign(
            {},
            img,
            {
                resolution: newResolution,
                pixels: img.pixels.reduce()
            }
        )
*/
