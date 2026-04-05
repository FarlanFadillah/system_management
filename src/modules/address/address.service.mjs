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

export async function getAllProvinsi() {
    try {
        return await addressRepo.getAllProvinsi();
    } catch (error) {
        throw error;
    }
}

export async function getAllKabupaten(id_provinsi) {
    try {
        return await addressRepo.getAllKabupaten(id_provinsi);
    } catch (error) {
        throw error;
    }
}

export async function getAllKecamatan(id_kabupaten) {
    try {
        return await addressRepo.getAllKecamatan(id_kabupaten);
    } catch (error) {
        throw error;
    }
}

export async function getAllKelurahan(id_kecamatan) {
    try {
        return await addressRepo.getAllKelurahan(id_kecamatan);
    } catch (error) {
        throw error;
    }
}
