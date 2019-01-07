
export const clone
    : <T>(obj: T) => T
    = (obj) => 
        JSON.parse(JSON.stringify(obj))

export const mapObject
    : <T extends {[key: string]: any}>(obj: T, func: (val: any) => any) => T
    = (obj, func) => {
        let newObj = clone(obj);
        Object.keys(obj).forEach(key => 
            newObj[key] = func(newObj[key])
        )
        return newObj;
    }

export const cond
    : <T,R>(condition: boolean, outcome1: () => T, outcome2: () => R) => T|R
    = (condition, outcome1, outcome2) =>
        condition 
            ? outcome1()
            : outcome2()

export const trace
    : <T,R>(func: (...args: Array<any>) => R) => ((...args: Array<any>) => R)
    = (func) => (...args: Array<any>) => {
        let res = func(...args);
        console.log({ args, res })
        return res;
    }

export const pipe
    : <T>(funcs: Array<(val: T, ...args: Array<any>) => T>, val: T, ...args: Array<any>) => T
    = (funcs, val, ...args) =>
        funcs.length === 0 
            ? val
            : pipe(funcs.slice(1), funcs[0](val, ...args), ...args)

export const having 
    : <T,R>(input: T, func: (val: T) => R) => R
    = (input, func) => 
        func(input)

export const partialAssign
    : (keys: Array<string>) => <T extends {[key: string]: any}>(...objs: Array<T>) => T
    = (keys) => (...objs) => {
        let focalObj = objs[0];

        objs.slice(1).forEach(obj =>
            keys.forEach(key =>
                focalObj[key] = obj[key]))

        return focalObj;
    }

export const capture
    : (str: string, exp: RegExp) => Array<string>
    = (str, exp) => {
        let res = [];

        let expClone = new RegExp(exp.source,`
            ${exp.global ? 'g' : ''}
            ${exp.ignoreCase ? 'i' : ''}
            ${exp.multiline ? 'm' : ''}
        `.trim());

        let match;
        while(match = expClone.exec(str)) {
            res.push(match[1]);
        }

        return res;
    }