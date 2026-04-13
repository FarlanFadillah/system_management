import { ExpressError } from "../../utils/custom.error.mjs";
import db from "../../dbs/db.mjs";
import TABLE from "../../configs/table.config.mjs";

// EXAMPLE
// {
//     "no_alas_hak" : "03040804102576",
//     "tgl_alas_hak" : "2020-12-20",
//     "no_surat_ukur" : "02525/Ampang Gadang/2020",
//     "tgl_surat_ukur" : "2020-10-05",
//     "luas" : 125,
//     "jor" : "Ampang Gadang",
//     "address_code" : "13.06.07.2005",
//     "type_id" : 1,
//      "ket" : "Proses Pemecahan"
// }

/**
 *
 * @param {Number} id
 * @returns
 */
export async function get(id) {
    try {
        return await db(`${TABLE.ALASHAK} as ah`)
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
            .leftJoin(
                `${TABLE.$ALASHAK.CLIENTS} as ahc`,
                "ahc.alas_hak_id",
                "ah.id",
            )
            .leftJoin(`${TABLE.CLIENTS} as cl`, "cl.id", "ahc.client_id")
            .leftJoin(`${TABLE.$ALASHAK.TYPES} as tp`, "tp.id", "ah.type_id")
            .where("ah.id", id)
            .select([
                "ah.id",
                "ah.no_alas_hak",
                "ah.no_surat_ukur",
                "ah.tgl_alas_hak",
                "ah.luas",
                "ah.ket",
                "ah.created_at",
                "ah.updated_at",
                "tp.name as jenis_hak",
            ])
            .select(
                db.raw(`
                JSON_OBJECT("jorong", ah.jor, "kelurahan", kel.name, "kecamatan", kec.name, "kabupaten", kab.name, "provinsi", prov.name) AS address
                `),
            )
            .select(
                db.raw(`
                COALESCE(
                    JSON_ARRAYAGG(JSON_OBJECT("id", cl.id, "nik", cl.nik, "nkk", cl.nkk, "first_name", cl.first_name, "last_name", cl.last_name)),
                    JSON_ARRAY()
                ) as owners
                `),
            )
            .groupBy("ah.id")
            .first();
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
export async function getAll(limit, offset) {
    try {
        const data = await db(`${TABLE.ALASHAK} as ah`)
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
            .leftJoin("types", "types.id", "ah.type_id")
            .select([
                "ah.id",
                "ah.no_alas_hak",
                "ah.luas",
                "ah.tgl_alas_hak",
                "ah.ket",
                "types.name as jenis_hak",
            ])
            .select(
                db.raw(`
                JSON_OBJECT("jorong", ah.jor, "kelurahan", kel.name, "kecamatan", kec.name, "kabupaten", kab.name, "provinsi", prov.name) AS address
                `),
            )
            .limit(limit || 10)
            .offset(offset || 0);

        const [{ count }] = await db(TABLE.ALASHAK).count("id as count");
        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getFilteredAlasHak(limit, offset, filters) {
    try {
        const data = await db(`${TABLE.ALASHAK} as ah`)
            .where("ah.no_alas_hak", "like", `%${filters.nomor || ""}%`)
            .modify((queryBuilder) => {
                if (filters.address_code)
                    queryBuilder.andWhere(
                        "ah.address_code",
                        "like",
                        `${filters.address_code}%`,
                    );
            })
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
            .leftJoin("types", "types.id", "ah.type_id")
            .select([
                "ah.id",
                "ah.no_alas_hak",
                "ah.luas",
                "ah.tgl_alas_hak",
                "ah.ket",
                "types.name as jenis_hak",
            ])
            .select(
                db.raw(`
                JSON_OBJECT("jorong", ah.jor, "kelurahan", kel.name, "kecamatan", kec.name, "kabupaten", kab.name, "provinsi", prov.name) AS address
                `),
            )
            .orderBy("ah.id", "asc")
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(`${TABLE.ALASHAK} as ah`)
            .where("ah.no_alas_hak", "like", `%${filters.nomor || ""}%`)
            .modify((queryBuilder) => {
                if (filters.address_code)
                    queryBuilder.andWhere(
                        "ah.address_code",
                        "like",
                        `${filters.address_code}%`,
                    );
            })
            .count("ah.id as count");

        return { data, count };
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getOwners(id) {
    try {
        return await db(`${TABLE.$ALASHAK.CLIENTS} as ahc`)
            .leftJoin(`${TABLE.CLIENTS} as cl`, "cl.id", "ahc.client_id")
            .where("ahc.alas_hak_id", id)
            .select("cl.id", "cl.nik", "cl.first_name", "cl.last_name")
            .limit(10)
            .offset(0);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}
