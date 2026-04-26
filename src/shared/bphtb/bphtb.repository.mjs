import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import TABLE from "../../configs/table.config.mjs";
import ROLES from "../../configs/roles.config.mjs";

/**
 *
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function create(data, trx) {
    try {
        const [id] = await trx(TABLE.BPHTB).insert(data);
        return id;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 * @param {Array} client_ids
 * @param {import("knex").Knex.Transaction} trx
 */
export async function linkBPHTBClients(id, client_ids, trx) {
    try {
        await trx(TABLE.$BPHTB.CLIENTS).insert(
            client_ids.reduce((acc, cur) => {
                if (cur["id"]) {
                    acc.push({
                        bphtb_id: id,
                        client_id: cur["id"],
                    });
                }
                return acc;
            }, []),
        );
    } catch (error) {
        throw error;
    }
}

/**
 * Get related client from case for bphtb
 * @param {Number} case_id
 * @returns {Object}
 */
export async function getClientIdsFromCase(case_id) {
    try {
        return await db(`${TABLE.CASES} as c`)
            .leftJoin(`${TABLE.$CASES.CLIENTS} as cc`, "cc.case_id", "c.id")
            .leftJoin(`${TABLE.CLIENTS} as cl`, "cl.id", "cc.client_id")
            .where("c.id", case_id)
            .andWhere("cc.roles_id", ROLES.PENERIMA_HAK)
            .select("cl.id");
    } catch (error) {
        throw error;
    }
}

/**
 * @param {Number} id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function update(id, data, trx) {
    try {
        await trx(TABLE.BPHTB).where({ id: id }).forUpdate();
        await trx(TABLE.BPHTB).where({ id: id }).update(data);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
/**
 *
 * @param {Object} model
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function updateWhere(model, data, trx) {
    try {
        await trx(TABLE.BPHTB).where(model).forUpdate();
        await trx(TABLE.BPHTB).where(model).update(data);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Object} model
 * @param {import("knex").Knex.Transaction} trx
 */
export async function isExists(model, trx) {
    try {
        const [{ count }] = await trx(TABLE.BPHTB)
            .where(model)
            .count("id as count");
        return count > 0;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
