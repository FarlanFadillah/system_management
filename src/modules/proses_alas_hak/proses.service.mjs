import * as mainRepo from "../../utils/main.repository.mjs";
import * as prosesRepo from "./proses.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

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
 * @returns
 */
export async function get(id) {
    try {
        const data = await prosesRepo.getBy("id", id);
        if (data.length <= 0) throw new ExpressError("Data not found");
        return destructureData(data);
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
export async function searchByDate(from, to, currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await prosesRepo.searchByDate(
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

/**
 *
 * @param {String} no_surat
 * @param {Number} currentpage
 * @param {Number} limit
 * @returns
 */
export async function searchByNoSurat(value, currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        value = value.replaceAll("_", "/");
        const { data, count } = await prosesRepo.searchBy(
            "no-surat",
            value,
            limit,
            offset,
        );
        const _metadata = jsonHelper.paginationMetadata(
            "proses/no-surat0-",
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

/**
 *
 * @param {Number} id
 * @param {Array} clients_id
 * @param {Number} roles_id
 */
export async function addClientAndRoles(id, clients_id, roles_id) {
    try {
        const result = {
            proses_id: id,
            created: [],
            skipped: [],
            invalid: [],
        };
        for (const cl_id of clients_id) {
            if (!(await mainRepo.isExists("clients", cl_id))) {
                result.invalid.push({
                    client_id: cl_id,
                    reason: "CLIENT_NOT_FOUND",
                });
                continue;
            } else if (
                await mainRepo.isRowExists("proses_clients", {
                    pah_id: id,
                    client_id: cl_id,
                })
            ) {
                result.skipped.push({
                    client_id: cl_id,
                    reason: "ENTRY_ALREADY_EXISTS",
                });
                continue;
            }
            await mainRepo.create("proses_clients", {
                pah_id: id,
                client_id: cl_id,
                roles_id,
            });
            result.created.push({ client_id: cl_id, reason: "SUCCESS" });
        }

        return { result };
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
        const result = {
            proses_id: id,
            deleted: [],
            skipped: [],
            invalid: [],
        };
        for (const cl_id of clients_id) {
            if (!(await mainRepo.isExists("clients", cl_id))) {
                console.log("clients does not exists" + cl_id);
                result.invalid.push({
                    client_id: cl_id,
                    reason: "CLIENT_NOT_FOUND",
                });
                continue;
            } else if (
                !(await mainRepo.isRowExists("proses_clients", {
                    pah_id: id,
                    client_id: cl_id,
                }))
            ) {
                result.skipped.push({
                    client_id: cl_id,
                    reason: "DATA_NOT_FOUND",
                });
                continue;
            }

            await mainRepo.removeWhere("proses_clients", {
                pah_id: id,
                client_id: cl_id,
            });
            result.deleted.push({ client_id: cl_id, reason: "SUCCESS" });
        }
        return { result };
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

export async function getClientRoles(roles) {
    try {
        console.log(roles);
        return await mainRepo.getWhereLike("client_roles", "name", roles);
    } catch (error) {
        throw error;
    }
}

// HELPER

/**
 *
 * @param {Array} data
 * @returns {Array}
 */
function destructureData(data) {
    const { first_name, last_name, client_id, roles_name, ...proses_data } =
        data[0];

    const clients_roles = data.map((val) => {
        const { first_name, last_name, client_id, roles_name, ...dump } = val;
        return {
            id: client_id,
            first_name,
            last_name,
            role: roles_name,
        };
    });

    return { ...proses_data, clients_roles };
}
