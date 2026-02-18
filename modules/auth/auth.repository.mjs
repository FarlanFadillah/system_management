import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export async function get(id) {
    try {
        return await db("users").where({ id: id }).first();
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function getUserByUsername(username) {
    try {
        return await db("users").where({ username }).first();
    } catch (error) {
        throw ExpressError(error.message);
    }
}
