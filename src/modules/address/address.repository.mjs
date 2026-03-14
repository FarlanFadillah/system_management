import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

/**
 *
 * @param {"provinsi" | "kabupaten" | "kecamatan" | "kelurahan"} table
 * @param {String} name
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function get(table, name) {
    try {
        return await db(table)
            .where("name", "like", `%${name}%`)
            .select("id")
            .first();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getKelurahan(name, limit, offset) {
    try {
        const addresses = await db("kelurahan")
            .where("name", "like", `%${name}%`)
            .select("id", "name")
            .limit(limit)
            .offset(offset);
        return addresses;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
export async function getKecamatan(name) {
    try {
        const code = await db("kecamatan")
            .where("name", "like", `%${name}%`)
            .first();
        return code;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getKabupaten(name) {
    try {
        const code = await db("kabupaten")
            .where("name", "like", `%${name}%`)
            .first();
        return code;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getProvinsi(name) {
    try {
        const code = await db("provinsi")
            .where("name", "like", `%${name}%`)
            .first();
        return code;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
