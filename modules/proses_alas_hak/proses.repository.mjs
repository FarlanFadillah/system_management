import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

/**
 * {
 *      no_surat : "123/bf/12/2026",
 *      tgl_surat : 01-03-2026,
 *      status : "DRAFT" | "PENDING" | "ON PROCESS" | "DONE",
 *      produk_id : 0,
 *      alas_hak_id : 0,
 * }
 */

export async function getAll(limit, offset) {
    try {
        return await db("proses_alas_hak")
            .select(["id", "no_surat", "tgl_surat"])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getByDate(limit, offset, from, to, no_surat) {
    try {
        return await db("proses_alas_hak")
            .andWhereBetween("tgl_surat", [from, to])
            .select(["id", "no_surat", "tgl_surat"])
            .limit(limit)
            .offset(offset);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
