import { Image, Color, Resolution } from "systems/generation-2d/Image";
import { generate2d } from "systems/generation-2d/utils";

export const UniformColor
    : (resolution: Resolution, color: Color) => 
        () => { Output: Image<Color> }
    = (resolution, color) => () => 
        ({ 
            Output: generate2d(resolution[0], resolution[1], () => () => color)
        })


Image