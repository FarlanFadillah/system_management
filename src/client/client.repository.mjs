import knex from "knex";
import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

// EXPAMPLE
// {
//     "first_name": "Farlan",
//     "last_name" : "Fadillah",
//     "nik": 1305xxxxxxxxxxxx,
//     "birth_date": "2001-08-29",
//     "birth_place" : "Duri",
//     "job_name" : "Pelajar/Mahasiswa",
//     "address_code" : "13.07.05.2007",
//     "marriage_status" : "belum kawin",
//     "gender" : "pria"
// }
/**
 *
 * @param {Object} model
 */
export async function create(model) {
    try {
        await db("clients").insert(model);
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT")
            throw new ExpressError("Client already exists");
        throw ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 * @returns
 */
export async function getById(id) {
    try {
        return await db("clients").where({ id }).first();
    } catch (error) {
        throw ExpressError(error.message);
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
export async function search(columns, keyword, currentpage, limit) {
    try {
        return await db("clients")
            .where(function () {
                columns.forEach((col, i) => {
                    if (i === 0) this.where(col, "like", `%${keyword}%`);
                    else this.orWhere(col, "like", `%${keyword}%`);
                });
            })
            .limit(limit)
            .offset(currentpage * limit)
            .select([
                "id",
                "nik",
                "first_name",
                "last_name",
                "birth_place",
                "address_code",
                "job_name",
                "updated_at",
                "created_at",
            ]);
    } catch (error) {
        throw ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 */
export async function remove(id) {
    try {
        await db("clients").where({ id }).delete();
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function update(data, id) {
    try {
        await db("clients")
            .update({ ...data, updated_at: db.fn.now() })
            .where({ id });
    } catch (error) {
        throw ExpressError(error.message);
    }
}
