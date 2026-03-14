import { matchedData } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as clientService from "./client.service.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export const addClient = asyncHandler(async (req, res, next) => {
    const id = await clientService.addClient(req.matchedData);
    res.json({ success: true, msg: "Client added successfully", id });
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

export const updateClientData = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Id is undefined"));

    await clientService.updateClientData(req.matchedData, id);

    res.status(200).json({ success: true, msg: "Client updated successfully" });
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

    const { clients, _metadata } = await clientService.getAllClientsLimitOffset(
        Number(limit),
        Number(currentpage),
    );

    res.status(200).json({
        success: true,
        _metadata,
        data: clients,
    });
});

export const searchClient = asyncHandler(async (req, res, next) => {
    const { currentpage, limit, keyword } = req.query;

    const { clients, _metadata } = await clientService.searchClient(
        keyword,
        Number(limit),
        Number(currentpage),
    );
    res.status(200).json({
        success: true,
        _metadata,
        data: clients,
    });
});

export const getAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { currentpage, limit } = req.query;
    if (!id) return next(new ExpressError("Id is undefined"));

    const { alas_hak, _metadata } = await clientService.getAlasHak(
        id,
        Number(limit),
        Number(currentpage),
    );
    res.status(200).json({
        success: true,
        _metadata,
        data: alas_hak,
    });
});
