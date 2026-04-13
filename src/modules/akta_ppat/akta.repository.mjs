import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import TABLE from "../../configs/table.config.mjs";

// {
//     "no_akta": "01",
//     "tahun_akta": 2026,
//     "tgl_akta": "2026-03-03",
//     "proses_id": 1,
//     "produk_id": 1
// }

export async function getByID(id) {
    try {
        return await db(`${TABLE.AKTAPPAT} as ap`)
            .where("ap.id", id)
            .leftJoin(`${TABLE.CASES} as c`, "c.id", "ap.case_id")
            .leftJoin(`${TABLE.$CASES.PRD} as prd`, "prd.id", "ap.prd_id")
            .leftJoin(`${TABLE.ALASHAK} as ah`, "ah.id", "c.ah_id")
            .leftJoin(`${TABLE.$CASES.CLIENTS} as cc`, "cc.case_id", "c.id")
            .leftJoin(`${TABLE.CLIENTS} as cl`, "cl.id", "cc.client_id")
            .select([
                "ap.*",
                "ah.id as alas_hak_id",
                "ah.no_alas_hak",
                "ah.luas",
                "c.case_num",
                "c.case_date",
                "c.status",
                "prd.name",
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
            .leftJoin("cases as c", "c.id", "ap.case_id")
            .leftJoin("products as prd", "prd.id", "ap.case_id")
            .select([
                "ap.id",
                "ap.no_akta",
                "ap.tahun_akta",
                "ap.tgl_akta",
                "c.case_num",
                "c.case_date",
                "c.status",
                "prd.name",
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
            .leftJoin("cases as c", "c.id", "ap.case_id")
            .leftJoin("products as prd", "prd.id", "ap.prd_id")
            .select([
                "ap.no_akta",
                "ap.tahun_akta",
                "ap.tgl_akta",
                "c.case_num",
                "c.case_date",
                "c.status",
                "prd.name",
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
            .leftJoin("cases as c", "c.id", "ap.case_id")
            .leftJoin("products as prd", "prd.id", "ap.prd_id")
            .select([
                "ap.no_akta",
                "ap.tahun_akta",
                "ap.tgl_akta",
                "c.case_num",
                "c.case_num",
                "c.status",
                "prd.name",
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
