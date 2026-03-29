import NodeCache from "node-cache";
import createDebug from "debug";
const debug = createDebug("cache:middleware");
const cache = new NodeCache();

/**
 *
 * @param {String} resource
 */
export function generateCacheKey(resource) {
    return (req, res, next) => {
        debug(`starting generating cache key name`);
        let cacheKeyName = `${resource}:${req.method}`;
        for (const key of Object.keys(req?.params).sort()) {
            cacheKeyName += `:${key}:${req.params[key]}`;
        }
        for (const key of Object.keys(req?.query).sort()) {
            cacheKeyName += `:${key}:${req.query[key]}`;
        }
        req.cache = {
            key: cacheKeyName,
            resource: resource,
        };
        debug(`finished generated cache key name`);

        next();
    };
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function cacheMiddleware(req, res, next) {
    const key = req.cache.key;
    const data = cache.get(key);
    if (data) {
        debug("CACHE HIT");
        return res.status(200).json(data);
    }

    debug("CACHE MISS");
    const resJson = res.json;
    res.json = function (data) {
        cache.set(key, data, process.env.CACHE_TTL || 60);
        return resJson.call(this, data);
    };
    next();
}
