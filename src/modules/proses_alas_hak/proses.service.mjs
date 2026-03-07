import * as mainRepo from "../../utils/main.repository.mjs";
import * as prosesRepo from "./proses.repository.mjs";
export async function create(data) {
    try {
        return await mainRepo.create("proses_alas_hak", data);
    } catch (error) {
        throw error;
    }
}

export async function remove(id) {
    try {
        await mainRepo.remove("proses_alas_hak", id);
    } catch (error) {
        throw error;
    }
}

export async function get(id) {
    try {
        return await mainRepo.getBy("proses_alas_hak", "id", id);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {String} no_surat
 * @returns
 */
export async function getByNoSurat(value) {
    try {
        value = value.replaceAll("_", "/");
        console.log(value);
        return await mainRepo.getBy("proses_alas_hak", "no_surat", value);
    } catch (error) {
        throw error;
    }
}

export async function getAll(limit, offset) {
    try {
        return await prosesRepo.getAll(limit, offset);
    } catch (error) {
        throw error;
    }
}

export async function getByDate(limit, offset, from, to) {
    try {
        return await prosesRepo.getByDate(limit, offset, from, to);
    } catch (error) {
        throw error;
    }
}

export async function update(id, data) {
    try {
        await mainRepo.update("proses_alas_hak", id, data);
    } catch (error) {
        throw error;
    }
}
