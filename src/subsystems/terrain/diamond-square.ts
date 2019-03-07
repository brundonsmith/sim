import { avg } from 'utilities/math';
import { createBlankHeightmap, getPixel } from "./utils";

export const generateTerrain
    : (width: number, height: number) => Array<Array<number>>
    = (width, height) => {
        if(width !== height) {
            throw new Error(`Heightmap dimensions must be equal: ${width}x${height}`);
        }
        if(!Number.isInteger(Math.log2(width - 1))) {
            throw new Error(`Heightmap width ${width} is not of the form 2^n - 1`);
        }
        if(!Number.isInteger(Math.log2(height - 1))) {
            throw new Error(`Heightmap height ${height} is not of the form 2^n - 1`);
        }

        let heightmap = createBlankHeightmap(width, height);
        diamond(heightmap, 0, height, 0, width);
        return heightmap;
    }

const diamond
    : (heightmap: Array<Array<number>>, firstRow: number, lastRow: number, firstPixel: number, lastPixel: number) => void
    = (heightmap, firstRow, lastRow, firstPixel, lastPixel) => {
        if(lastRow - firstRow >= 2) {
            let middleRow = Math.floor((firstRow + lastRow) / 2);
            let middlePixel = Math.floor((firstPixel + lastPixel) / 2);

            if([ middlePixel, middleRow ].every(index => index >= 0 && index < heightmap.length)) {
                let width = lastPixel - firstPixel;
                let height = lastRow - firstRow;
                let randomScale = (lastRow - firstRow) / heightmap.length;

                let pixels = [
                    getPixel(heightmap, firstRow, firstPixel),
                    getPixel(heightmap, lastRow, lastPixel), 
                    getPixel(heightmap, lastRow, firstPixel),
                    getPixel(heightmap, lastRow, lastPixel)
                ].filter(p => p != null) as Array<number>

                heightmap[middleRow][middlePixel] = 
                    avg(...pixels) + 
                    randomScale * Math.random();

                square(heightmap, firstRow - height/2, middleRow, firstPixel, lastPixel);
                square(heightmap, middleRow, lastRow + height/2, firstPixel, lastPixel);
                square(heightmap, firstRow, lastRow, firstPixel - width/2, middlePixel);
                square(heightmap, firstRow, lastRow, middlePixel, lastPixel + width/2);
            }
        }
    }

const square
    : (heightmap: Array<Array<number>>, firstRow: number, lastRow: number, firstPixel: number, lastPixel: number) => void
    = (heightmap, firstRow, lastRow, firstPixel, lastPixel) => {
        if(lastRow - firstRow >= 2) {
            let middleRow = Math.floor((firstRow + lastRow) / 2);
            let middlePixel = Math.floor((firstPixel + lastPixel) / 2);

            if([ middlePixel, middleRow ].every(index => index >= 0 && index < heightmap.length)) {
                let randomScale = (lastRow - firstRow) / heightmap.length;

                let pixels = [
                    getPixel(heightmap, firstRow, middlePixel),
                    getPixel(heightmap, lastRow, middlePixel), 
                    getPixel(heightmap, middleRow, firstPixel),
                    getPixel(heightmap, middleRow, lastPixel)
                ].filter(p => p != null) as Array<number>

                heightmap[middleRow][middlePixel] = 
                    avg(...pixels) + 
                    randomScale * Math.random();

                diamond(heightmap, firstRow, middleRow, firstPixel, middlePixel);
                diamond(heightmap, firstRow, middleRow, middlePixel, lastPixel);
                diamond(heightmap, middleRow, lastRow, firstPixel, middlePixel);
                diamond(heightmap, middleRow, lastRow, middlePixel, lastPixel);
            }
        }
    }
