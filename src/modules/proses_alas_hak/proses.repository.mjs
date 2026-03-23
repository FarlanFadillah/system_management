import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

// {
//   "no_surat" : "001/PPAT-WK/III/2026",
//   "tgl_surat" : "2026-03-01",
//   "status" : "DRAFT",
//   "produk_id" : 1,
//   "alas_hak_id" : 3
// }

export async function getBy(key, value) {
    try {
        return await db("proses_alas_hak as p")
            .leftJoin("proses_clients as pc", "pc.pah_id", "p.id")
            .leftJoin("clients as cl", "cl.id", "pc.client_id")
            .leftJoin("client_roles as cr", "cr.id", "pc.roles_id")
            .leftJoin("alas_hak as ah", "ah.id", "p.alas_hak_id")
            .leftJoin("produk", "produk.id", "p.produk_id")
            .select([
                "p.id",
                "p.no_surat",
                "p.tgl_surat",
                "produk.desc as produk",
                "ah.no_alas_hak",
                "ah.luas",
                "cl.id as client_id",
                "cl.first_name",
                "cl.last_name",
                "cr.name as roles_name",
            ])
            .where(`p.${key}`, value);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} key
 * @param {String} value
 */
export async function searchBy(key, value, limit, offset) {
    try {
        const data = await db("proses_alas_hak as p")
            .leftJoin("produk", "produk.id", "p.produk_id")
            .where(`p.${key}`, "like", `%${value}%`)
            .select([
                "p.id",
                "p.no_surat",
                "p.tgl_surat",
                "produk.desc as produk",
            ])
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db("proses_alas_hak")
            .where(key, "like", `%${value}%`)
            .count("* as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getAll(limit, offset) {
    try {
        const data = await db("proses_alas_hak as p")
            .leftJoin("produk", "produk.id", "p.produk_id")
            .select([
                "p.id",
                "p.no_surat",
                "p.tgl_surat",
                "produk.desc as produk",
            ])
            .limit(limit)
            .offset(offset);
        const [{ count }] = await db("proses_alas_hak").count("id as count");
        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
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
export async function searchByDate(limit, offset, from, to, number) {
    try {
        const data = await db("proses_alas_hak")
            .whereBetween("tgl_surat", [from, to])
            .modify(function (queryBuiler) {
                if (number) {
                    queryBuiler.andWhere("no_surat", "like", `${number}%`);
                }
            })
            .select(["id", "no_surat", "tgl_surat"])
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db("proses_alas_hak")
            .whereBetween("tgl_surat", [from, to])
            .count("id as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
