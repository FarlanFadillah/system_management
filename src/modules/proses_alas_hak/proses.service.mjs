import * as mainRepo from "../../utils/main.repository.mjs";
import * as prosesRepo from "./proses.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";

/**
 *
 * @param {Object} model
 * @returns
 */
export async function create(model) {
    try {
        return await mainRepo.create("proses_alas_hak", model);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Object} model
 */
export async function update(id, model) {
    try {
        await mainRepo.update("proses_alas_hak", id, model);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 */
export async function remove(id) {
    try {
        await mainRepo.remove("proses_alas_hak", id);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Array} clients_id
 * @param {Number} roles_id
 */
export async function addClientAndRoles(id, clients_id, roles_id) {
    try {
        const warnings = [];
        for (const cl_id of clients_id) {
            if (
                await mainRepo.isRowExists("proses_clients", {
                    pah_id: id,
                    client_id: cl_id,
                })
            ) {
                warnings.push({
                    message: `Proses client with client id ${cl_id} and proses id ${id} already exists.`,
                    type: "safe",
                });
                continue;
            } else if (!(await mainRepo.isExists("clients", cl_id))) {
                warnings.push(`Client with id ${cl_id} does not exists`);
                continue;
            }
            await mainRepo.create("proses_clients", {
                pah_id: id,
                client_id: cl_id,
                roles_id,
            });
        }

        return { warnings };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Array} clients_id
 */
export async function removeClientAndRoles(id, clients_id) {
    try {
        for (const cl_id of clients_id) {
            if (
                !mainRepo.isRowExists("proses_clients", {
                    pah_id: id,
                    client_id: cl_id,
                })
            )
                continue;

            await mainRepo.removeWhere("proses_clients", {
                pah_id: id,
                client_id: cl_id,
            });
        }
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Array} clients_id
 * @param {Number} roles_id
 */
export async function updateClientRoles(id, clients_id, roles_id) {
    try {
        for (const cl_id of clients_id) {
            if (
                !mainRepo.isRowExists("proses_clients", {
                    pah_id: id,
                    client_id: cl_id,
                })
            ) {
                continue;
            }

            await mainRepo.updateWhere(
                "proses_clients",
                {
                    pah_id: id,
                    client_id: cl_id,
                },
                { roles_id },
            );
        }
    } catch (error) {}
}

/**
 *
 * @param {Number} id
 * @returns
 */
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
        return await mainRepo.getBy("proses_alas_hak", "no_surat", value);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} currentpage
 * @param {Number} limit
 * @returns
 */
export async function getAll(currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await prosesRepo.getAll(limit, offset);
        const _metadata = jsonHelper.paginationMetadata(
            "proses",
            currentpage,
            limit,
            count,
        );

        return { data, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} from
 * @param {String} to
 * @returns
 */
export async function getByDate(from, to, currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await prosesRepo.getByDate(
            limit,
            offset,
            from,
            to,
        );

        const _metadata = jsonHelper.paginationMetadata(
            "proses/search",
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

export async function getClientRoles(roles) {
    try {
        console.log(roles);
        return await mainRepo.getWhereLike("client_roles", "name", roles);
    } catch (error) {
        throw error;
    }
}
