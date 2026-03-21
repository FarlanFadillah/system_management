import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as aktaRepo from "./akta.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";
import * as aktaHelper from "./akta.helper.mjs";

export async function create(data) {
    try {
        const { produk_id, proses_id } = data;
        const proses = await mainRepo.get("proses_alas_hak", proses_id, [
            "produk_id",
        ]);
        console.log(proses);
        if (produk_id !== proses.produk_id)
            throw new ExpressError(
                "Produk Akta does not match with Produk Proses",
            );
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

export async function getByID(id) {
    try {
        const data = await aktaRepo.getByID(id);
        if (data.length <= 0)
            throw new ExpressError(`Akta with id ${id} not found`, 404);
        return aktaHelper.destructureData(data);
    } catch (error) {
        throw error;
    }
}

export async function getAll(currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        let { data, count } = await aktaRepo.getAll(limit, offset);
        const _metadata = jsonHelper.paginationMetadata(
            "akta-ppat",
            currentpage,
            limit,
            count,
        );
        return { data, _metadata };
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

export async function getByDate(currentpage, limit, from, to) {
    try {
        const offset = (currentpage - 1) * limit;
        let { data, count } = await aktaRepo.getByDate(limit, offset, from, to);
        const _metadata = jsonHelper.paginationMetadata(
            "akta-ppat/search",
            currentpage,
            limit,
            count,
            [`from=${from}`, `to=${to}`],
        );
        return { data, _metadata };
    } catch (error) {
        throw error;
    }
}
