import { Image, Gray, Resolution } from "systems/generation-2d/Image";
import { generate2d, generate, blend } from "systems/generation-2d/utils";
import { having, clamp } from "utilities/misc";

type Params = {
    resolution: Resolution, 
    opacity: number,
    mode: 'copy'|'linear-dodge'|'subtract'|'multiply'|'add-sub'|'max'|'min'|'switch'|'divide'|'overlay'|'screen'|'soft-light',
    alphaBlending: 'source'|'ignore'|'straight'|'premultiplied',
    croppingAreaLeft: number,
    croppingAreaRight: number,
    croppingAreaTop: number,
    croppingAreaBottom: number,
}

const defaults = {
    resolution: [ 512, 512 ],
    opacity: 1,
    mode: 'copy',
    alphaBlending: 'source',
    croppingAreaLeft: 0,
    croppingAreaRight: 1,
    croppingAreaTop: 0,
    croppingAreaBottom: 1,
}
/*
export const TileGenerator
    : (parameters: Partial<Params> ) => 
        (inputs: { PatternInput?: Image<Gray>, Background?: Image<Gray> }) => { Output: Image<Gray> }
    = (parameters = {}) => 
        ({ PatternInput, Background }) => 
            having({...defaults, ...parameters}, ({ resolution }) =>
                ({
                    Output: (
                        patternType === 'brick' ?
                            having(score(resolution[0], numberY, bevelY), scoreY =>
                            having(score(resolution[1], numberX, bevelX), scoreX =>
                                generate2d(resolution[0], resolution[1], (row) => (column) =>
                                    having(PatternInput ? PatternInput[row][column] : 1, foregroundPixel =>
                                    having(Background   ? Background[row][column]   : 0, backgroundPixel =>
                                        blend(Math.min(scoreY(row), scoreX(column)))(
                                            foregroundPixel,
                                            backgroundPixel
                                        )))
                            )))
                        :
                            generate2d(resolution[0], resolution[1], (row) => (column) => 1)
                    )
                })
            )
*/
const score
    : (resolution: number, count: number, bevel: number) => (p: number) => number
    = (resolution, count, bevel) => having(increments(resolution, count), lines => 
        (p: number) =>
            having(lines.reduce((minDistance, line) => 
                Math.min(Math.abs(p - line), minDistance)
            , Number.MAX_VALUE), minDistance =>
                clamp(minDistance / (bevel * (resolution / count / 2)), 0, 1)))
            

const increments
    : (resolution: number, count: number) => Array<number>
    = (resolution, count) =>
        having(resolution / count, incrementSize =>
            generate(count + 1, (index) => index * incrementSize))
