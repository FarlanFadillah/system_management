import * as trxRepo from "./transaction.repository.mjs";
import * as cache from "../../utils/cache.mjs";
/**
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {Array} clients
 * @param {import("knex").Knex.Transaction} trx
 */
export async function transferLandOwnership(case_id, ah_id, clients, trx) {
    await trxRepo.releaseAllOwnership(case_id, ah_id, trx);
    await trxRepo.setNewOwner(ah_id, clients, trx);
    console.log("TRANSFER FINISHED");
    cache.delByPattern(`:alas-hak:id:${ah_id}`);
    cache.delByPattern(`:alas-hak:list:`);
    cache.delByPattern(":clients:");
}

/**
 *
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {Array} clients
 * @param {import("knex").Knex.Transaction} trx
 */
export async function releaseLandOwnership(case_id, ah_id, clients, trx) {
    await trxRepo.releaseOwnership(ah_id, clients, trx);
}
