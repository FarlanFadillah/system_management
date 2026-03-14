import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as aktaRepo from "./akta.repository.mjs";

export async function create(data) {
    try {
        return await mainRepo.create("akta_ppat", data);
    } catch (error) {
        throw error;
    }
}

export async function remove(id) {
    try {
        await mainRepo.remove("akta_ppat", id);
    } catch (error) {
        throw error;
    }
}

export async function update(id, data) {
    try {
        await mainRepo.update("akta_ppat", id, data);
    } catch (error) {
        throw error;
    }
}

export async function getAll(limit, offset) {
    try {
        let data = await aktaRepo.getAll(limit, offset);
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getAktaByNomorTahun(value) {
    try {
        const values = value.split("-");
        if (values.length < 2)
            throw new ExpressError(
                `Invalid value '${value}', the value must adhere to the specified pattern: [number-year].`,
            );
        let data = await aktaRepo.getAktaByNomorTahun(values[0], values[1]);
        if (!data) return [];

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getByDate(limit, offset, from, to) {
    try {
        let data = await aktaRepo.getByDate(limit, offset, from, to);
        return data;
    } catch (error) {
        throw error;
    }
}
