import { ExpressError } from "../../utils/custom.error.mjs";
import db from "../../dbs/db.mjs";

// EXAMPLE
// {
//     "no_alas_hak" : "03040804102576",
//     "tgl_alas_hak" : "2020-12-20",
//     "no_surat_ukur" : "02525/Ampang Gadang/2020",
//     "tgl_surat_ukur" : "2020-10-05",
//     "luas" : 125,
//     "jor" : "Ampang Gadang",
//     "address_code" : "13.06.07.2005",
//     "jenis_alas_hak" : 0,
//      "ket" : "Proses Pemecahan"
// }

export async function get(id) {
    try {
        return await db("alas_hak as a")
            .where("a.id", id)
            .leftJoin("jenis_hak as j", "j.id", "a.jenis_hak_id")
            .select("a.*", "j.desc as Jenis Hak")
            .first();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Array} columns
 * @param {String} keyword
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function search(columns, keyword, limit, offset) {
    try {
        return await db("alas_hak as a")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0) this.where(col, "like", `%${keyword}%`);
                    else this.orWhere(col, "like", `%${keyword}%`);
                });
            })
            .leftJoin("jenis_hak as j", "j.id", "a.jenis_hak_id")
            .leftJoin("kelurahan as kel", "kel.id", "alas_hak.address_code")
            .select([
                "a.id",
                "a.no_alas_hak",
                "a.luas",
                "a.tgl_alas_hak",
                "kel.name as kelurahan",
                "a.ket",
                "j.desc as Jenis Hak",
            ])
            .orderBy("alas_hak.id")
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} column
 * @param {String} keyword
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function searchMultipleKeywords(column, keyword, limit, offset) {
    try {
        return await db("alas_hak as a")
            .leftJoin("jenis_hak as j", "j.id", "a.jenis_hak_id")
            .select([
                "a.id",
                "a.no_alas_hak",
                "a.luas",
                "a.tgl_alas_hak",
                "a.address_code",
                "a.ket",
                "j.desc as Jenis Hak",
            ])
            .where({ [column]: keyword })
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getByAddressCode(address_code, limit, offset) {
    try {
        return await db("alas_hak as a")
            .leftJoin("jenis_hak as j", "j.id", "a.jenis_hak_id")
            .where("address_code", "like", `%${address_code}%`)
            .select([
                "a.id",
                "a.no_alas_hak",
                "a.luas",
                "a.tgl_alas_hak",
                "a.address_code",
                "a.ket",
                "j.desc as Jenis Hak",
            ])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getAll(limit, offset) {
    try {
        return await db("alas_hak as a")
            .leftJoin("jenis_hak as j", "j.id", "a.jenis_hak_id")
            .select([
                "a.id",
                "a.no_alas_hak",
                "a.luas",
                "a.tgl_alas_hak",
                "a.address_code",
                "a.ket",
                "j.desc as Jenis Hak",
            ])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getOwners(id) {
    try {
        return await db("alas_hak_clients as ahc")
            .leftJoin("clients", "clients.id", "ahc.client_id")
            .where("ahc.alas_hak_id", id)
            .select(
                "clients.id",
                "clients.nik",
                "clients.first_name",
                "clients.last_name",
            )
            .limit(10)
            .offset(0);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
