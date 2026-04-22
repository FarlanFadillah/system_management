import * as bphtbRepo from "./bphtb.repository.mjs";
import db from "../../dbs/db.mjs";

/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function validateBPHTB(case_id, data, trx) {
    try {
        const exists = await bphtbRepo.isExists({ case_id }, trx);
        if (exists) {
            await bphtbRepo.updateWhere({ case_id }, data, trx);
        } else {
            const { prd_id, ah_id, client_id } = data;
            await bphtbRepo.create({ case_id, prd_id, ah_id, client_id }, trx);
        }
    } catch (error) {}
}

/**
 *
 * @param {Number} case_id
 * @param {Number} prd_id
 * @param {Number} ah_id
 * @param {Number} client_id
 */
export async function createBPHTB(case_id, prd_id, ah_id, client_id) {
    try {
        await db.transaction(async (trx) => {
            await bphtbRepo.create({ case_id, prd_id, ah_id, client_id }, trx);
        });
    } catch (error) {
        throw error;
    }
}

export async function updateBPHTB(case_id, data) {
    try {
        await db.transaction(async (trx) => {
            await bphtbRepo.updateWhere({ case_id }, data, trx);
        });
    } catch (error) {}
}
