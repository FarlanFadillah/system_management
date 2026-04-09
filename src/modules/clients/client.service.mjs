import { ExpressError } from "../../utils/custom.error.mjs";
import * as clientRepo from "./client.repository.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";
import * as cache from "../../utils/cache.mjs";

/**
 *
 * @param {Object} model
 * @returns
 */
export async function addClient(model) {
    try {
        const data = await mainRepo.create("clients", model);

        cache.delByPattern(":clients:list:");
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 */
export async function removeClient(id) {
    try {
        const user = await clientRepo.getById(id);
        if (!user) throw new ExpressError("User does not exists");
        await mainRepo.remove("clients", id);

        cache.delByPattern(`clients:id:${id}`);
        cache.delByPattern("clients:list");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Object} model
 */
export async function updateClientData(id, model) {
    try {
        await mainRepo.update("clients", id, model);

        cache.delByPattern(`:clients:id:${id}`);
        cache.delByPattern(":clients:list:");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getClient(id) {
    try {
        const [[clients]] = await clientRepo.getByCLientId(Number(id));
        if (!clients || clients.length <= 0)
            throw new ExpressError("Client Not Found", 404);

        // const {
        //     alas_hak_id, //  to remove the data
        //     no_alas_hak, // to remove the data
        //     kelurahan,
        //     kecamatan,
        //     kabupaten,
        //     provinsi,
        //     ...clientData
        // } = clients[0];

        // return {
        //     ...clientData,
        //     address: {
        //         kelurahan,
        //         kecamatan,
        //         kabupaten,
        //         provinsi,
        //     },
        //     alas_hak: clients[0].alas_hak_id
        //         ? clients.map((row) => ({
        //               id: row.alas_hak_id,
        //               no_alas_hak: row.no_alas_hak,
        //           }))
        //         : [],
        // };
        return clients;
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} limit
 * @param {String} cursor
 * @param {String} order
 * @returns
 */
export async function getAllClients(limit, cursor, order = "asc") {
    try {
        return await clientRepo.getAll(limit, cursor | 0, "id", order);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function getAllClientsLimitOffset(limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await clientRepo.getAllLimitOffset(
            limit,
            offset,
        );

        const _metadata = jsonHelper.paginationMetadata(
            "clients",
            currentpage,
            limit,
            count,
        );

        // const clients = jsonHelper.destructureAddressesDetails(data);
        return { clients: data, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {String} keyword
 * @param {Number} limit
 * @param {Number} currentpage
 * @returns
 */
export async function searchClient(keyword, limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await clientRepo.search(
            ["nik", "first_name", "last_name"],
            keyword,
            limit,
            offset,
        );
        const clients = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            "clients/search",
            currentpage,
            limit,
            count,
            [`keyword=${keyword}`],
        );

        return { clients, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} client_id
 * @param {Number} limit
 * @param {Number} currentpage
 * @returns
 */
export async function getAlasHak(client_id, limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await clientRepo.getAlasHak(
            client_id,
            limit,
            offset,
        );

        const alas_hak = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            `clients/${client_id}/alas-hak`,
            currentpage,
            limit,
            count,
        );

        return { alas_hak, _metadata };
    } catch (error) {
        throw error;
    }
}
