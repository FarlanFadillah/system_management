import * as mainRepo from "../../utils/main.repository.mjs";

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
