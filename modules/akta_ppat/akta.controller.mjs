import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as aktaService from "./akta.service.mjs";
export const addAktaPPAT = asyncHandler(async (req, res, next) => {
    const id = await aktaService.create(req.matchedData);
    res.status(200).json({
        success: true,
        msg: "Akta PPAT added successfully",
        id,
    });
});

export const removeAktaPPAT = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await aktaService.remove(id);
    res.status(200).json({
        success: true,
        msg: "Akta PPAT removed successfully",
    });
});

export const patchAktaPPAT = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await aktaService.update(id, req.matchedData);
    res.status(200).json({
        status: true,
        msg: "Akta PPAT updated successfully",
    });
});

export const getAllAktaPPAT = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.query;
    const data = await aktaService.getAll(
        Number(limit),
        Number(currentpage) * Number(limit),
    );
    res.status(200).json({
        success: true,
        length: data.length,
        data,
    });
});

export const searchByNomorAkta = asyncHandler(async (req, res, next) => {
    const { value } = req.params;
    const data = await aktaService.getAktaByNomorTahun(value);
    res.status(200).json({
        success: true,
        length: data.length,
        data,
    });
});

export const getAktaPPATByDate = asyncHandler(async (req, res, next) => {
    const { currentpage, limit, from, to } = req.query;
    const data = await aktaService.getByDate(
        Number(limit),
        Number(currentpage) * Number(limit),
        from,
        to,
    );
    res.status(200).json({
        success: true,
        length: data.length,
        data,
    });
});
