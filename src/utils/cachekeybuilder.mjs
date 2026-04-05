import createDebug from "debug";
const debug = new createDebug("app:utils:keybuilder");

/**
 *
 * @param {import("express").Request} req
 * @param {String} resource
 * @returns {String}
 */
export function keyBuilder(resource) {
    return (req) => {
        let cacheKeyName = `cache:${resource}`;
        for (const key of Object.keys(req?.matchedData || {}).sort()) {
            cacheKeyName += `:${key}:${req.matchedData[key]}`;
        }
        debug(`Generate cache key : ${cacheKeyName}`);
        // for (const key of Object.keys(req?.pagination || {}).sort()) {
        //     cacheKeyName += `:${key}:${req.pagination[key]}`;
        // }
        return cacheKeyName;
    };
}
