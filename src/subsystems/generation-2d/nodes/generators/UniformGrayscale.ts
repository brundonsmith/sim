import { Resolution, Image, Gray } from "../../Image";
import { generate2d } from "../../utils";

export const UniformColor
    : (resolution: Resolution, shade: Gray) => 
        () => { Output: Image<Gray> }
    = (resolution, shade) => () => 
        ({ 
            Output: generate2d(resolution[0], resolution[1], () => () => shade)
        })