import { Resolution, GrayscaleImage, Gray } from "systems/generation-2d/Types";
import { generate2d } from "systems/generation-2d/utils/funcs";

export const UniformColor
    : (resolution: Resolution, gray: Gray) => 
        () => { Output: GrayscaleImage }
    = (resolution, gray) => () => 
        ({ 
            Output: generate2d(resolution[0], resolution[1], () => () => gray)
        })