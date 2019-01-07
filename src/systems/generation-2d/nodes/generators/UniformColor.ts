import { ColorImage, Color, Resolution } from "systems/generation-2d/Types";
import { generate2d } from "systems/generation-2d/utils/funcs";

export const UniformColor
    : (resolution: Resolution, color: Color) => 
        () => { Output: ColorImage }
    = (resolution, color) => () => 
        ({ 
            Output: generate2d(resolution[0], resolution[1], () => () => color)
        })