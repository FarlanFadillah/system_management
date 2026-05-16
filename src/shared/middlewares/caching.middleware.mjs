import createDebug from "debug";
const debug = createDebug("app:middleware:cache");
import * as cache from "../utils/cache.mjs";

/**
 *
 * @param {Function} keyBuilder
 * @returns
 */
export function cachingMiddleware(keyBuilder) {
    return (req, res, next) => {
        const key = keyBuilder(req);
        const data = cache.get(key);
        if (data) {
            debug(`CACHE HIT : ${key}`);
            return res.status(200).json(data);
        }

        debug("CACHE MISS");

        const resJson = res.json;
        res.json = function (data) {
            cache.set(key, data, res.statusCode);
            return resJson.call(this, data);
        };

        next();
    };
}

// export function clearSingle(resource) {
//     return (req, res, next) => {
//         res.on("finish", () => {
//             if (res.statusCode <= 400) {
//                 const { id } = req.matchedData;
//                 const keys = cache.keys();
//                 for (const key of keys) {
//                     if (
//                         key.includes(`:${resource}:`) ||
//                         key.includes(`:id:${id}`)
//                     )
//                         cache.del(key);
//                 }
//             }
//         });
//         next();
//     };
// }

// export function clearList(resource) {
//     return (req, res, next) => {
//         if (res.statusCode < 400) {
//             res.on("finish", () => {
//                 const keys = cache.keys();
//                 for (const key of keys) {
//                     if (key.includes(`:${resource}:list:`)) cache.del(key);
//                 }
//             });
//         }
//         next();
//     };
// }

// export function clearCompletely(resource) {
//     return (req, res, next) => {
//         if (res.statusCode < 400) {
//             res.on("finish", () => {
//                 const keys = cache.keys();
//                 for (const key of keys) {
//                     if (key.includes(`:${resource}:`)) cache.del(key);
//                 }
//             });
//         }
//         next();
//     };
// }
