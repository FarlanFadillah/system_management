import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as alasHakService from "./alas_hak.service.mjs";

export const addAlasHak = asyncHandler(async (req, res, next) => {
    await alasHakService.addAlasHak(req.matchedData);

    res.status(200).json({ success: true, msg: "Alas Hak added successfully" });
});

export const getAllAlasHak = asyncHandler(async (req, res, next) => {
    const { currentpage } = req.query;
    if (isNaN(currentpage))
        return next(new ExpressError("Invalid currentpage value"));

    const alas_hak = await alasHakService.getAllAlasHak(currentpage);
    res.status(200).json({ success: true, data: alas_hak });
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
    if (isNaN(currentpage))
        return next(new ExpressError("Invalid currentpage value"));
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
          )
        : await alasHakService.searchAlasHak(keyword, currentpage);
    res.status(200).json({ success: true, data: alas_hak });
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
