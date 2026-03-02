import { validateAddressCode } from "../../helper/regex.helper.mjs";
import { globalErrorHandler } from "../../middlewares/error.middleware.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as alasHakRepo from "./alas_hak.repository.mjs";
import * as addressRepo from "../address/address.repository.mjs";
import * as clientRepo from "../clients/client.repository.mjs";
import { mapingArrayObject } from "../../utils/DS.manipulation.mjs";

/**
 *
 * @param {Object} model
 */
export async function addAlasHak(model) {
    try {
        return await mainRepo.create("alas_hak", model);
    } catch (error) {
        throw error;
    }
}

export async function getAlasHak(id) {
    try {
        return await mainRepo.get("alas_hak", id);
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
export async function getAllAlasHak(limit, offset) {
    try {
        return await alasHakRepo.getAll(limit, offset);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 */
export async function removeAlasHak(id) {
    try {
        await mainRepo.remove("alas_hak", id);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Object} model
 */
export async function updateAlasHak(id, model) {
    try {
        await mainRepo.update("alas_hak", id, model);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {String} keyword
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function searchAlasHak(keyword, limit, offset) {
    try {
        return await alasHakRepo.search(
            ["no_alas_hak"],
            keyword,
            limit,
            offset,
        );
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {"provinsi" | "kabupaten" | "kecamatan" | "kelurahan"} level
 * @param {String} address
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function searchAlasHakByAddress(level, address, limit, offset) {
    try {
        let address_code = await addressRepo.get(level, address);
        console.log(address_code);
        if (!address_code) throw new ExpressError("Address not found");
        return await alasHakRepo.searchMultipleKeywords(
            "address_code",
            address_code.id,
            limit,
            offset,
        );
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} alas_hak_id
 * @param {Array} clients_id
 */
export async function addAlasHakOwner(alas_hak_id, clients_id) {
    let messages = [];
    try {
        if (!(await mainRepo.isExists("alas_hak", alas_hak_id)))
            throw new ExpressError("Alas Hak not found");
        for (let val of [...clients_id]) {
            const exists = await mainRepo.isExists("clients", val);
            if (exists) {
                await mainRepo.create("alas_hak_clients", {
                    alas_hak_id,
                    client_id: val,
                });
            } else {
                messages.push(`Clients with id ${val} does not exists`);
            }
        }
        return messages;
    } catch (error) {
        throw error;
    }
}

export async function getOwners(id) {
    try {
        return await alasHakRepo.getOwners(id);
    } catch (error) {
        throw error;
    }
}
