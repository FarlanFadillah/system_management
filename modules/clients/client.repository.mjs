import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

// EXPAMPLE
// {
//     "first_name": "Farlan",
//     "last_name" : "Fadillah",
//     "nik": 1305xxxxxxxxxxxx,
//     "birth_date": "2001-08-29",
//     "birth_place" : "Duri",
//     "job_name" : "Pelajar/Mahasiswa",
//     "address_code" : "13.07.05.2007",
//     "marriage_status" : "belum kawin",
//     "gender" : "pria"
// }

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getById(id) {
    try {
        return await db("clients").where({ id }).first();
    } catch (error) {
        throw ExpressError(error.message);
    }
}

/**
 *
 * @param {Array} columns
 * @param {String} keyword
 * @param {Number} currentpage
 * @param {Number} limit
 * @returns
 */
export async function search(columns, keyword, currentpage, limit) {
    try {
        return await db("clients")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0) this.where(col, "like", `%${keyword}%`);
                    else this.orWhere(col, "like", `%${keyword}%`);
                });
            })
            .limit(limit)
            .offset(currentpage * limit)
            .select([
                "id",
                "nik",
                "first_name",
                "last_name",
                "birth_place",
                "address_code",
                "job_name",
                "updated_at",
                "created_at",
            ]);
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function getAll(limit, offset) {
    try {
        return await db("clients").limit(limit).offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getAlasHak(client_id) {
    try {
        return await db("alas_hak_clients as ahc")
            .leftJoin("alas_hak", "alas_hak.id", "ahc.alas_hak_id")
            .where("ahc.client_id", client_id)
            .select(
                "alas_hak.id",
                "alas_hak.no_alas_hak",
                "alas_hak.no_surat_ukur",
                "alas_hak.ket",
            )
            .limit(10)
            .offset(0);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
