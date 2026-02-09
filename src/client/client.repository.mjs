import db from "../../dbs/db.mjs";

export async function create(model){
    try {
        await db("clients").insert(model);
    } catch (error) {
        throw error;
    }
}

export async function remove(username){
    try {
        await db("clients").where({username : username}).delete();
    } catch (error) {
        throw error;
    }
}