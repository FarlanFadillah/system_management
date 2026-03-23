import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

// {
//     "no_akta": "01",
//     "tahun_akta": 2026,
//     "tgl_akta": "2026-03-03",
//     "proses_id": 1,
//     "produk_id": 1
// }

export async function getByID(id) {
    try {
        return await db("akta_ppat as ap")
            .where("ap.id", id)
            .leftJoin("proses_alas_hak as p", "p.id", "ap.proses_id")
            .leftJoin("produk as prd", "prd.id", "ap.produk_id")
            .leftJoin("alas_hak as ah", "ah.id", "p.alas_hak_id")
            .leftJoin("proses_clients as pc", "pc.pah_id", "p.id")
            .leftJoin("clients as cl", "cl.id", "pc.client_id")
            .select([
                "ap.*",
                "ah.id as alas_hak_id",
                "ah.no_alas_hak",
                "ah.luas",
                "p.no_surat",
                "p.tgl_surat",
                "p.status",
                "prd.desc",
                "cl.id as client_id",
                "cl.first_name",
                "cl.last_name",
            ]);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getAll(limit, offset) {
    try {
        const data = await db("akta_ppat as ap")
            .leftJoin("proses_alas_hak as p", "p.id", "ap.proses_id")
            .leftJoin("produk as prd", "prd.id", "ap.produk_id")
            .select([
                "ap.id",
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

        const [{ count }] = await db("akta_ppat").count("id as count");
        return { data, count };
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
        const data = await db("akta_ppat as ap")
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
        const [{ count }] = await db("akta_ppat as ap")
            .whereBetween("ap.tgl_akta", [from, to])
            .count("id as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
