import { UTCToGMT } from "../../helper/date.helper.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as clientRepo from "./client.repository.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";

export async function addClient(model) {
    try {
        return await mainRepo.create("clients", model);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} limit
 * @param {String} cursor
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
export async function getAllClientsLimitOffset(limit, offset) {
    try {
        return await clientRepo.getAllLimitOffset(limit, offset);
    } catch (error) {
        throw error;
    }
}

export async function getClient(id) {
    try {
        const client = await clientRepo.getById(Number(id));
        if (!client) return {};

        client.created_at = UTCToGMT(client.created_at);
        client.updated_at = UTCToGMT(client.updated_at);

        return client;
    } catch (error) {
        throw error;
    }
}

export async function searchClient(keyword, limit, offset) {
    try {
        return await clientRepo.search(
            ["nik", "first_name", "last_name"],
            keyword,
            limit,
            offset,
        );
    } catch (error) {
        throw error;
    }
}

export async function removeClient(id) {
    try {
        const user = await clientRepo.getById(id);
        if (!user) throw new ExpressError("User does not exists");
        await mainRepo.remove("clients", id);
    } catch (error) {
        throw error;
    }
}

export async function updateClientData(model, id) {
    try {
        await mainRepo.update("clients", id, model);
    } catch (error) {
        throw error;
    }
}

export async function getAlasHak(client_id) {
    try {
        return await clientRepo.getAlasHak(client_id);
    } catch (error) {
        throw error;
    }
}
