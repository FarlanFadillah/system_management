import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import TABLE from "../../configs/table.config.mjs";

/**
 *
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function create(data, trx) {
    try {
        await trx(TABLE.BPHTB).insert(data);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 * @param {Number} id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function update(id, data, trx) {
    try {
        await trx(TABLE.BPHTB).where({ id: id }).forUpdate();
        await trx(TABLE.BPHTB).where({ id: id }).update(data);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
/**
 *
 * @param {Object} model
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function updateWhere(model, data, trx) {
    try {
        await trx(TABLE.BPHTB).where(model).forUpdate();
        await trx(TABLE.BPHTB).where(model).update(data);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Object} model
 * @param {import("knex").Knex.Transaction} trx
 */
export async function isExists(model, trx) {
    try {
        const [{ count }] = await trx(TABLE.BPHTB)
            .where(model)
            .count("id as count");
        return count > 0;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
