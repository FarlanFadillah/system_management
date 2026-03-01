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
