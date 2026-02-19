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
        return await db("alas_hak")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0) this.where(col, "like", `%${keyword}%`);
                    else this.orWhere(col, "like", `%${keyword}%`);
                });
            })
            .leftJoin("kelurahan as kel", "kel.id", "alas_hak.address_code")
            .select([
                "alas_hak.id",
                "no_alas_hak",
                "luas",
                "tgl_alas_hak",
                "kel.name as kelurahan",
                "ket",
            ])
            .orderBy("alas_hak.id")
            .limit(limit)
            .offset(currentpage * limit);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} column
 * @param {String} keyword
 * @param {Number} currentpage
 * @param {Number} limit
 * @returns
 */
export async function searchMultipleKeywords(
    column,
    keyword,
    currentpage,
    limit,
) {
    try {
        return await db("alas_hak")
            .where({ [column]: keyword })
            .limit(limit)
            .offset(currentpage * limit);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getAll(limit, offset) {
    try {
        return await db("alas_hak")
            .select([
                "id",
                "no_alas_hak",
                "luas",
                "tgl_alas_hak",
                "address_code",
                "ket",
            ])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
