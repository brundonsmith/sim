
export const given
    : <T,R>(input: T|null|undefined, func: (val: T) => R) => R|null|undefined
    = (input, func) =>
        input != null ? func(input) : input

export const having 
    : <T,R>(input: T, func: (val: T) => R) => R
    = (input, func) => 
        func(input)

export const trace
    : <T,R>(func: (...args: Array<any>) => R) => ((...args: Array<any>) => R)
    = (func) => (...args: Array<any>) => {
        let res = func(...args);
        console.log({ args, res })
        return res;
    }

export const capture
    : (str: string, exp: RegExp) => Array<string>
    = (str, exp) => {
        let res: Array<string> = [];

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

type Transformer<T> = (val: T, ...otherArgs: Array<any>) => T

export const pipe
    : <T>(funcs: Array<Transformer<T>>) => Transformer<T>
    = (funcs) => (val, ...otherArgs) => {
        let current = val;

        funcs.forEach(f => current = f(current, ...otherArgs))

        return current;
    }


export const clamp
    : <T>(x: T, min: T, max: T) => T
    = (x, min, max) => x > max ? max : (x < min ? min : x)

export const merge
    : <T,U,R>(func: (el1: T, el2: U) => R) => (arr1: Readonly<Array<T>>, arr2: Readonly<Array<U>>) => Array<R>
    = (func) => (arr1, arr2) => {
        let newArr = new Array(Math.max(arr1.length, arr2.length));

        for(let i = 0; i < newArr.length; i++) {
            newArr[i] = func(arr1[i], arr2[i]);
        }

        return newArr;
    }
