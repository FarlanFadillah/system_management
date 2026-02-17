/**
 *
 * @param {RegExp} reg
 * @param {String} str
 */
export function validateAddressCode(address_code) {
    const reg = /^\d{2}\.\d{2}\.\d{2}\.\d{4}/;
    return reg.test(address_code);
}
