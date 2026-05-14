import * as mainRepo from "../../shared/repositories/main.repository.mjs";
import * as casesRepo from "./case.repository.mjs";
import * as casesHelper from "./case.helper.mjs";
import * as jsonHelper from "../../shared/helper/json.helper.mjs";
import { ExpressError } from "../../shared/utils/custom.error.mjs";
import * as cache from "../../shared/utils/cache.mjs";
import db from "../../dbs/db.mjs";
import * as dshelper from "../../shared/utils/ds.mjs";
import roles from "../../configs/roles.config.mjs";
import * as bphtbService from "../../shared/services/bphtb.service.mjs";
import * as pphService from "../../shared/services/pph.service.mjs";
import * as trxService from "../../shared/services/transaction.service.mjs";
import * as aktaService from "../../shared/services/akta.service.mjs";
import configs from "../../configs/index.mjs";

// step handlers
const handlers = {
    validate: {
        bphtb: bphtbService.validateBPHTB,
        alashak: casesHelper.validateAlasHak,
        clients: casesHelper.validateClients,
        pph: pphService.validatePPH,
        akta: aktaService.validateAkta,
    },
    invalidate: {
        alashak: casesHelper.invalidateAlasHak,
        clients: casesHelper.invalidateClients,
        pph: pphService.invalidatePPH,
        bphtb: bphtbService.invalidateBPHB,
        akta: aktaService.invalidateAkta,
    },
};

/**
 *
 * @param {Object} data
 * @returns
 */
