import "dotenv/config";
import db from "../src/dbs/db.mjs";
import * as clientRepo from "../src/modules/clients/client.repository.mjs";
import { ExpressError } from "../src/utils/custom.error.mjs";

describe("Client Repo Testing - getById", () => {
    it("Should return client data where id = 1", async () => {
        const result = await clientRepo.getById(1);
        expect(result).toHaveProperty("id");
        expect(result.id).toBe(1);
    });
    it("Should return undefined when user with id = 100 does not exists", async () => {
        const result = await clientRepo.getById(100);

        expect(result).toBeUndefined();
    });
});

describe("Client Repo Testing - getAllLimitOffset", () => {
    it("Should return an array of clients data and the total clients as count", async () => {
        const result = await clientRepo.getAllLimitOffset(10, 0);
        expect(result).not.toBeUndefined();
        expect(result.data).toBeInstanceOf(Array);
        expect(result.count).not.toBeUndefined();
    });

    it("Should return the clients data and count with limit = 10, and offset = 0", async () => {
        const result = await clientRepo.getAllLimitOffset(undefined, undefined);
        expect(result).not.toBeUndefined();
        expect(result.data).toBeInstanceOf(Array);
        expect(result.count).not.toBeUndefined();
    });
});

describe("Client Repo Testing - search", () => {
    it("Should return the clients data and the total of clients based on searching by its columns", async () => {
        const result = await clientRepo.search(
            ["nik", "first_name", "last_name"],
            "farlan",
            10,
            0,
        );

        expect(result).not.toBeUndefined();
        expect(result.data).toBeInstanceOf(Array);
        expect(result.count).not.toBeUndefined();
    });

    it("Should return the clients data and the total of clients based on searching by its columns", async () => {
        const result = await clientRepo.search(
            ["nik", "first_name", "last_name"],
            "farlan",
            10,
            0,
        );

        expect(result).not.toBeUndefined();
        expect(result.data).toBeInstanceOf(Array);
        expect(result.count).not.toBeUndefined();
    });
});

afterAll(async () => {
    await db.destroy();
});
