import * as THREE from 'three';
import * as OIMO from 'oimo';

export const createBlankHeightmap
    : (width: number, height: number) => Array<Array<number>>
    = (width, height) => {
        let res: Array<Array<number>> = [];
        for(let y = 0; y < height; y++) {
            let row: Array<number> = [];
            res.push(row);
            for(let x = 0; x < width; x++) {
                row.push(0);
            }
        }
        return res;
    }

export const createHeightmapGeometry
    : (heightmap: Array<Array<number>>, scale?: number, height?: number) => THREE.Geometry
    = (heightmap, scale = 1, height = 100) => {
        let geometry = new THREE.Geometry();

        // vertices
        geometry.vertices = 
            heightmap.map((row, rowIndex) => 
                row.map((pixel, pixelIndex) => 
                    new THREE.Vector3(rowIndex * scale, pixel * height, pixelIndex * scale))
            ).flat()

        // faces
        for(let r = 0; r < heightmap.length - 1; r++) {
            let row = heightmap[r];
            let currentRowOffset = row.length * r;
            let nextRowOffset = row.length * (r + 1);
            for(let p = 0; p < row.length - 1; p++) {
                geometry.faces.push(new THREE.Face3(
                    currentRowOffset + p, 
                    currentRowOffset + p + 1, 
                    nextRowOffset + p
                ));
                geometry.faces.push(new THREE.Face3(
                    currentRowOffset + p + 1, 
                    nextRowOffset + p + 1, 
                    nextRowOffset + p
                ));
            }
        }
        
        geometry.verticesNeedUpdate = true;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        geometry.computeFaceNormals();
        return geometry;
    }

export const createOimoGeometry
    : (geometry: THREE.Geometry, xChunks?: number, yChunks?: number, zChunks?: number) => Array<OIMO.ConvexHullGeometry>
    = (geometry, xChunks = 1, yChunks = 1, zChunks = 1) => {
        let xIncrement = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / xChunks;
        let yIncrement = (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / yChunks;
        let zIncrement = (geometry.boundingBox.max.z - geometry.boundingBox.min.z) / zChunks;

        let geometries: Array<OIMO.ConvexHullGeometry> = [];
        for(let x = 0; x < xChunks; x++)
            for(let y = 0; y < yChunks; y++)
                for(let z = 0; z < zChunks; z++) {
                    let min = { x: x * xIncrement, y: y * yIncrement, z: z * zIncrement }
                    let max = { x: (x + 1) * xIncrement, y: (y + 1) * yIncrement, z: (z + 1) * zIncrement }
                    geometries.push(new OIMO.ConvexHullGeometry(
                        geometry.vertices
                            .filter(vertex =>
                                vertex.x > min.x && vertex.x < max.x &&
                                vertex.y > min.y && vertex.y < max.y &&
                                vertex.z > min.z && vertex.z < max.z)
                            .map(createOimoVecFromThree)))
                }

        return geometries;
    }

export const createOimoVecFromThree
    : (vec: THREE.Vector3) => OIMO.Vec3
    = (vec) =>
        new OIMO.Vec3(vec.x, vec.y, vec.z)

export const getPixel
    : (heightmap: Array<Array<number>>, row: number, pixel: number) => number|null
    = (heightmap, row, pixel) => {
        if(heightmap[row] == null) {
            return null;
        } else if(heightmap[row][pixel] == null) {
            return null;
        } else {
            return heightmap[row][pixel];
        }
    }
