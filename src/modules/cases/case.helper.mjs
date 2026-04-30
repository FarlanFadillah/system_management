import * as casesRepo from "./case.repository.mjs";
import * as trxService from "../../shared/transactions/transaction.service.mjs";
import configs from "../../configs/index.mjs";

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
                clients = await getClients(case_id, configs.ROLES.PENERIMA_HAK);
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
                clients = await getClients(case_id, configs.ROLES.PEMBERI_HAK);
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

async function getClients(case_id, role) {
    const clients = await casesRepo.getClientIdsFromCase(case_id, role);
    if (!clients)
        throw new Error(
            `There is no ${configs.ROLES.PENERIMA_HAK} is link to the case`,
        );

    return clients;
}
