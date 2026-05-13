import db from "../../dbs/db.mjs";
import knex from "knex";
import configs from "../../configs/index.mjs";
import { ExpressError } from "../utils/custom.error.mjs";

const { TABLE, ROLES } = configs;

/**
 *
 * @param {Object} data
 * @param {knex.Knex.Transaction} trx
 */
export async function createPPH(data, trx) {
    const conn = trx || db;

    const [id] = await conn(TABLE.PPH).insert(data);
    return id;
}

/**
 *
 * @param {Number} id
 * @param {Object} data
 * @param {knex.Knex.Transaction} trx
 */
export async function updatePPH(id, data, trx) {
    const conn = trx || db;

    if (trx) await conn(TABLE.PPH).where({ id: id }).forUpdate();
    await conn(TABLE.PPH).where({ id: id }).update(data);
}

/**
 *
 * @param {Object} model
 * @param {Object} data
 * @param {knex.Knex.Transaction} trx
 */
export async function updatePPHWhere(model, data, trx) {
    const conn = trx || db;

    if (trx) await conn(TABLE.PPH).where(model).forUpdate();
    await conn(TABLE.PPH).where(model).update(data);
}

/**
 *
 * @param {Number} case_id
 * @param {knex.Knex.Transaction} trx
 * @returns
 */
export async function getPPHByCaseId(case_id, trx) {
    const conn = trx || db;
    return await conn(TABLE.PPH).where({ case_id: case_id }).first();
}
