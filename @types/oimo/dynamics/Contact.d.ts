declare module OIMO {
    export class Contact {

        getContactConstraint(): ContactConstraint;
        getManifold(): Manifold;
        getNext(): Contact;
        getPrev(): Contact;
        getShape1(): Shape;
        getShape2(): Shape;
        isTouching(): boolean;
        
    }
}