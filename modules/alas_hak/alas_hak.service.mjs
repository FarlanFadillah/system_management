import { validateAddressCode } from "../../helper/regex.helper.mjs";
import { globalErrorHandler } from "../../middlewares/error.middleware.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as alasHakRepo from "./alas_hak.repository.mjs";
import * as addressRepo from "../address/address.repository.mjs";
import * as clientRepo from "../client/client.repository.mjs";
import { mapingArrayObject } from "../../utils/DS.manipulation.mjs";
import * as paginationConf from "../../configs/pagination.config.mjs";

/**
 *
 * @param {Object} model
 */
export async function addAlasHak(model) {
    try {
        await mainRepo.create("alas_hak", model);
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
 * @param {Number} currentpage
 * @returns
 */
export async function searchAlasHak(keyword, currentpage) {
    try {
        return await alasHakRepo.search(
            ["no_alas_hak"],
            keyword,
            Number(currentpage),
            Number(paginationConf.default.limit),
        );
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {"provinsi" | "kabupaten" | "kecamatan" | "kelurahan"} level
 * @param {String} address
 * @param {Number} currentpage
 * @returns
 */
export async function searchAlasHakByAddress(level, address, currentpage) {
    try {
        let address_code = await addressRepo.get(level, address);
        if (!address_code) throw new ExpressError("Address not found");
        return await alasHakRepo.searchMultipleKeywords(
            "address_code",
            address_code.id,
            Number(currentpage),
            Number(paginationConf.default.limit),
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
