import { validateAddressCode } from "../../helper/regex.helper.mjs";
import { globalErrorHandler } from "../../middlewares/error.middleware.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as alasHakRepo from "./alas_hak.repository.mjs";
import * as addressRepo from "../address/address.repository.mjs";
import { mapingArrayObject } from "../../utils/DS.manipulation.mjs";

export async function addAlasHak(model) {
    try {
        await mainRepo.create("alas_hak", model);
    } catch (error) {
        throw error;
    }
}

export async function removeAlasHak(id) {
    try {
        await mainRepo.remove("alas_hak", id);
    } catch (error) {
        throw error;
    }
}

export async function updateAlasHak(id, model) {
    try {
        await mainRepo.update("alas_hak", id, model);
    } catch (error) {
        throw error;
    }
}

export async function searchAlasHak(keyword, currentpage, limit) {
    try {
        return await alasHakRepo.search(
            ["no_alas_hak"],
            keyword,
            Number(currentpage),
            Number(limit),
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
 * @param {Number} limit
 * @returns
 */
export async function searchAlasHakByAddress(
    level,
    address,
    currentpage,
    limit,
) {
    try {
        let address_code = await addressRepo.get(level, address);
        address_code = mapingArrayObject(address_code, "id");
        console.log(address_code);
        if (address_code.length <= 0)
            throw new ExpressError("Address not found");
        return await alasHakRepo.searchMultipleKeywords(
            "address_code",
            address_code,
            Number(currentpage),
            Number(limit),
        );
    } catch (error) {
        throw error;
    }
}

export async function getAddressHierarchy(address) {
    try {
    } catch (error) {
        throw error;
    }
}
