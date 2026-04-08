import TABLE from "../../configs/table.config.mjs";
import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

// EXPAMPLE
// {
//     "first_name": "Farlan",
//     "last_name" : "Fadillah",
//     "nik": 1305xxxxxxxxxxxx,
//     "nkk": 1307xxxxxxxxxxxx,
//     "birth_date": "2001-08-29",
//     "birth_place" : "Duri",
//     "job_name" : "Pelajar/Mahasiswa",
//     "address_code" : "13.07.05.2007",
//     "marriage_status" : "belum kawin",
//     "gender" : "pria"
// }

export async function getByCLientId(id) {
    return db.raw(`
        SELECT c.id, c.nik, c.nkk, c.first_name, c.last_name, c.birth_date, c.birth_place, 
        
        (SELECT JSON_OBJECT("provinsi", prov.name, "kabupaten", kab.name, "kecamatan", kec.name, "kelurahan", kel.name)
        FROM ${TABLE.$ADDRESS.PROV} AS prov LEFT JOIN ${TABLE.$ADDRESS.KAB} AS kab on kab.id_provinsi = prov.id
        LEFT JOIN ${TABLE.$ADDRESS.KEC} AS kec on kec.id_kabupaten = kab.id
        LEFT JOIN ${TABLE.$ADDRESS.KEL} AS kel on kel.id_kecamatan = kec.id
        WHERE kel.id = c.address_code
        ) AS address,
        
        (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", ah.id, "no_alas_hak", ah.no_alas_hak)) FROM ${TABLE.ALASHAK} AS ah
        LEFT JOIN ${TABLE.$ALASHAK.CLIENTS} AS ahc on ahc.client_id = c.id WHERE ah.id = ahc.alas_hak_id) AS alas_hak,
        
        (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", cases.id, "product", prd.name, "alas_hak", ah.no_alas_hak)) FROM ${TABLE.CASES}
        LEFT JOIN ${TABLE.$CASES.PRD} AS prd ON prd.id = ${TABLE.CASES}.prd_id
        LEFT JOIN ${TABLE.ALASHAK} AS ah ON ah.id = ${TABLE.CASES}.ah_id
        LEFT JOIN ${TABLE.$CASES.CLIENTS} AS cc on cc.client_id = c.id
        WHERE cc.case_id = cases.id 
        ) AS cases
        FROM ${TABLE.CLIENTS} AS c WHERE c.id = ${id};
        
    `);
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getById(id) {
    try {
        return await db(`${TABLE.CLIENTS} as cl`)
            .leftJoin(
                `${TABLE.$ADDRESS.KEL} as kel`,
                "kel.id",
                "cl.address_code",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KEC}as kec`,
                "kec.id",
                "kel.id_kecamatan",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KAB} as kab`,
                "kab.id",
                "kec.id_kabupaten",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.PROV} as prov`,
                "prov.id",
                "kab.id_provinsi",
            )
            .leftJoin(`${TABLE.$ALASHAK.CLIENTS} as ahc`, "ahc.client_id", id)
            .leftJoin(`${TABLE.ALASHAK} as ah`, "ah.id", "ahc.alas_hak_id")
            .where("cl.id", id)
            .select([
                "cl.*",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
                "ah.id as alas_hak_id",
                "ah.no_alas_hak",
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
export async function getAllLimitOffset(limit, offset) {
    try {
        const data = await db("clients as cl")
            .leftJoin("kelurahan as kel", "kel.id", "cl.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .select(
                "cl.id",
                "cl.nik",
                "cl.first_name",
                "cl.last_name",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db("clients").count("id as count");
        return { data, count };
    } catch (error) {
        if (offset < 0)
            throw new ExpressError(
                "currentpage can't be a negatife number, start from 1",
            );
        throw new ExpressError(error.message);
    }
}

// Unused for now
export async function getAll(limit, cursor, orderBy = "id", order = "asc") {
    try {
        return await db("clients")
            .select("id", "nik", "first_name", "last_name", "birth_place")
            .orderBy(orderBy, order)
            .limit(limit)
            .where("id", ">", cursor);
    } catch (error) {
        throw new ExpressError(error.message);
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
export async function search(columns, keyword, limit, offset) {
    try {
        const data = await db("clients as cl")
            .leftJoin("kelurahan as kel", "kel.id", "cl.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0)
                        this.where(`cl.${col}`, "like", `%${keyword}%`);
                    else this.orWhere(`cl.${col}`, "like", `%${keyword}%`);
                });
            })
            .select(
                "cl.id",
                "cl.nik",
                "cl.first_name",
                "cl.last_name",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db("clients")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0) this.where(col, "like", `%${keyword}%`);
                    else this.orWhere(col, "like", `%${keyword}%`);
                });
            })
            .count("id as count");
        return { data, count };
    } catch (error) {
        if (error.code === "ER_BAD_FIELD_ERROR")
            throw new ExpressError("Column not found");
        else if (offset < 0)
            throw new ExpressError(
                "currentpage can't be a negatife number, start from 1",
            );
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} client_id
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function getAlasHak(client_id, limit, offset) {
    try {
        const data = await db("alas_hak_clients as ahc")
            .leftJoin("alas_hak as ah", "ah.id", "ahc.alas_hak_id")
            .leftJoin("kelurahan as kel", "kel.id", "ah.address_code")
            .leftJoin("kecamatan as kec", "kec.id", "kel.id_kecamatan")
            .leftJoin("kabupaten as kab", "kab.id", "kec.id_kabupaten")
            .leftJoin("provinsi as prov", "prov.id", "kab.id_provinsi")
            .where("ahc.client_id", client_id)
            .select(
                "ah.id",
                "ah.no_alas_hak",
                "ah.no_surat_ukur",
                "ah.ket",
                "kel.name as kelurahan",
                "kec.name as kecamatan",
                "kab.name as kabupaten",
                "prov.name as provinsi",
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db("alas_hak_clients as ahc")
            .leftJoin("alas_hak as ah", "ah.id", "ahc.alas_hak_id")
            .where("ahc.client_id", client_id)
            .count("id as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
