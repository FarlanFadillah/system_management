import db from "../dbs/db.mjs";
import { ExpressError } from "./custom.error.mjs";

/**
 *
 * @param {String} table
 * @param {Object} model
 */
export async function create(table, model) {
    try {
        await db(table).insert(model);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} table
 * @param {Number} id
 */
export async function remove(table, id) {
    try {
        await db(table).where({ id: id }).delete();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} table
 * @param {Number} id
 * @param {Object} model
 */
export async function update(table, id, model) {
    try {
        await db(table)
            .update({
                ...model,
                updated_at: db.fn.now(),
            })
            .where({ id: id });
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
