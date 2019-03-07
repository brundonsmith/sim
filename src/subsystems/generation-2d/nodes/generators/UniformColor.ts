import { Image, Color, Resolution } from "../../Image";
import { generate2d } from "../../utils";

export const UniformColor
    : (resolution: Resolution, color: Color) => 
        () => { Output: Image<Color> }
    = (resolution, color) => () => 
        ({ 
            Output: generate2d(resolution[0], resolution[1], () => () => color)
        })


Image