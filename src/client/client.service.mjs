import * as clientRepo from "./client.repository.mjs";

export async function addClient(model){
    try {
        await clientRepo.create(model);
    } catch (error) {
        throw error;
    }
}

export async function removeClient(username){
    try {
        await clientRepo.remove(username);
    } catch (error) {
        throw error;
    }
}