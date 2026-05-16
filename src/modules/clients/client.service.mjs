import { ExpressError } from "../../shared/utils/custom.error.mjs";
import * as clientRepo from "./client.repository.mjs";
import * as mainRepo from "../../shared/repositories/main.repository.mjs";
import * as jsonHelper from "../../shared/helper/json.helper.mjs";
import * as cache from "../../shared/utils/cache.mjs";
import db from "../../dbs/db.mjs";
import * as fileUtils from "../../shared/utils/file.js";

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
 * @param {Number} cl_id
 * @param {String} type
 * @param {String} path
 */
export async function saveClientDocument(cl_id, type, path) {
    try {
        await db.transaction(async (trx) => {
            const exists = await mainRepo.isExists("clients", cl_id, trx);
            if (!exists)
                throw new ExpressError(
                    `Client with id ${cl_id} does not extist`,
                );
            await clientRepo.saveDocs({ cl_id, type, path }, trx);
        });
    } catch (error) {
        await fileUtils.deleteFile(path);
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
        const clients = await clientRepo.getByIdWithDetails(Number(id));
        if (!clients) throw new ExpressError("Client Not Found", 404);
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
            ["nik", "fullname"],
            keyword,
            limit,
            offset,
        );
        // const clients = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            "clients/search",
            currentpage,
            limit,
            count,
            [`keyword=${keyword}`],
        );

        return { clients: data, _metadata };
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

        // const alas_hak = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            `clients/${client_id}/alas-hak`,
            currentpage,
            limit,
            count,
        );

        return { alas_hak: data, _metadata };
    } catch (error) {
        throw error;
    }
}
