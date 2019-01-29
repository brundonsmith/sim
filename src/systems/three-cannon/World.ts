import * as THREE from 'three';
import * as CANNON from 'cannon';
import { having } from 'utilities/misc';
import PhysicalObject from './PhysicalObject';

export default class World {

    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    public threeScene: THREE.Scene = new THREE.Scene();
    public cannonWorld: CANNON.World = new CANNON.World();
    public objects: Array<PhysicalObject> = [];

    updateCallback: ((delta: number) => void) | void;
    private previousTick: number|null = null;

    get activeCamera(): THREE.Camera {
        let cam;
        if(this.activeCameraId != null) {
            cam = this.threeScene.getObjectById(this.activeCameraId);
        }

        if(!(cam instanceof THREE.Camera)) {
            cam = findCamera(this.threeScene);
        }

        if(!(cam instanceof THREE.Camera)) {
            throw new Error('No camera found in scene');
        }

        this.activeCameraId = cam.id;
        return cam;
    }
    activeCameraId: number|null = null;

    constructor(updateCallback?: (delta: number) => void) {
        this.updateCallback = updateCallback;

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;

        console.log(this.renderer.domElement)
    }

    start(containerElement?: HTMLElement): void {
        debugger;
        
        if(containerElement) {
            containerElement.appendChild(this.renderer.domElement);
        } else {
            debugger;
            document.body.appendChild(this.renderer.domElement);
        }

        this.tick();
    }

    private tick = () => {
        let delta = this.previousTick ? Date.now() - this.previousTick : 0;
        this.previousTick = Date.now();

        this.cannonWorld.step(1 / 600, delta / 1000, 10);

        if(this.updateCallback) {
            this.updateCallback(delta);
        }

        if(this.activeCamera) {
            this.renderer.render(this.threeScene, this.activeCamera);
        }

        requestAnimationFrame(this.tick);
    }

    public addObject(obj: PhysicalObject) {
        this.objects.push(obj);
        obj.register(this.threeScene, this.cannonWorld);
    }
}

const getObject
    : (test: (obj: THREE.Object3D) => boolean) => (container: THREE.Object3D) => THREE.Object3D|undefined
    = (test) => (container) =>
        container.children.find(test) 
        || container.children.map(child => getObject(test)(child)).find(result => result != null)

const findCamera
    : (container: THREE.Object3D) => THREE.Camera|undefined
    = (container) => 
        having(getObject(obj => obj instanceof THREE.Camera)(container), 
            result =>
                result == null ? result : (result as THREE.Camera))
