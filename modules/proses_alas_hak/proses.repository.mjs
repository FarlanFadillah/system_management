import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

// {
//   "no_surat" : "001/PPAT-WK/III/2026",
//   "tgl_surat" : "2026-03-01",
//   "status" : "DRAFT",
//   "produk_id" : 1,
//   "alas_hak_id" : 3
// }

export async function getAll(limit, offset) {
    try {
        return await db("proses_alas_hak as p")
            .leftJoin("produk", "produk.id", "p.produk_id")
            .select([
                "p.id",
                "p.no_surat",
                "p.tgl_surat",
                "produk.desc as produk",
            ])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getByDate(limit, offset, from, to, no_surat) {
    try {
        return await db("proses_alas_hak")
            .whereBetween("tgl_surat", [from, to])
            .select(["id", "no_surat", "tgl_surat"])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
