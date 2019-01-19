import { pipe } from "./misc";

type KeyedObject = {[key: string]: any}

export const setn
    = <T extends KeyedObject>(obj: Readonly<T>, ...ops: Readonly<Array<[ string, any ]>>) => 
        pipe<T>(ops.map(op => (x: T) => set<T>(x, op[0], op[1])))( obj )

export const set
    : <T extends KeyedObject>(obj: Readonly<T>, path: string, val: any) => T
    = (obj, path, val) => 
        setRecursive(obj, path.split('.').filter(p => !!p), val)

const setRecursive
    : <T extends KeyedObject>(obj: Readonly<T>, path: Readonly<Array<string>>, val: any) => T
    = (obj, path, val) =>
        path.length > 1 
            ? {
                ...obj,
                [path[0]]: setRecursive(obj[path[0]], path.slice(1), val)
            }
            : {
                ...obj,
                [path[0]]: val
            }
        
export const mergeKeys
    : <U extends KeyedObject, V extends KeyedObject>(keys: Readonly<Array<string>>, a: U, b: V) => KeyedObject
    = (keys, a, b) => {
        let result = { ...a };

        keys.forEach(k => 
            result[k] = (b[k] != null ? b[k] : a[k]))
        
        return result;
    }
