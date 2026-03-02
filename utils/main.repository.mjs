import db from "../dbs/db.mjs";
import { ExpressError } from "./custom.error.mjs";

/**
 *
 * @param {String} table
 * @param {Object} model
 */
export async function create(table, model) {
    try {
        const [id] = await db(table).insert(model);
        console.log(id);
        return id;
    } catch (error) {
        console.log(error);
        if (error.code === "SQLITE_CONSTRAINT")
            throw new ExpressError("This data already exists");
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

/**
 *
 * @param {String} table
 * @param {Number} id
 * @returns
 */
export async function isExists(table, id) {
    try {
        const { count } = await db(table)
            .where({ id })
            .count("id as count")
            .first();
        return count > 0;
    } catch (error) {
        throw error;
    }
}

export async function get(table, id) {
    try {
        return await db(table).where({ id }).first();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
