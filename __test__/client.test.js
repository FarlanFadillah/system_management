import "dotenv/config";
import * as ClientService from "../src/modules/clients/client.service.mjs";
import db from "../src/dbs/db.mjs";
import { ExpressError } from "../src/utils/custom.error.mjs";

describe("GET clients functions testing", () => {
    test("Getting client by its id", async () => {
        const result = await ClientService.getClient(1);

        expect(result.id).toBe(1);
    });

    test("Getting client by wrong id", async () => {
        const result = await ClientService.getClient(100);

        expect(result.id).not.toBe(100);
    });

    test("Getting clients pagination page", async () => {
        const result = await ClientService.getAllClientsLimitOffset(10, 0);

        expect(result).toBeInstanceOf(Array);
    });
});

afterAll(async () => {
    await db.destroy();
});
