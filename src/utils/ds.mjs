/**
 * @param {Array} arr
 * @param {String} key
 *
 */
export function mapingArrayObject(arr, key) {
    return arr.map((val) => {
        return (val = val[key]);
    });
}

/**
 *
 * @param {Array} arr
 * @param {String} key
 * @param {String | Number} value
 * @returns
 */
export function getElement(arr, key, value) {
    return arr.filter((val) => {
        if (val[key] === value) return val;
        return null;
    })[0];
}

/**
 *
 * @param {Object} obj
 */
export function jsonToArray(obj) {
    const result = [];

    for (const key of Object.keys(obj)) {
        result.push({ [key]: obj[key] });
    }

    return result;
}
