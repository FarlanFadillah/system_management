import createDebug from "debug";
const debug = createDebug("app:middleware:cache");
import * as cache from "../utils/cache.mjs";

/**
 *
 * @param {String} resource
 */
// export function generateCacheKey(resource) {
//     return (req, res, next) => {
//         debug(`starting generating cache key name`);
//         let cacheKeyName = `cache:${resource}:${req.method}`;
//         for (const key of Object.keys(req?.matchedData || {}).sort()) {
//             cacheKeyName += `:${key}:${req.matchedData[key]}`;
//         }
//         for (const key of Object.keys(req?.pagination || {}).sort()) {
//             cacheKeyName += `:${key}:${req.pagination[key]}`;
//         }
//         req.cache = {
//             key: cacheKeyName,
//             resource: resource,
//         };
//         debug(`finished generated cache key name ${cacheKeyName}`);

//         next();
//     };
// }

// /**
//  *
//  * @param {import("express").Request} req
//  * @param {import("express").Response} res
//  * @param {import("express").NextFunction} next
//  */
// export function cacheMiddleware(req, res, next) {
//     if (!req.cache || !req.cache.key) {
//         debug("No cache key found, skipping cache");
//         return next();
//     }

//     const key = req.cache.key;
//     const data = cache.get(key);
//     if (data) {
//         debug(`CACHE HIT : ${key}`);
//         return res.status(200).json(data);
//     }

//     debug("CACHE MISS");

//     const resJson = res.json;
//     res.json = function (data) {
//         cache.set(key, data, Number(process.env.CACHE_TTL) || 60);
//         return resJson.call(this, data);
//     };
//     // mark as wrapped
//     next();
// }

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
            cache.set(key, data);
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
