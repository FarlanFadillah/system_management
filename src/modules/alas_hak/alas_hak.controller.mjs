import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as alasHakService from "./alas_hak.service.mjs";

export const addAlasHak = asyncHandler(async (req, res, next) => {
    const id = await alasHakService.addAlasHak(req.matchedData);

    res.status(200).json({
        success: true,
        msg: "Alas Hak added successfully",
        data: {
            id,
        },
    });
});

export const updateAlasHak = asyncHandler(async (req, res, next) => {
    const { id, ...data } = req.matchedData;

    await alasHakService.updateAlasHak(id, data);

    res.status(200).json({
        success: true,
        msg: "Alas Hak updated successfully",
    });
});

export const removeAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;

    await alasHakService.removeAlasHak(id);

    res.status(200).json({
        success: true,
        msg: "Alas Hak deleted successfully",
    });
});

export const getAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;

    const alas_hak = await alasHakService.getAlasHak(Number(id));
    res.status(200).json({ success: true, data: alas_hak });
});

export const getAllAlasHak = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.matchedData;

    const { alas_hak, _metadata } = await alasHakService.getAllAlasHak(
        Number(limit),
        Number(currentpage),
    );
    res.status(200).json({
        success: true,
        _metadata,
        data: alas_hak,
    });
});

export const searchAlasHak = asyncHandler(async (req, res, next) => {
    const { address_code, nomor, currentpage, limit } = req.matchedData;

    const { alas_hak, _metadata } = await alasHakService.getFilteredAlasHak(
        Number(currentpage),
        Number(limit),
        { address_code, nomor },
    );
    res.status(200).json({
        success: true,
        _metadata,
        data: alas_hak,
    });
});

export const addAlasHakOwner = asyncHandler(async (req, res, next) => {
    const { id, clients_id } = req.matchedData;
    const { result } = await alasHakService.addAlasHakOwner(id, clients_id);

    res.status(200).json({
        success: true,
        msg: "Alas Hak - Client relations processed",
        data: result,
    });
});

export const removeAlasHakOwners = asyncHandler(async (req, res, next) => {
    const { id, client_id } = req.matchedData;

    await alasHakService.removeAlasHakOwner(id, client_id);

    res.status(200).json({
        success: true,
        msg: "Alas Hak - Client relations removed successfully",
    });
});

export const getAlasHakOwners = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;

    const data = await alasHakService.getOwners(id);
    res.status(200).json({ success: true, data });
});
