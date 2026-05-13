import * as aktaRepo from "../repositories/akta.repository.mjs";
import * as cache from "../utils/cache.mjs";
import { caseService } from "../../modules/cases/index.js";
import { ExpressError } from "../utils/custom.error.mjs";

export async function validateAkta(case_id, data, trx) {
    // data contains (number, year, date)
    const _case = await caseService.getCaseData(case_id, trx);

    // validate the number and year
    // make sure its incremental from the latest number
    // and make sure its current year
    const { number, year } = data;
    await validateNumber(number, year);

    await aktaRepo.createAkta(
        {
            ...data,
            case_id: _case.id,
            prd_id: _case.prd_id,
            ah_id: _case.ah_id,
        },
        trx,
    );
}

/**
 *
 * @param {Number} number
 * @param {String} year
 * @param {import("knex").Knex.Transaction} trx
 */
async function validateNumber(number, year, trx) {
    const last_number = await aktaRepo.getLastNumber(year, trx);
    const current_year = new Date();
    if (current_year.getFullYear() !== Number(year)) {
        throw new ExpressError(
            `Invalid year set to current year ${current_year.getFullYear()}`,
        );
    } else if (number - last_number !== 1) {
        throw new ExpressError(
            `Invalid number, the last number is ${last_number}`,
        );
    }
}
