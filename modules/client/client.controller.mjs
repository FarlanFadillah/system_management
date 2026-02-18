import { matchedData } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as clientService from "./client.service.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export const addClient = asyncHandler(async (req, res, next) => {
    await clientService.addClient(req.matchedData);
    res.json({ success: true, msg: "Client added successfully" });
});

export const getAllClient = asyncHandler(async (req, res, next) => {
    const { currentpage } = req.query;
});

export const deleteClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new Error("Id is undefined"));
    await clientService.removeClient(id);
    res.status(200).json({ success: true, msg: "User deleted successfully" });
});

export const searchClient = asyncHandler(async (req, res, next) => {
    const { currentpage, keyword } = req.query;
    if (!currentpage) return next(new Error("currentpage query is empty"));
    if (!keyword)
        return next(
            new ExpressError(
                "Please provide the keyword for searching clients",
            ),
        );

    console.log(req.user);

    const user = await clientService.searchClient(keyword, currentpage);

    res.status(200).json({ success: true, data: user });
});

export const updateClientData = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Id is undefined"));

    await clientService.updateClientData(req.matchedData, id);

    res.status(200).json({ success: true, msg: "Client updated successfully" });
});
