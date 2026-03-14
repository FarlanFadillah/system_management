import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as alasHakService from "./alas_hak.service.mjs";

export const addAlasHak = asyncHandler(async (req, res, next) => {
    const id = await alasHakService.addAlasHak(req.matchedData);

    res.status(200).json({
        success: true,
        msg: "Alas Hak added successfully",
        id,
    });
});

export const updateAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Invalid id"));

    await alasHakService.updateAlasHak(id, req.matchedData);

    res.status(200).json({
        success: true,
        msg: "Alas Hak updated successfully",
    });
});

export const removeAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Invalid id"));

    await alasHakService.removeAlasHak(id);

    res.status(200).json({
        success: true,
        msg: "Alas Hak deleted successfully",
    });
});

export const getAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Invalid id"));

    const alas_hak = await alasHakService.getAlasHak(Number(id));
    res.status(200).json({ success: true, data: alas_hak });
});

export const getAllAlasHak = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.query;

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
    const { keyword, currentpage, limit, level } = req.query;

    const { alas_hak, _metadata } = level
        ? await alasHakService.searchByAddressCode(
              level,
              keyword,
              Number(limit),
              Number(currentpage),
          )
        : await alasHakService.searchAlasHak(
              keyword,
              Number(limit),
              Number(currentpage),
          );
    res.status(200).json({
        success: true,
        _metadata,
        data: alas_hak,
    });
});

export const addAlasHakOwner = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { clients_id } = req.matchedData;
    if (!id || isNaN(id)) return next(new ExpressError("Alas Hak Not found"));
    const msg = await alasHakService.addAlasHakOwner(id, clients_id);

    const req_failed = msg.length === clients_id.length;
    res.status(200).json({
        success: req_failed ? false : true,
        msg: req_failed
            ? "Something went wrong"
            : "Alas Hak Owners added successfully",
        erros: msg,
    });
});

export const getAlasHakOwners = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Id is undefined"));

    const data = await alasHakService.getOwners(id);
    res.status(200).json({ success: true, data });
});
