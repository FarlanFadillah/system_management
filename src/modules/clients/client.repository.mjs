import TABLE from "../../configs/table.config.mjs";
import db from "../../dbs/db.mjs";
import { ExpressError } from "../../shared/utils/custom.error.mjs";

/**
 *
 * @param {Number} id
 * @returns {Object}
 */
export async function getById(id) {
    return await db(TABLE.CLIENTS).where({ id: id }).first();
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getByIdWithDetails(id) {
    try {
        const data = await db(`${TABLE.CLIENTS} AS cl`)
            .select(["cl.*"])
            .select(
                db.raw(`JSON_OBJECT("kelurahan", kel.name, "kecamatan", kec.name, "kabupaten", kab.name, "provinsi", prov.name) AS address
                `),
            )
            .select(
                db.raw(
                    `(SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT("id", ah.id, "nomor", ah.no_alas_hak)), JSON_ARRAY()) FROM ${TABLE.ALASHAK} AS ah 
                    LEFT JOIN ${TABLE.$ALASHAK.CLIENTS} AS ahc ON ahc.alas_hak_id = ah.id 
                    WHERE ahc.client_id = cl.id) AS alas_hak`,
                ),
            )
            .select(
                db.raw(
                    `(select coalesce(json_arrayagg(json_object("id", c.id, "product", prd.name, "status", c.status, "alas_hak", ah.no_alas_hak, "current_step", cs.name)), json_array()) from ${TABLE.CASES} as c 
                    left join ${TABLE.$CASES.CLIENTS} as cc on cc.case_id = c.id 
                    left join ${TABLE.$CASES.PRD} as prd on prd.id = c.prd_id 
                    left join ${TABLE.ALASHAK} as ah on ah.id = c.ah_id
                    left join ${TABLE.$CASES.STEPS} as cs on cs.id = c.current_step
                    where cc.client_id = cl.id and c.status != 'DONE') as cases `,
                ),
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KEL} AS kel`,
                "kel.id",
                "cl.address_code",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KEC} AS kec`,
                "kec.id",
                "kel.id_kecamatan",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KAB} AS kab`,
                "kab.id",
                "kec.id_kabupaten",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.PROV} AS prov`,
                "prov.id",
                "kab.id_provinsi",
            )
            .where("cl.id", id)
            .groupBy("cl.id")
            .first();
        return data;
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
        const data = await db(`${TABLE.CLIENTS} as cl`)
            .leftJoin(
                `${TABLE.$ADDRESS.KEL} as kel`,
                "kel.id",
                "cl.address_code",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KEC} as kec`,
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
            .select("cl.id", "cl.nik", "cl.fullname")
            .select(
                db.raw(
                    "JSON_OBJECT('kelurahan', kel.name, 'kecamatan', kec.name, 'kabupaten', kab.name, 'provinsi', prov.name) AS address",
                ),
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db(`${TABLE.CLIENTS}`).count("id as count");
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
        return await db(`${TABLE.CLIENTS}`)
            .select("id", "nik", "fullname")
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
        const data = await db(`${TABLE.CLIENTS} AS cl`)
            .leftJoin(
                `${TABLE.$ADDRESS.KEL} AS kel`,
                "kel.id",
                "cl.address_code",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KEC} AS kec`,
                "kec.id",
                "kel.id_kecamatan",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KAB} As kab`,
                "kab.id",
                "kec.id_kabupaten",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.PROV} AS prov`,
                "prov.id",
                "kab.id_provinsi",
            )
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0)
                        this.where(`cl.${col}`, "like", `%${keyword}%`);
                    else this.orWhere(`cl.${col}`, "like", `%${keyword}%`);
                });
            })
            .select("cl.id", "cl.nik", "cl.fullname")
            .select(
                db.raw(
                    `JSON_OBJECT("kelurahan", kel.name, "kecamatan", kec.name, "kabupaten", kab.name, "provinsi", prov.name) AS address`,
                ),
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db(TABLE.CLIENTS)
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
        const data = await db(`${TABLE.$CLIENTS.ALASHAK} as ahc`)
            .leftJoin(`${TABLE.ALASHAK} as ah`, "ah.id", "ahc.alas_hak_id")
            .leftJoin(
                `${TABLE.$ADDRESS.KEL} as kel`,
                "kel.id",
                "ah.address_code",
            )
            .leftJoin(
                `${TABLE.$ADDRESS.KEC} as kec`,
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
            .where("ahc.client_id", client_id)
            .select("ah.id", "ah.no_alas_hak", "ah.no_surat_ukur", "ah.ket")
            .select(
                db.raw(`JSON_OBJECT("kelurahan", kel.name, "kecamatan", kec.name, "kabupaten", kab.name, "provinsi", prov.name)
                AS address`),
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db(`${TABLE.$CLIENTS.ALASHAK} as ahc`)
            .leftJoin(`${TABLE.ALASHAK} as ah`, "ah.id", "ahc.alas_hak_id")
            .where("ahc.client_id", client_id)
            .count("id as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function saveDocs(data, trx) {
    const conn = trx || db;
    const [id] = await conn(TABLE.$CLIENTS.DOCS).insert(data);
    return id;
}