export async function create(data) {
    try {
        const id = await db.transaction(async (trx) => {
            // validate products
            const prd_exists = await mainRepo.isExists(
                configs.TABLE.$CASES.PRD,
                data.prd_id,
            );
            if (!prd_exists)
                throw new ExpressError("Products not available", 404);

            // insert case data
            const case_id = await casesRepo.createCase(data, trx);
            await casesRepo.lockForUpdate(case_id, trx);

            // insert step from workflow templates
            const step_id = await casesRepo.createSteps(
                case_id,
                data.prd_id,
                trx,
            );

            // update status current step
            await casesRepo.updateCase(
                case_id,
                { current_step: step_id, status: "IN PROGRESS" },
                trx,
            );
            return case_id;
        });

        // DTO.clients.forEach((val) => {
        //     cache.delByPattern(`:clients:id:${val?.id}`);
        // });
        cache.delByPattern(":cases:list:");
        return id;
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function nextStep(id) {
    try {
        let finished = false;
        // TODO
        /**
         * 1. Get current step id
         * 2. validate current step (current step, )
         * 3. if the current step is valid proceed to the next step, return error if not
         * 4. check if the next step is exists
         * 5. update case current step
         */

        await db.transaction(async (trx) => {
            // Lock case for update and
            // get case by its id
            const [_case] = await casesRepo.lockForUpdate(id, trx);

            // validate case
            if (!_case) throw new ExpressError("Case not found", 404);
            else if (_case.status === "DONE")
                throw new ExpressError("Case already finished");

            // get current step
            const current_step = await casesRepo.getStep(
                _case.current_step,
                trx,
            );

            // check if current step is valid or don't have requirement
            if (
                !current_step.valid &&
                current_step.validation &&
                !current_step.can_skip
            )
                throw Error(
                    `Current step not finished yet [${current_step.name}]`,
                );

            finished = await casesHelper.proceedToNextStep(
                _case.id,
                _case.current_step,
                _case.ah_id,
                trx,
            );

            // proceed transaction if case is finished
            // and its product is a transaction
            const prd = await casesRepo.getProduct(_case.prd_id, trx);
            if (finished && prd.is_transaction) {
                await trxService.transaction(
                    _case.id,
                    _case.ah_id,
                    prd.type_transaction,
                    trx,
                );
            }
        });

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(`:cases:list:`);
        return finished;
    } catch (error) {
        throw error;
    }
}

export async function prevStep(id) {
    try {
        await db.transaction(async (trx) => {
            const [_case] = await casesRepo.lockForUpdate(id, trx);

            // validate case
            if (!_case) throw new ExpressError("Case not found", 404);
            else if (_case.status === "DONE")
                throw new ExpressError("Case already finished");

            const result = await casesHelper.invalidateCurrentStep(
                _case.current_step,
                trx,
            );
            if (result) {
                const func = handlers.invalidate[result.handler];
                if (func) await func(id, result.invalidation, trx);
            }

            // set the current step to the previous step if exists
            await casesHelper.proceedToPreviousStep(
                _case.id,
                _case.current_step,
                trx,
            );
        });

        cache.delByPattern(`:cases:list:`);
        cache.delByPattern(`:cases:id:${id}`);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function validateStep(case_id, data) {
    const { dto, handler } = await casesHelper.validateStepData(case_id, data);
    await db.transaction(async (trx) => {
        await handlers.validate[handler](case_id, dto, trx);
        await casesRepo.updateCurrentStep(
            case_id,
            {
                valid: true,
                completed_at: new Date(),
            },
            trx,
        );
    });
}

/**
 *
 * @param {Number} id
 * @param {Object} model
 */
export async function update(id, model) {
    try {
        await mainRepo.update("cases", id, model);

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 */
export async function remove(id) {
    try {
        await mainRepo.remove("cases", id);

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getCaseWithDetails(id) {
    try {
        const data = await casesRepo.getById(id);
        if (!data) throw new ExpressError("Data not found", 404);

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getCaseData(id, trx) {
    return await mainRepo.get(configs.TABLE.CASES, id, "", trx);
}
/**
 *
 * @param {Number} currentpage
 * @param {Number} limit
 * @returns
 */
export async function getAll(currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await casesRepo.getAll(limit, offset);
        const _metadata = jsonHelper.paginationMetadata(
            "cases",
            currentpage,
            limit,
            count,
        );

        return { data, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} currentpage
 * @param {Number} limit
 * @param {Object} filters
 * @returns
 */
export async function getFilteredCases(currentpage, limit, filters) {
    try {
        const offset = (currentpage - 1) * limit;

        if (filters.from) {
            filters.from = new Date(filters.from).toISOString();
        }

        if (filters.to) {
            const to = new Date(filters.to);
            to.setUTCHours(23, 59, 59);
            filters.to = to.toISOString();
        }

        const { data, count } = await casesRepo.getFilteredCases(
            limit,
            offset,
            filters,
        );

        const _metadata = jsonHelper.paginationMetadata(
            "cases/search",
            currentpage,
            limit,
            count,
            [
                filters.code ? `code=${filters.code}` : "",
                filters.from ? `from=${filters.from}` : "",
                filters.to ? `to=${filters.to}` : "",
            ],
        );

        return { data, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Array} clients_id
 * @param {Number} roles_id
 */
export async function addClientAndRoles(id, clients_id, roles_id) {
    try {
        const result = {
            proses_id: id,
            created: [],
            skipped: [],
            invalid: [],
        };
        for (const cl_id of clients_id) {
            if (!(await mainRepo.isExists("clients", cl_id))) {
                result.invalid.push({
                    client_id: cl_id,
                    reason: "CLIENT_NOT_FOUND",
                });
                continue;
            } else if (
                await mainRepo.isRowExists("case_clients", {
                    pah_id: id,
                    client_id: cl_id,
                })
            ) {
                result.skipped.push({
                    client_id: cl_id,
                    reason: "ENTRY_ALREADY_EXISTS",
                });
                continue;
            }
            await mainRepo.create("case_clients", {
                pah_id: id,
                client_id: cl_id,
                roles_id,
            });
            cache.delByPattern(`:clients:id:${cl_id}`);
            result.created.push({ client_id: cl_id, reason: "SUCCESS" });
        }

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
        return { result };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Number} client_id
 */
export async function removeClientAndRoles(id, client_id) {
    try {
        if (!(await mainRepo.isExists("cases", id))) {
            throw new ExpressError("Proses not found", 404);
        } else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found", 404);
        } else if (
            !(await mainRepo.isRowExists("case_clients", {
                pah_id: id,
                client_id,
            }))
        ) {
            throw new ExpressError("Proses - Client relations not found", 404);
        }

        await mainRepo.removeWhere("case_clients", {
            pah_id: id,
            client_id,
        });
        cache.delByPattern(`:clients:id:${client_id}`);
        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Number} client_id
 * @param {Number} roles_id
 */
export async function updateClientRoles(id, client_id, roles_id) {
    try {
        if (!(await mainRepo.isExists("cases", id))) {
            throw new ExpressError("Proses not found", 404);
        } else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found", 404);
        } else if (
            !(await mainRepo.isRowExists("case_clients", {
                pah_id: id,
                client_id,
            }))
        ) {
            throw new ExpressError("Proses - Client relations not found", 404);
        }

        await mainRepo.updateWhere(
            "case_clients",
            {
                pah_id: id,
                client_id,
            },
            { roles_id },
        );

        cache.delByPattern(`:clients:id:${client_id}`);
        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
    } catch (error) {
        throw error;
    }
}

export async function getRoles() {
    try {
        return await casesRepo.getRoles();
    } catch (error) {
        throw error;
    }
}
