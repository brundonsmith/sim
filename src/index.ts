import * as THREE from 'three';
import World from 'systems/three-cannon/World';
import PhysicalObject from 'systems/three-cannon/PhysicalObject';
import { boxCollider } from 'systems/three-cannon/utilities';

let world = new World();

let camera = new PhysicalObject(
    new THREE.Camera(), 
    { mass: 0 }, [ ]
)

world.addObject(camera)



let box = new PhysicalObject(
    new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()), 
    { mass: 0 }, [ boxCollider(1, 1, 1) ]
)

world.addObject(box)

box.position.z = 5;

world.start();

/*
import { TileGenerator } from 'systems/generation-2d/nodes/generators/TileGenerator';
import { Image, Gray } from 'systems/generation-2d/Image';

const width = 512, height = 512;

let generated = 
    TileGenerator({ resolution: [ width, height ], numberX: 3, numberY: 3 })({ 
        PatternInput: TileGenerator({ resolution: [ width, height ], numberX: 20, numberY: 20 })({ }).Output, 
    }).Output;


{
    const writeToContext
        : (context: CanvasRenderingContext2D, image: Image<Gray>) => void
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
}*/
