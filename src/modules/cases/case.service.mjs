import * as mainRepo from "../../utils/main.repository.mjs";
import * as casesRepo from "./case.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as cache from "../../utils/cache.mjs";
/**
 *
 * @param {Object} model
 * @returns
 */
export async function create(model) {
    try {
        const data = await casesRepo.createCase(model);

        cache.delByPattern(":cases:list:");
        return data;
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
        await mainRepo.update("cases", id, model);

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
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
        await mainRepo.remove("cases", id);

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
    } catch (error) {
        throw error;
    }
}

export async function nextStep(id, data) {
    try {
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} case_id
 * @param {String} status
 */
export async function updateCaseStep(id, status) {
    try {
        await casesRepo.updateCurrentCaseWorkflow(id, status);

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
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
        const data = await casesRepo.getById(id);
        if (!data) throw new ExpressError("Data not found");
        return data;
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
        const { data, count } = await casesRepo.getAll(limit, offset);
        const _metadata = jsonHelper.paginationMetadata(
            "cases",
            currentpage,
            limit,
            count,
        );

        return { data, _metadata };
    } catch (error) {
        throw error;
    }
}

export async function getFilteredCases(currentpage, limit, filters) {
    try {
        const offset = (currentpage - 1) * limit;

        if (filters.from) {
            filters.from = new Date(filters.from).toISOString();
        }

        if (filters.to) {
            const to = new Date(filters.to);
            to.setUTCHours(23, 59, 59);
            filters.to = to.toISOString();
        }

        const { data, count } = await casesRepo.getFilteredCases(
            limit,
            offset,
            filters,
        );

        const _metadata = jsonHelper.paginationMetadata(
            "cases/search",
            currentpage,
            limit,
            count,
            [
                filters.code ? `code=${filters.code}` : "",
                filters.from ? `from=${filters.from}` : "",
                filters.to ? `to=${filters.to}` : "",
            ],
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
                await mainRepo.isRowExists("case_clients", {
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
            await mainRepo.create("case_clients", {
                pah_id: id,
                client_id: cl_id,
                roles_id,
            });
            cache.delByPattern(`:clients:id:${cl_id}`);
            result.created.push({ client_id: cl_id, reason: "SUCCESS" });
        }

        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
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
        if (!(await mainRepo.isExists("cases", id))) {
            throw new ExpressError("Proses not found", 404);
        } else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found", 404);
        } else if (
            !(await mainRepo.isRowExists("case_clients", {
                pah_id: id,
                client_id,
            }))
        ) {
            throw new ExpressError("Proses - Client relations not found", 404);
        }

        await mainRepo.removeWhere("case_clients", {
            pah_id: id,
            client_id,
        });
        cache.delByPattern(`:clients:id:${client_id}`);
        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
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
        if (!(await mainRepo.isExists("cases", id))) {
            throw new ExpressError("Proses not found", 404);
        } else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found", 404);
        } else if (
            !(await mainRepo.isRowExists("case_clients", {
                pah_id: id,
                client_id,
            }))
        ) {
            throw new ExpressError("Proses - Client relations not found", 404);
        }

        await mainRepo.updateWhere(
            "case_clients",
            {
                pah_id: id,
                client_id,
            },
            { roles_id },
        );

        cache.delByPattern(`:clients:id:${client_id}`);
        cache.delByPattern(`:cases:id:${id}`);
        cache.delByPattern(":cases:list:");
    } catch (error) {
        throw error;
    }
}

export async function getRoles() {
    try {
        return await casesRepo.getRoles();
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
        step_name,
        step_status,
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
        steps: {
            name: step_name,
            status: step_status,
        },
    };
}
