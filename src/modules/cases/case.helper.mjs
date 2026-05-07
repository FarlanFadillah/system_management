import * as casesRepo from "./case.repository.mjs";
import * as trxService from "../../shared/transactions/transaction.service.mjs";
import configs from "../../configs/index.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import { config } from "dotenv";
import * as dsa from "../../utils/ds.mjs";
import Joi from "joi";

/**
 *
 * @param {String} type
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {import("knex").Knex.Transaction} trx
 */
export async function processTransaction(type, case_id, ah_id, trx) {
    try {
        let clients = [];
        switch (type) {
            case configs.TRX.FULL:
                clients = await getClientsByRoleId(
                    case_id,
                    configs.ROLES.PENERIMA_HAK,
                );
                await trxService.transferLandOwnership(
                    case_id,
                    ah_id,
                    clients.reduce((acc, cur) => {
                        acc.push(cur.id);
                        return acc;
                    }, []),
                    trx,
                );
                break;
            case configs.TRX.RELEASE:
                clients = await getClientsByRoleId(
                    case_id,
                    configs.ROLES.PEMBERI_HAK,
                );
                await trxService.releaseLandOwnership(
                    case_id,
                    ah_id,
                    clients.reduce((acc, cur) => {
                        acc.push(cur.id);
                        return acc;
                    }, []),
                    trx,
                );
                break;
            default:
                break;
        }
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @returns
 */
export async function validateStepData(case_id, data) {
    const _case = await casesRepo.getCaseById(case_id);
    // validate case
    if (!_case) throw new ExpressError("Case not found", 404);
    else if (_case.status === "DONE")
        throw new ExpressError("Case already finished");

    const { validation, valid } = await casesRepo.getStep(_case.current_step);
    const { handler = null, fields = null } = validation;
    if (!validation || !fields)
        throw new ExpressError(
            "Current step does not have requirement, you can continue",
        );
    else if (valid) {
        throw new ExpressError("Current step is valid, you can continue");
    }
    const schema = Joi.build(fields);
    const { value: dto, error } = schema.validate(data, {
        stripUnknown: true,
    });

    if (error) {
        console.log(error);
        throw new Error(error);
    }

    return { dto, handler };
}

/**
 *
 * @param {Number} case_id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function validateAlasHak(case_id, data, trx) {
    const { ah_id } = data;

    // validate alas hak
    const ah_exists = await mainRepo.isExists(
        configs.TABLE.ALASHAK,
        ah_id,
        trx,
    );
    if (!ah_exists) throw new ExpressError("Alas Hak not found", 404);

    // check if the Alas Hak case is still ongoing
    const ah_conflict = await mainRepo.isExistsWhere(
        configs.TABLE.CASES,
        {
            ah_id: ah_id,
            status: "IN PROGRESS",
        },
        trx,
    );
    if (ah_conflict) {
        throw new ExpressError(
            `Alas Hak masih terikat dengan case yang sedang berlangsung`,
            400,
        );
    }

    // check if alas hak is invalid
    const ah_invalid = await mainRepo.isExistsWhere(
        configs.TABLE.ALASHAK,
        {
            parent_id: ah_id,
        },
        trx,
    );
    if (ah_invalid) throw new ExpressError("Alas Hak already has been divided");

    await casesRepo.linkAlasHak(case_id, ah_id, trx);
}

export async function validateClients(case_id, data, trx) {
    const { clients } = data;
    const { ah_id, prd_id } = await casesRepo.getCaseById(case_id, trx);

    // get valid clients
    const valid_clients = await filterClients(prd_id, ah_id, clients);

    await casesRepo.linkClients(case_id, valid_clients, trx);
}

// local functions

/**
 * Validate and Filter clients
 * @param {Number} prd_id
 * @param {Number} ah_id
 * @param {Array} clients
 * @returns {Array}
 */
async function filterClients(prd_id, ah_id, clients) {
    // required configs
    const requiredRoles = configs.CASES[prd_id].roles.required;

    // check required roles
    const required = pickClients(prd_id, clients, "required");

    // get all required id that client sent
    const req_ids = dsa.mapingArrayObject(required, "id");
    const roles_ids = dsa.mapingArrayObject(required, "role_id");

    // check if all required is satisfied
    if (!dsa.matchElement(requiredRoles, roles_ids)) {
        const role_names = requiredRoles.map(
            (val) => dsa.getKeyByValue(configs.ROLES, val) + ":" + val,
        );

        throw new ExpressError(
            `The required role is not fulfilled. This case require (${role_names.join(", ")})`,
            400,
            "MISSING INPUT",
        );
    }

    // check optional roles
    const optional = pickClients(prd_id, clients, "optional");

    // Get owners
    const client_ids = await casesRepo.getAlasHakOwner(ah_id, ["id"]);

    // check if required client include the owner
    // transaction products only
    // it'll skip if not transaction
    const invalid_client = required.filter((val) =>
        dsa.mapingArrayObject(client_ids, "id").includes(val.id),
    );

    if (invalid_client.length > 0 && !!configs.CASES[prd_id].is_transaction) {
        const role = Object.keys(configs.ROLES).find(
            (k) => configs.ROLES[k] === invalid_client[0].role_id,
        );
        throw new ExpressError(`You can't set the owner as ${role}`);
    }

    // transform owner data for dbs insertion
    const owners = client_ids.reduce((acc, cur) => {
        if (cur.id)
            acc.push({
                id: cur.id,
                role_id: configs.CASES[prd_id].roles.auto,
            });
        return acc;
    }, []);

    // check if alas hak have an owner
    if (client_ids.length <= 0)
        throw ExpressError("Alas Hak does not have an owner", 404);

    // Return client and role data based on auto fields in product configuration.
    return [...owners, ...required];
}

// Local functions

/**
 *
 * @param {Number} case_id
 * @param {Number} role
 * @returns
 */
async function getClientsByRoleId(case_id, role) {
    const clients = await casesRepo.getClientIdsFromCase(case_id, role);
    if (!clients)
        throw new Error(
            `There is no ${configs.ROLES.PENERIMA_HAK} is link to the case`,
        );
    return clients;
}

async function getCaseClients(case_id) {
    const clients = await casesRepo.getcli;
}

/**
 * @param {Number} prd_id
 * @param {Array} clients
 * @param {"required" | "optional"} type
 * @return {Array}
 */
function pickClients(prd_id, clients, type) {
    if (!configs.CASES.hasOwnProperty.call(configs.CASES, prd_id))
        throw ExpressError("Product not found", 404);

    const required = clients.reduce((acc, cur) => {
        if (!cur.hasOwnProperty.call(cur, "role_id"))
            throw Error("role_id field not found");
        if (configs.CASES[prd_id].roles["auto"].includes(cur.role_id)) {
            const role = Object.keys(configs.ROLES).find(
                (k) => configs.ROLES[k] == cur.role_id,
            );
            throw new ExpressError(
                `${role} is automatically filled, do not submit the data`,
                400,
            );
        }

        if (configs.CASES[prd_id].roles[type].includes(cur.role_id))
            acc.push(cur);
        return acc;
    }, []);

    return required;
}
