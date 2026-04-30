import db from "../../dbs/db.mjs";
import configs from "../../configs/index.mjs";

/**
 *
 * @param {Number} ah_id
 * @param {Array} new_clients
 * @param {import("knex").Knex.Transaction} trx
 */
export async function setNewOwner(ah_id, new_clients, trx) {
    try {
        const data = new_clients.reduce((acc, cur) => {
            acc.push({
                client_id: cur,
                alas_hak_id: ah_id,
                start_date: new Date(),
            });
            return acc;
        }, []);
        await trx(configs.TABLE.$ALASHAK.CLIENTS).insert(data);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {import("knex").Knex.Transaction} trx
 */
export async function releaseAllOwnership(case_id, ah_id, trx) {
    try {
        await saveOwnershipHistories(case_id, ah_id, null, trx);
        await trx(configs.TABLE.$ALASHAK.CLIENTS)
            .where({ alas_hak_id: ah_id })
            .delete();
    } catch (error) {
        throw error;
    }
}

/**
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {Array} old_clients
 * @param {import("knex").Knex.Transaction} trx
 *
 */
export async function releaseOwnership(case_id, ah_id, clients, trx) {
    try {
        await saveOwnershipHistories(case_id, ah_id, clients, trx);
        await trx(configs.TABLE.$ALASHAK.CLIENTS)
            .where(function () {
                clients.forEach((val, index) => {
                    if (index === 0)
                        this.where({ alas_hak_id: ah_id, client_id: val });
                    else this.orWhere({ alas_hak_id: ah_id, client_id: val });
                });
            })
            .delete();
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} case_id
 * @param {Number} ah_id
 * @param {Array} clients
 * @param {import("knex").Knex.Transaction}
 */
async function saveOwnershipHistories(case_id, ah_id, clients, trx) {
    const old_clients = clients
        ? clients
        : await trx(configs.TABLE.$ALASHAK.CLIENTS)
              .where({ alas_hak_id: ah_id })
              .select("client_id", "start_date");

    const prd = await trx(`${configs.TABLE.$CASES.PRD} as prd`)
        .leftJoin(`${configs.TABLE.CASES} as cs`, "cs.prd_id", "prd.id")
        .where("cs.id", case_id)
        .select("prd.*")
        .first();

    const data = old_clients.reduce((acc, cur) => {
        acc.push({
            client_id: cur.client_id,
            ah_id: ah_id,
            case_id: case_id,
            start_date: cur.start_date ? cur.start_date : null,
            acq_type: prd.name,
        });
        return acc;
    }, []);
    // insert ownership history
    await trx(configs.TABLE.OWNERSHIPS).insert(data);

    return data.reduce((acc, cur) => {
        acc.push(cur.client_id);
        return acc;
    }, []);
}
