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
 * @param {String} number
 * @returns
 */
export async function search(from, to, number, currentpage, limit) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await prosesRepo.searchByDate(
            limit,
            offset,
            from,
            to,
            number,
        );

        const _metadata = jsonHelper.paginationMetadata(
            "proses/search",
            currentpage,
            limit,
            count,
            [
                `from=${from}`,
                `to=${to}`,
                ...(number ? [`number=${number}`] : []),
            ],
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
            "proses/no-surat",
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
 * @param {Number} client_id
 */
export async function removeClientAndRoles(id, client_id) {
    try {
        if (!(await mainRepo.isExists("proses_alas_hak", id))) {
            throw new ExpressError("Proses not found", 404);
        } else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found", 404);
        } else if (
            !(await mainRepo.isRowExists("proses_clients", {
                pah_id: id,
                client_id,
            }))
        ) {
            throw new ExpressError("Proses - Client relations not found", 404);
        }

        await mainRepo.removeWhere("proses_clients", {
            pah_id: id,
            client_id,
        });
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Number} client_id
 * @param {Number} roles_id
 */
export async function updateClientRoles(id, client_id, roles_id) {
    try {
        if (!(await mainRepo.isExists("proses", id))) {
            throw new ExpressError("Proses not found", 404);
        } else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found", 404);
        } else if (
            !(await mainRepo.isRowExists("proses_clients", {
                pah_id: id,
                client_id,
            }))
        ) {
            throw new ExpressError("Proses - Client relations not found", 404);
        }

        await mainRepo.updateWhere(
            "proses_clients",
            {
                pah_id: id,
                client_id,
            },
            { roles_id },
        );
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

// HELPER

/**
 *
 * @param {Array} data
 * @returns {Array}
 */
function destructureData(data) {
    const {
        first_name,
        last_name,
        client_id,
        roles_name,
        alas_hak_id,
        no_alas_hak,
        luas,
        ...proses_data
    } = data[0];

    const clients_roles = data.map((val) => {
        const { first_name, last_name, client_id, roles_name, ...dump } = val;
        return {
            id: client_id,
            first_name,
            last_name,
            role: roles_name,
        };
    });

    return {
        ...proses_data,
        alas_hak: {
            id: alas_hak_id,
            no_alas_hak,
            luas,
        },
        client_roles: clients_roles[0].id ? clients_roles : [],
    };
}
