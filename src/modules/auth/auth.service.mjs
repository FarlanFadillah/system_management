import * as authRepo from "./auth.repository.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";
import * as crypt from "../../utils/crypt.mjs";
import * as jwt from "../../utils/jwt.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export async function verifyPassword(username, password) {
    try {
        const user = await authRepo.getUserByUsername(username);
        if (!user) throw new ExpressError("Username not found!");

        const match = await crypt.compareHash(password, user.hash);
        return { user, match };
    } catch (error) {
        throw error;
    }
}

export async function generateToken(payload) {
    try {
        return await jwt.signUser(payload);
    } catch (error) {
        throw error;
    }
}

export async function registerUser(model) {
    try {
        const hash = await crypt.hashing(model.password);

        delete model.password;

        await mainRepo.create("users", { ...model, hash });
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id, current_user) {
    try {
        const userToDelete = await authRepo.get(id);
        if (!userToDelete) throw new ExpressError("User does not exist");
        if (userToDelete.username === current_user)
            throw new ExpressError("User can't delete itself", 403);
        await mainRepo.remove("users", id);
    } catch (error) {
        throw error;
    }
}

export async function updateUser(id, model) {
    try {
        await mainRepo.update("users", id, model);
    } catch (error) {
        throw error;
    }
}
