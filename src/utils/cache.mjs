import NodeCache from "node-cache";
import CreateDebug from "debug";
const debug = CreateDebug("app:utils:cache");

const cache = new NodeCache({
    deleteOnExpire: true,
    stdTTL: 60 * 10, // 10 minutes
    checkperiod: 60 * 5, // check period every 5 minutes
    useClones: false,
});

cache.on("expired", (key, value) => {
    debug(`Cache ${key} is expired`);
});

cache.on("del", (key, value) => {
    debug(`Cache ${key} is deleted`);
});

cache.on("set", (key, value) => {
    debug(`Cache ${key} is set`);
});

export function set(key, value) {
    cache.set(key, value);
}

export function get(key) {
    return cache.get(key);
}

/**
 *
 * @param {import("express".Response)} res
 * @param {String} str
 */
export function delByPattern(str) {
    for (const key of cache.keys()) {
        if (key.includes(str)) cache.del(key);
    }
}
