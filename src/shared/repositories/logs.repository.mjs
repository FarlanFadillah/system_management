import db from "../../dbs/db.mjs";
import configs from "../../configs/index.mjs";

const { TABLE } = configs;

/**
 *
 * @param {Number} entity_id
 * @param {String} entity_type
 * @param {String} desc
 * @param {String} level
 * @param {import("knex").Knex.Transaction} trx
 */
export async function insertLogs(entity_id, entity_type, desc, level, trx) {
    const conn = trx || db;
    await conn(TABLE.$CASES.LOGS).insert({
        entity_id,
        entity_type,
        desc,
        level,
        timestamp: new Date(),
    });
}
