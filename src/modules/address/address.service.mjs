import * as addressRepo from "./address.repository.mjs";
import * as paginationConf from "../../configs/pagination.config.mjs";

export async function getKelurahan(name, limit, currentpage) {
    try {
        return await addressRepo.getKelurahan(
            name,
            limit,
            limit * (currentpage - 1),
        );
    } catch (error) {
        throw error;
    }
}

export async function getKecamatan(name) {
    try {
        return await addressRepo.getKecamatan(name);
    } catch (error) {
        throw error;
    }
}

export async function getKabupaten(name) {
    try {
        return await addressRepo.getKabupaten(name);
    } catch (error) {
        throw error;
    }
}

export async function getProvinsi(name) {
    try {
        return await addressRepo.getProvinsi(name);
    } catch (error) {
        throw error;
    }
}
