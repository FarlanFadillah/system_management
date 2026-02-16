import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export async function getKelurahan(name, limit, offset) {
    try {
        const code = await db("kelurahan")
            .where("name", "like", `%${name}%`)
            .limit(limit)
            .offset(offset);
        return code;
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function getKecamatan(name) {
    try {
        const code = await db("kecamatan")
            .where("name", "like", `%${name}%`)
            .first();
        return code;
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function getKabupaten(name) {
    try {
        const code = await db("kabupaten")
            .where("name", "like", `%${name}%`)
            .first();
        return code;
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function getProvinsi(name) {
    try {
        const code = await db("provinsi")
            .where("name", "like", `%${name}%`)
            .first();
        return code;
    } catch (error) {
        throw ExpressError(error.message);
    }
}
