export function deepCopy(o) {
    let copy = o;

    if (o && typeof o === 'object') {
        copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
        for (let k in o) {
            copy[k] = deepCopy(o[k]);
        }
    }

    return copy;
}
