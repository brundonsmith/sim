import OIMO from 'oimo';

// initializers
type InterfaceOf<T> = {[key in keyof T]?: T[keyof T]}

export const initRigidbody = (options: { config?: OIMO.RigidBodyConfig, massData?: OIMO.MassData, shapes?: Array<OIMO.Shape> }) => {
    let body = new OIMO.RigidBody(options.config || new OIMO.RigidBodyConfig());

    if(options.massData != null) {
        body.setMassData(options.massData)
    }
    if(options.shapes != null) {
        options.shapes.forEach(shape => 
            body.addShape(shape))
    }

    return body;
}

export const initRigidbodyConfig = (obj: InterfaceOf<OIMO.RigidBodyConfig>) => {
    let result = new OIMO.RigidBodyConfig();
    Object.assign(result, obj);
    return result;
}

export const initMassData = (obj: InterfaceOf<OIMO.MassData>) => {
    let result = new OIMO.MassData();
    Object.assign(result, obj);
    return result;
}

export const initShape = (options: { config?: OIMO.ShapeConfig, friction?: number }) => {
    let shape = new OIMO.Shape(options.config || new OIMO.ShapeConfig());

    if(options.friction != null) {
        shape.setFriction(options.friction)
    }

    return shape;
}

export const initShapeConfig = (obj: InterfaceOf<OIMO.ShapeConfig>) => {
    let result = new OIMO.ShapeConfig();
    Object.assign(result, obj);
    return result;
}


// 
export const almostEqualVec = (vec1: OIMO.Vec3, vec2: OIMO.Vec3, threshold: number = 0.1) => 
    almostEqual(vec1.x, vec2.x, threshold) &&
    almostEqual(vec1.y, vec2.y, threshold) &&
    almostEqual(vec1.z, vec2.z, threshold)

export const almostEqual = (num1: number, num2: number, threshold: number = 0.1) =>
    Math.abs(num1 - num2) < threshold