import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as prosesService from "./proses.service.mjs";

export const createProsesAlasHak = asyncHandler(async (req, res, next) => {
    const id = await prosesService.create(req.matchedData);

    res.status(200).json({
        success: true,
        msg: "Proses Alas Hak added Successfully",
        id,
    });
});

export const removeProsesAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
});
