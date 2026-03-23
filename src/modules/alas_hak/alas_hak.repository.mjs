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
//     "jenis_hak_id" : 0,
//      "ket" : "Proses Pemecahan"
// }

/**
 *
 * @param {Number} id
 * @returns
 */
export async function get(id) {
    try {
        return await db("alas_hak as ah")
            .leftJoin("kelurahan as kel", "kel.id", "ah.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .leftJoin("alas_hak_clients as ahc", "ahc.alas_hak_id", id)
            .leftJoin("clients as cl", "cl.id", "ahc.client_id")
            .leftJoin("jenis_hak as j", "j.id", "ah.jenis_hak_id")
            .where("ah.id", id)
            .select([
                "ah.*",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
                "cl.id as cl_id",
                "cl.first_name as cl_first_name",
                "cl.last_name as cl_last_name",
            ]);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function getAll(limit, offset) {
    try {
        const data = await db("alas_hak as ah")
            .leftJoin("kelurahan as kel", "kel.id", "ah.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .leftJoin("jenis_hak as j", "j.id", "ah.jenis_hak_id")
            .select([
                "ah.id",
                "ah.no_alas_hak",
                "ah.luas",
                "ah.tgl_alas_hak",
                "ah.ket",
                "j.desc as Jenis Hak",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
            ])
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db("alas_hak").count("id as count");
        return { data, count };
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
        const data = await db("alas_hak as ah")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0)
                        this.where(`ah.${col}`, "like", `%${keyword}%`);
                    else this.orWhere(`ah.${col}`, "like", `%${keyword}%`);
                });
            })
            .leftJoin("kelurahan as kel", "kel.id", "ah.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .leftJoin("jenis_hak as j", "j.id", "ah.jenis_hak_id")
            .select([
                "ah.id",
                "ah.no_alas_hak",
                "ah.luas",
                "ah.tgl_alas_hak",
                "ah.ket",
                "j.desc as Jenis Hak",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
            ])
            .orderBy("ah.id")
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db("alas_hak")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0) this.where(col, "like", `%${keyword}%`);
                    else this.orWhere(col, "like", `%${keyword}%`);
                });
            })
            .count("id as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} address_code
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function getByAddressCode(address_code, limit, offset) {
    try {
        const data = await db("alas_hak as ah")
            .where("ah.address_code", "like", `%${address_code}%`)
            .leftJoin("kelurahan as kel", "kel.id", "ah.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .leftJoin("jenis_hak as j", "j.id", "ah.jenis_hak_id")
            .select([
                "ah.id",
                "ah.no_alas_hak",
                "ah.luas",
                "ah.tgl_alas_hak",
                "ah.ket",
                "j.desc as Jenis Hak",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
            ])
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db("alas_hak")
            .where("address_code", "like", `%${address_code}%`)
            .count("id as count");

        return { data, count };
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

/**
 *
 * @param {Number} id
 * @returns
 */
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
