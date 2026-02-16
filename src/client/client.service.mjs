import { UTCToGMT } from "../../helper/date.helper.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as clientRepo from "./client.repository.mjs";

export async function addClient(model) {
    try {
        await clientRepo.create(model);
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
        await clientRepo.remove(id);
    } catch (error) {
        throw error;
    }
}

export async function updateClientData(data, id) {
    try {
        await clientRepo.update(data, id);
    } catch (error) {
        throw error;
    }
}
