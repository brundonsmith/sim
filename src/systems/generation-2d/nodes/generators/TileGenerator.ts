import { GrayscaleImage, Resolution } from "systems/generation-2d/Types";
import { generate2d, generate } from "systems/generation-2d/utils/funcs";
import { having, trace } from "utilities/funcs";

type Params = {
    resolution: Resolution, 
    numberX: number,
    numberY: number,
    patternType: 'image'|'square'|'disc'|'paraboloid'|'bell'|'gaussian'|'thorn'|'pyramid'|'brick'|'gradation'|'waves'|'half-bell'|'ridged-bell'|'crescent'|'capsule'|'cone',
    bevelX: number,
    bevelY: number,
}

const defaults = {
    resolution: [ 512, 512 ],
    numberX: 10,
    numberY: 10,
    patternType: 'brick',
    bevelX: 0.5,
    bevelY: 0.5,
}

export const TileGenerator
    : (parameters: Partial<Params> ) => 
        (inputs: { PatternInput?: GrayscaleImage, Background?: GrayscaleImage }) => { Output: GrayscaleImage }
    = (parameters = {}) => 
        ({ PatternInput, Background }) => 
            having({...defaults, ...parameters}, ({ resolution, numberX, numberY, bevelX, bevelY, patternType }) =>
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

/*
    generate2d(resolution[0], resolution[1], (row) => (column) =>
        Math.min(scoreY(row), scoreX(column))

    generate2d(resolution[0], resolution[1], (row) => (column) =>
        having(PatternInput ? PatternInput[row][column] : 1, foregroundPixel =>
        having(Background   ? Background[row][column]   : 1, backgroundPixel =>
            blend(Math.min(scoreY(row), scoreX(column)))(
                foregroundPixel,
                backgroundPixel
            )))
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

const clamp
    : (val: number, min: number, max: number) => number
    = (val, min = Number.MIN_VALUE, max = Number.MAX_VALUE) =>
        Math.min(Math.max(val, min), max)

const blend
    : (foregroundWeight: number) => (foreground: number, background: number) => number
    = (foregroundWeight) => (foreground, background) =>
        having(1 - foregroundWeight, backgroundWeight =>
            foreground * foregroundWeight + background * backgroundWeight)
        
    