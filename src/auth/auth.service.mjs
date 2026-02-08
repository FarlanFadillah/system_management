import * as authRepo from "./auth.repository.mjs";
import * as crypt from "../../utils/crypt.mjs";
import * as jwt from "../../utils/jwt.mjs"
export async function verifyPassword(username, password){
    try {
        const user = await authRepo.getUserByUsername(username);
        if(!user) throw new Error("Username not found!");

        return await crypt.compareHash(password, user.hash);
    } catch (error) {
        throw error;
    }
}


export async function generateToken(payload){
    try {
        return await jwt.signUser(payload);
    } catch (error) {
        throw error;
    }
}

export async function registerUser(model, password){
    try {
        const hash = await crypt.hashing(password);

        await authRepo.createUser({...model, hash});
    } catch (error) {
        throw error;
    }
}