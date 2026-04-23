import * as bphtbRepo from "./bphtb.repository.mjs";
import db from "../../dbs/db.mjs";
import TABLE from "../../configs/table.config.mjs";
import ROLES from "../../configs/roles.config.mjs";
/**
 *
 * @param {Number} case_id
 * @param {import("knex").Knex.Transaction} trx
 */
export async function validateBPHTB(case_id, trx) {
    try {
        const exists = await bphtbRepo.isExists({ case_id }, trx);
        const _case = await trx(TABLE.CASES).where({ id: case_id });
        if (exists) {
            await bphtbRepo.updateWhere({ case_id }, data, trx);
        } else {
            const clients = await trx(`${TABLE.CLIENTS} as cl`)
                .leftJoin(
                    `${TABLE.$CASES.CLIENTS} as cc`,
                    "cc.case_id",
                    _case.id,
                )
                .where("cl.id", "cc.client_id")
                .andWhere("cc.roles_id", ROLES.PENERIMA_HAK)
                .first();

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
