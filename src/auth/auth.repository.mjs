import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export async function createUser(model) {
    try {
        await db("users").insert(model);
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function get(id) {
    try {
        return await db("users").where({ id: id }).first();
    } catch (error) {
        throw ExpressError(error.message);
    }
}

export async function deleteUser(id) {
    try {
        await db("users").where({ id: id }).delete();
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

export async function updateUser(id, model) {
    try {
        await db("users").where({ id: id }).update(model);
    } catch (error) {
        throw ExpressError(error.message);
    }
}
