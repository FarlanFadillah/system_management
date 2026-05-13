import db from "../../dbs/db.mjs";
import TABLE from "../../configs/table.config.mjs";

/**
 *
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function createAkta(data, trx) {
    const conn = trx || db;
    await conn(TABLE.AKTAPPAT).insert(data);
}

/**
 * @param {String} year
 * @param {import("knex").Knex.Transaction} trx
 */
export async function getLastNumber(year, trx) {
    const conn = trx || db;

    const { last_number } = await conn(TABLE.AKTAPPAT)
        .max("number as last_number")
        .where("year", "=", year)
        .first();
    return last_number;
}
