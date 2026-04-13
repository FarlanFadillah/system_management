import { ExpressError } from "../../utils/custom.error.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as alasHakRepo from "./alas_hak.repository.mjs";
import * as jsonHelper from "../../helper/json.helper.mjs";
import * as cache from "../../utils/cache.mjs";
/**
 *
 * @param {Object} model
 */
export async function addAlasHak(model) {
    try {
        const data = await mainRepo.create("alas_hak", model);

        cache.delByPattern(":alas-hak:list:");
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 */
export async function removeAlasHak(id) {
    try {
        await mainRepo.remove("alas_hak", id);

        cache.delByPattern(`:alas-hak:id:${id}`);
        cache.delByPattern(":alas-hak:list:");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {Object} model
 */
export async function updateAlasHak(id, model) {
    try {
        await mainRepo.update("alas_hak", id, model);

        cache.delByPattern(`:alas-hak:id:${id}`);
        cache.delByPattern(":alas-hak:list:");
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getAlasHak(id) {
    try {
        const data = await alasHakRepo.get(id);
        if (data.length <= 0) throw new ExpressError("Alas Hak not found", 404);
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} currentpage
 * @returns
 */
export async function getAllAlasHak(limit, currentpage) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await alasHakRepo.getAll(limit, offset);
        // const alas_hak = jsonHelper.destructureAddressesDetails(data);
        const _metadata = jsonHelper.paginationMetadata(
            "alas-hak",
            currentpage,
            limit,
            count,
        );

        return { alas_hak: data, _metadata };
    } catch (error) {
        throw error;
    }
}

export async function getFilteredAlasHak(currentpage, limit, filters) {
    try {
        const offset = (currentpage - 1) * limit;
        const { data, count } = await alasHakRepo.getFilteredAlasHak(
            limit,
            offset,
            filters,
        );

        const _metadata = jsonHelper.paginationMetadata(
            "alas-hak/search",
            currentpage,
            limit,
            count,
            Object.keys(filters).reduce((acc, cur) => {
                if (filters[cur]) acc.push(`${cur}=${filters[cur]}`);
                return acc;
            }, []),
        );

        return { alas_hak: data, _metadata };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} alas_hak_id
 * @param {Array} clients_id
 */
export async function addAlasHakOwner(alas_hak_id, clients_id) {
    let result = {
        id: alas_hak_id,
        created: [],
        skipped: [],
        invalid: [],
    };
    try {
        if (!(await mainRepo.isExists("alas_hak", alas_hak_id)))
            throw new ExpressError("Alas Hak not found");
        for (const cl_id of clients_id) {
            if (!(await mainRepo.isExists("clients", cl_id))) {
                result.invalid.push({
                    client_id: cl_id,
                    reason: "CLIENT_NOT_FOUND",
                });
                continue;
            } else if (
                await mainRepo.isRowExists("alas_hak_clients", {
                    alas_hak_id: alas_hak_id,
                    client_id: cl_id,
                })
            ) {
                result.skipped.push({
                    clients_id: cl_id,
                    reason: "ENTRY_ALREDY_EXISTS",
                });
                continue;
            }
            await mainRepo.create("alas_hak_clients", {
                alas_hak_id,
                client_id: cl_id,
            });

            cache.delByPattern(`:clients:id:${cl_id}`);
            result.created.push({ clients_id: cl_id, reason: "SUCCESS" });
        }

        cache.delByPattern(":alas-hak:clients:");
        cache.delByPattern(`:alas-hak:id:${alas_hak_id}`);
        cache.delByPattern(":alas-hak:list:");

        return { result };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} alas_hak_id
 * @param {Number} client_id
 */
export async function removeAlasHakOwner(alas_hak_id, client_id) {
    try {
        if (!(await mainRepo.isExists("alas_hak", alas_hak_id)))
            throw new ExpressError("Alas Hak not found");
        else if (!(await mainRepo.isExists("clients", client_id))) {
            throw new ExpressError("Client not found");
        } else if (
            !(await mainRepo.isRowExists("alas_hak_clients", {
                alas_hak_id: alas_hak_id,
                client_id,
            }))
        ) {
            throw new ExpressError("Alas Hak - Client relations not found");
        }

        await mainRepo.removeWhere("alas_hak_clients", {
            alas_hak_id,
            client_id,
        });

        cache.delByPattern(":alas-hak:clients:");
        cache.delByPattern(`:alas-hak:id:${alas_hak_id}`);
        cache.delByPattern(":alas-hak:list:");
        cache.delByPattern(`:clients:id:${client_id}`);
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getOwners(id) {
    try {
        let owners = await alasHakRepo.getOwners(id);
        owners = owners.map((val) => {
            return {
                ...val,
                link: `/api/v1/clients/${val.id}`,
            };
        });

        return owners;
    } catch (error) {
        throw error;
    }
}
