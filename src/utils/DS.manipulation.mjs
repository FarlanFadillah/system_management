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
