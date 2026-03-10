import "dotenv/config";
import db from "../src/dbs/db.mjs";
import { jest } from "@jest/globals";

const mockClientService = {
    getClient: jest.fn(),
};

jest.unstable_mockModule(
    "../src/modules/clients/client.service.mjs",
    () => mockClientService,
);
const { getClient } =
    await import("../src/modules/clients/client.controller.mjs");

describe("Client Controller - getClient", () => {
    it("Should return client data where its id = 1 with status 200", async () => {
        mockClientService.getClient.mockResolvedValue({
            id: 1,
            first_name: "Farlan",
        });
        const req = {
            params: {
                id: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        await getClient(req, res, next);

        expect(mockClientService.getClient).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                id: 1,
                first_name: "Farlan",
            },
        });
    });
});

// describe("GET clients functions testing", () => {
//     test("Getting client by its id", async () => {
//         const result = await ClientService.getClient(1);

//         expect(result.id).toBe(1);
//     });

//     test("Getting client by wrong id", async () => {
//         const result = await ClientService.getClient(100);

//         expect(result.id).not.toBe(100);
//     });

//     test("Getting clients pagination page", async () => {
//         const result = await ClientService.getAllClientsLimitOffset(10, 0);

//         expect(result).toBeInstanceOf(Array);
//     });

//     test("Getting clients pagination page when limit is a negative number", async () => {
//         const result = await ClientService.getAllClientsLimitOffset(-10, 0);
//         console.log(result);
//         expect(result).toBeInstanceOf(ExpressError);
//     });

//     test("Search client by nik, first_name, and last_name", async () => {
//         const result = await ClientService.searchClient("Farlan", 10, 0);
//         expect(result).toBeInstanceOf(Array);
//     });

//     test("Search client by nik, first_name, and last_name (Not Found Case)", async () => {
//         const result = await ClientService.searchClient("Elon", 10, 0);
//         expect(result).toBeInstanceOf(Array);
//     });
// });

afterAll(async () => {
    await db.destroy();
});
