
import { start } from 'entity-component/world';

import { TileGenerator } from 'systems/generation-2d/nodes/generators/TileGenerator';
import { GrayscaleImage, ColorImage } from 'systems/generation-2d/Types';
import { having } from 'utilities/funcs';

const width = 512, height = 512;

let foreground = TileGenerator({ resolution: [ width, height ], numberX: 20, numberY: 20 })({ }).Output
console.log(foreground)

let generated = TileGenerator({ resolution: [ width, height ], numberX: 3, numberY: 3 })({ 
    PatternInput: foreground, 
}).Output;


{
    const writeToContext
        : (context: CanvasRenderingContext2D, image: GrayscaleImage) => void
        = (context, image) => {
            let width = image.length;
            let height = image[0].length;
            let img = context.getImageData(0, 0, width, height);

            for(let x = 0; x < width; x++) {
                for(let y = 0; y < height; y++) {
                    let pixelIndex = y % width + x * width;
                    img.data[pixelIndex * 4 + 0] = Math.floor(image[x][y] * 255);
                    img.data[pixelIndex * 4 + 1] = Math.floor(image[x][y] * 255);
                    img.data[pixelIndex * 4 + 2] = Math.floor(image[x][y] * 255);
                    img.data[pixelIndex * 4 + 3] = 255;
                }
            }

            context.putImageData(img, 0, 0)
        }
        

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '1px solid black';
    document.body.appendChild(canvas);

    let context = canvas.getContext('2d');
    if(context != null) {
        writeToContext(context, generated);
    }
}
/*
{
    var table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = width + 'px';
    table.style.height = height + 'px';
    table.style.border = '1px solid black';

    table.innerHTML = generated.map(row =>
        `<tr>
            ${row.map(val => 
                `<td style="background: rgb(${Math.floor(val * 255)}, ${Math.floor(val * 255)}, ${Math.floor(val * 255)}); border: none; padding:0; margin:0;"></td>`).join('')}
        </tr>`
    ).join('\n')

    document.body.appendChild(table);

}*/
    
    
//start();