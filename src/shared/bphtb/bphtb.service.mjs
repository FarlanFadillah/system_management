import * as bphtbRepo from "./bphtb.repository.mjs";
import db from "../../dbs/db.mjs";
import TABLE from "../../configs/table.config.mjs";
import ROLES from "../../configs/roles.config.mjs";
/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function validateBPHTB(caseDTO, data, trx) {
    try {
        console.log(caseDTO);
        const exists = await bphtbRepo.isExists({ case_id: caseDTO.id }, trx);
        if (!exists) {
            const id = await bphtbRepo.create(
                {
                    case_id: caseDTO.id,
                    prd_id: caseDTO.prd_id,
                    ah_id: caseDTO.ah_id,
                },
                trx,
            );
            const clients = await bphtbRepo.getClientIdsFromCase(caseDTO.id);
            await bphtbRepo.linkBPHTBClients(id, clients, trx);
        }

        await bphtbRepo.updateWhere({ case_id: caseDTO.id }, data, trx);
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
