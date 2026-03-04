import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
// {
//     "no_akta": "01",
//     "tgl_akta": "2026-03-03",
//     "proses_id": 0,
//     "produk_id": 0,
//     "saksi1_id": 0,
//     "saksi2_id": 1,
// }

export async function getAll(limit, offset) {
    try {
        return await db("akta_ppat as ap")
            .leftJoin("proses_alas_hak as p", "p.id", "ap.proses_id")
            .leftJoin("produk as prd", "prd.id", "ap.produk_id")
            .select([
                "ap.no_akta",
                "ap.tahun_akta",
                "ap.tgl_akta",
                "p.no_surat",
                "p.tgl_surat",
                "p.status",
                "prd.desc",
            ])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} number
 * @param {Number} year
 * @returns
 */
export async function getAktaByNomorTahun(number, year) {
    try {
        return await db("akta_ppat as ap")
            .where(`ap.no_akta`, "like", `%${number}%`)
            .andWhere("ap.tahun_akta", "like", `%${year}%`)
            .leftJoin("proses_alas_hak as p", "p.id", "ap.proses_id")
            .leftJoin("produk as prd", "prd.id", "ap.produk_id")
            .select([
                "ap.no_akta",
                "ap.tahun_akta",
                "ap.tgl_akta",
                "p.no_surat",
                "p.tgl_surat",
                "p.status",
                "prd.desc",
            ])
            .first();
    } catch (error) {
        throw new ExpressError(error);
    }
}

export async function getByDate(limit, offset, from, to) {
    try {
        return db("akta_ppat as ap")
            .whereBetween("ap.tgl_akta", [from, to])
            .leftJoin("proses_alas_hak as p", "p.id", "ap.proses_id")
            .leftJoin("produk as prd", "prd.id", "ap.produk_id")
            .select([
                "ap.no_akta",
                "ap.tahun_akta",
                "ap.tgl_akta",
                "p.no_surat",
                "p.tgl_surat",
                "p.status",
                "prd.desc",
            ])
            .limit(limit)
            .offset(offset);
    } catch (error) {}
}
