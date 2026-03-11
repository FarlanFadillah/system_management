import { matchedData } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as clientService from "./client.service.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export const addClient = asyncHandler(async (req, res, next) => {
    const id = await clientService.addClient(req.matchedData);
    res.json({ success: true, msg: "Client added successfully", id });
});

/**
 * Cursor based pagination
 */
export const getAllClients = asyncHandler(async (req, res, next) => {
    const { cursor, limit, orderBy } = req.query;
    const clients = await clientService.getAllClients(limit, cursor, orderBy);

    res.status(200).json({
        success: true,
        data: clients,
        nextCursor: clients.length > 0 ? clients[clients.length - 1].id : 0,
    });
});

/**
 * Limit Offset based pagination
 */
export const getAllClientsLimitOffset = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.query;

    const clients = await clientService.getAllClientsLimitOffset(
        Number(limit),
        Number(currentpage) * Number(limit),
    );

    res.status(200).json({ success: true, data: clients });
});

export const getClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Id is undefined"));
    const client = await clientService.getClient(id);
    res.status(200).json({ success: true, data: client });
});

export const deleteClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new Error("Id is undefined"));
    await clientService.removeClient(id);
    res.status(200).json({ success: true, msg: "User deleted successfully" });
});

export const searchClient = asyncHandler(async (req, res, next) => {
    const { currentpage, limit, keyword } = req.query;

    const user = await clientService.searchClient(
        keyword,
        Number(limit),
        Number(currentpage) * Number(limit),
    );
    res.status(200).json({ success: true, data: user });
});

export const updateClientData = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Id is undefined"));

    await clientService.updateClientData(req.matchedData, id);

    res.status(200).json({ success: true, msg: "Client updated successfully" });
});

export const getAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Id is undefined"));

    const data = await clientService.getAlasHak(id);
    res.status(200).json({ success: true, data });
});
