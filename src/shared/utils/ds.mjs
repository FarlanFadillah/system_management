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

/**
 *
 * @param {Object} data
 * @param {Array} keys
 */
export function pick(data, keys) {
    return keys.reduce((acc, cur) => {
        if (data[cur] && Object.prototype.hasOwnProperty.call(data, cur)) {
            acc[cur] = data[cur];
        } else {
            throw Error(`${cur} field does not exists`);
        }
        return acc;
    }, {});
}

/**
 * To check if an two array have match element (ignore duplicate element)
 * @param {Array} arr1 superset array
 * @param {Array} arr2 subset array
 * @returns {Boolean}
 */
export function matchElement(arr1, arr2) {
    return arr2.every((val) => arr1.includes(val));
}

/**
 * Get key from an object by its value
 * @param {Object} obj
 * @param {*} value
 */
export function getKeyByValue(obj, value) {
    return Object.keys(obj).find((k) => obj[k] === value);
}
