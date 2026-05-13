import * as trxRepo from "../repositories/transaction.repository.mjs";
import * as cache from "../../shared/utils/cache.mjs";
import ROLES from "../../configs/roles.config.mjs";
import { caseRepo } from "../../modules/cases/index.js";
import * as dsa from "../../shared/utils/ds.mjs";

const handlers = {
    /**
     * @param {Number} case_id
     * @param {Number} ah_id
     * @param {import("knex").Knex.Transaction} trx
     */
    FULL_TRANSFER: async function transferLandOwnership(case_id, ah_id, trx) {
        await trxRepo.releaseAllOwnership(case_id, ah_id, trx);

        const new_owners = await caseRepo.getClientIdsFromCase(
            case_id,
            ROLES.PENERIMA_HAK,
            trx,
        );

        await trxRepo.setNewOwner(
            ah_id,
            dsa.mapingArrayObject(new_owners, "id"),
            trx,
        );
        cache.delByPattern(`:alas-hak:id:${ah_id}`);
        cache.delByPattern(`:alas-hak:list:`);
        cache.delByPattern(":clients:");
    },
    /**
     *
     * @param {Number} case_id
     * @param {Number} ah_id
     * @param {import("knex").Knex.Transaction} trx
     */
    PARTIAL_TRANSFER: async function releaseLandOwnership(case_id, ah_id, trx) {
        const grantor = await caseRepo.getClientIdsFromCase(
            case_id,
            ROLES.PEMBERI_HAK,
            trx,
        );
        const recipients = await caseRepo.getClientIdsFromCase(
            case_id,
            ROLES.PENERIMA_HAK,
            trx,
        );
        await trxRepo.releaseOwnership(
            ah_id,
            dsa.mapingArrayObject(grantor, "id"),
            trx,
        );
        await trxRepo.setNewOwner(
            ah_id,
            dsa.mapingArrayObject(recipients, "id"),
            trx,
        );
    },
};

/**
 *
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {String} types
 * @param {import("knex").Knex.Transaction} trx
 */
export async function transaction(case_id, ah_id, types, trx) {
    await handlers[types](case_id, ah_id, trx);
}
