import { UTCToGMT } from "../../helper/date.helper.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as clientRepo from "./client.repository.mjs";
import * as mainRepo from "../../utils/main.repository.mjs";

export async function addClient(model) {
    try {
        await mainRepo.create("clients", model);
    } catch (error) {
        throw error;
    }
}

export async function searchClient(keyword, currentpage) {
    try {
        let client = await clientRepo.search(
            ["nik", "first_name", "last_name"],
            keyword,
            Number(currentpage),
            Number(process.env.PAGINATION_LIMIT),
        );

        client.forEach((val) => (val.updated_at = UTCToGMT(val.updated_at)));
        client.forEach((val) => (val.created_at = UTCToGMT(val.created_at)));

        return client;
    } catch (error) {
        throw error;
    }
}

export async function removeClient(id) {
    try {
        const user = await clientRepo.getById(id);
        if (!user) throw new ExpressError("User does not exists");
        await mainRepo.remove("clients", id);
    } catch (error) {
        throw error;
    }
}

export async function updateClientData(model, id) {
    try {
        await mainRepo.update("clients", id, model);
    } catch (error) {
        throw error;
    }
}
