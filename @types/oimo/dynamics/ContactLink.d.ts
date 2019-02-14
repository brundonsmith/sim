declare module OIMO {
    export class ContactLink {
        getContact(): Contact;
        getNext(): ContactLink;
        getOther(): RigidBody;
        getPrev(): ContactLink;
    }
}