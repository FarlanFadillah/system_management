import db from "../../dbs/db.mjs";
import configs from "../../configs/index.mjs";

const { TABLE } = configs;

/**
 *
 * @param {Number} case_id
 * @param {String} action
 * @param {"info" | "warning" | "error"} level
 * @param {import("knex").Knex.Transaction} trx
 */
export async function insertLogs(case_id, action, level, trx) {
    const conn = trx || db;
    await conn(TABLE.$CASES.LOGS).insert({
        case_id,
        action,
        level,
        timestamp: new Date(),
    });
}
