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
        return id;
    } catch (error) {
        console.log(error.code);
        if (error.code === "SQLITE_CONSTRAINT")
            throw new ExpressError("This data already exists", 409);
        else if (error.code === "ER_DUP_ENTRY") {
            throw new ExpressError(
                "An entry with the provided data already exists",
                409,
            );
        } else if (error.code === "ER_NO_REFERENCED_ROW_2") {
            throw new ExpressError("a foreign key contstrain fails", 409);
        }
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

export async function removeWhere(table, model) {
    try {
        await db(table).where(model).delete();
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
        if (error.code === "SQLITE_CONSTRAINT")
            throw new ExpressError(error.sqlMessage, 409);
        else if (error.code === "ER_DUP_ENTRY") {
            throw new ExpressError(error.sqlMessage, 409);
        }
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} table
 * @param {Object} model
 * @param {Object} data
 */
export async function updateWhere(table, model, data) {
    try {
        await db(table).where(model).update(data);
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

/**
 *
 * @param {String} table
 * @param {Object} model
 * @returns
 */
export async function isRowExists(table, model) {
    try {
        const { count } = await db(table)
            .where(model)
            .count("* as count")
            .first();
        return count > 0;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function get(table, id) {
    try {
        return await db(table).where({ id }).first();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getBy(table, column_name, value) {
    try {
        return await db(table).where(column_name, value).first();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getWhereLike(table, column, value) {
    try {
        return await db(table).where(column, "like", `%${value}%`);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
