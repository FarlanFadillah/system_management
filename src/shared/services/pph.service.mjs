import knex from "knex";
import * as pphRepo from "../repositories/pph.repository.mjs";
import { ExpressError } from "../utils/custom.error.mjs";
import { caseService } from "../../modules/cases/index.js";
/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @param {knex.Knex.Transaction} trx
 */
export async function validatePPH(case_id, data, trx) {
    const pph = await pphRepo.getPPHByCaseId(case_id, trx);
    if (!pph) {
        await pphRepo.createPPH({ case_id: case_id }, trx);
    }

    await pphRepo.updatePPHWhere({ case_id: case_id }, data, trx);
}

/**
 *
 * @param {Number} case_id
 * @param {Object} invalidation
 * @param {knex.Knex.Transaction} trx
 */
export async function invalidatePPH(case_id, invalidation, trx) {
    if (invalidation.strategy === "delete") {
        await pphRepo.deletePPHWhere({ case_id: case_id }, trx);
    } else if (invalidation.strategy === "nullify") {
        const model = invalidation.fields.reduce((acc, cur) => {
            acc[cur] = null;
            return acc;
        }, {});
        await pphRepo.updatePPHWhere({ case_id: case_id }, model, trx);
    }
}
