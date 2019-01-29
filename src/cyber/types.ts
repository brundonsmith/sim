
type Entity = {
    [key: string]: any
}

type System = {
    filter: (entity: Entity) => boolean,
    update: (entity: Entity, delta: number) => void,
}


type WithCannonBody = { cannonBody: CANNON.Body }

type WithThreeObject = { threeObject: THREE.Object3D }

type WithThreeCamera = { threeObject: THREE.Camera }

type WithThreeLight = { threeObject: THREE.Light }