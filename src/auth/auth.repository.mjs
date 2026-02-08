import db from "../../dbs/db.mjs";


export async function createUser(model){
    try {
        await db("users").insert(model);
    } catch (error) {
        throw error;
    }
}

export async function getUserByUsername(username){
    try {
        return await db("users").where({username}).first();
    } catch (error) {
        throw error;
    }
}