import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as alasHakRepo from "./alas_hak.repository.mjs";
import * as addressRepo from "../address/address.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";

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
 * @param {Number} id
 * @returns
 */
export async function getAlasHak(id) {
    try {
        const alas_hak = await alasHakRepo.get(id);
        const {
            cl_first_name,
            cl_id,
            cl_last_name,
            kelurahan,
            kecamatan,
            kabupaten,
            provinsi,
            ...data
        } = alas_hak[0];

        return {
            ...data,
            address: {
                kelurahan,
                kecamatan,
                kabupaten,
                provinsi,
            },
            owners: alas_hak.map((row) => ({
                id: row.cl_id,
                first_name: row.cl_first_name,
                last_name: row.cl_last_name,
            })),
        };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} currentpage
 * @returns
 */
export async function getAllAlasHak(limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await alasHakRepo.getAll(limit, offset);
        const alas_hak = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            "alas-hak",
            currentpage,
            limit,
            count,
        );

        return { alas_hak, _metadata };
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
export async function searchAlasHak(keyword, limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await alasHakRepo.search(
            ["no_alas_hak"],
            keyword,
            limit,
            offset,
        );

        const alas_hak = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            "alas-hak/search",
            currentpage,
            limit,
            count,
            [`keyword=${keyword}`],
        );

        return { alas_hak, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {String} level
 * @param {String} keyword
 * @param {Number} limit
 * @param {Number} currentpage
 * @returns
 */
export async function searchByAddressCode(level, keyword, limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        let address_code = await addressRepo.get(level, keyword);
        if (!address_code) throw new ExpressError("Address not found");

        const { data, count } = await alasHakRepo.getByAddressCode(
            address_code.id,
            limit,
            offset,
        );

        const alas_hak = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            "alas-hak/search",
            currentpage,
            limit,
            count,
            [`keyword=${keyword}`, `level=${level}`],
        );

        return { alas_hak, _metadata };
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

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getOwners(id) {
    try {
        return await alasHakRepo.getOwners(id);
    } catch (error) {
        throw error;
    }
}
