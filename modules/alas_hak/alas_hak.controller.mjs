import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as alasHakService from "./alas_hak.service.mjs";

export const addAlasHak = asyncHandler(async (req, res, next) => {
    await alasHakService.addAlasHak(req.matchedData);

    res.status(200).json({ success: true, msg: "Alas Hak added successfully" });
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

export const searchAlasHak = asyncHandler(async (req, res, next) => {
    const { keyword, currentpage, address } = req.query;
    if (!currentpage) return next(new Error("currentpage query is empty"));
    if (!keyword)
        return next(
            new ExpressError(
                "Please provide the keyword for searching clients",
            ),
        );
    const alas_hak = address
        ? await alasHakService.searchAlasHakByAddress(
              address,
              keyword,
              currentpage,
              process.env.PAGINATION_LIMIT,
          )
        : await alasHakService.searchAlasHak(
              keyword,
              currentpage,
              process.env.PAGINATION_LIMIT,
          );
    res.status(200).json({ success: true, data: alas_hak });
});

export const addAlasHakOwner = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { clients } = req.matchedData;
    if (!id || isNaN(id)) return next(new ExpressError("Alas Hak Not found"));
    const msg = await alasHakService.addAlasHakOwner(id, clients);
    res.status(200).json({
        success: msg.length === clients.length ? false : true,
        msg,
    });
});
