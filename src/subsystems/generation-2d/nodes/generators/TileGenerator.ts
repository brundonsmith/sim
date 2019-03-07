import { Image, Gray, Resolution } from "../../Image";
import { generate2d, generate, lerp } from "../../utils";
import { having } from "utilities/misc";
import { clamp } from 'utilities/math';

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
        (inputs: { PatternInput?: Image<Gray>, Background?: Image<Gray> }) => { Output: Image<Gray> }
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
                                        lerp(Math.min(scoreY(row), scoreX(column)))(
                                            backgroundPixel,
                                            foregroundPixel
                                        )))
                            )))
                        :
                            generate2d(resolution[0], resolution[1], (row) => (column) => 1)
                    )
                })
            )

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
