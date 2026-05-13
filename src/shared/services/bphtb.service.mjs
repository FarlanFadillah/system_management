import * as bphtbRepo from "../repositories/bphtb.repository.mjs";
import db from "../../dbs/db.mjs";
import TABLE from "../../configs/table.config.mjs";
import ROLES from "../../configs/roles.config.mjs";
import { caseService } from "../../modules/cases/index.js";

/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function validateBPHTB(case_id, data, trx) {
    try {
        const _case = await caseService.getCaseData(case_id, trx);
        const exists = await bphtbRepo.isExists({ case_id }, trx);
        if (!exists) {
            const id = await bphtbRepo.create(
                {
                    case_id,
                    prd_id: _case.prd_id,
                    ah_id: _case.ah_id,
                },
                trx,
            );
            const clients = await bphtbRepo.getClientIdsFromCase(case_id);
            await bphtbRepo.linkBPHTBClients(id, clients, trx);
        }

        await bphtbRepo.updateWhere({ case_id }, data, trx);
    } catch (error) {
        throw error;
    }
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
