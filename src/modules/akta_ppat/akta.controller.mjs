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
    const { id } = req.matchedData;
    await aktaService.remove(id);
    res.status(200).json({
        success: true,
        msg: "Akta PPAT removed successfully",
    });
});

export const patchAktaPPAT = asyncHandler(async (req, res, next) => {
    const { id, ...data } = req.matchedData;
    await aktaService.update(id, data);
    res.status(200).json({
        success: true,
        msg: "Akta PPAT updated successfully",
    });
});

export const getByID = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;
    const data = await aktaService.getByID(id);
    console.log(id);
    res.status(200).json({
        success: true,
        data: data,
    });
});

export const getAllAktaPPAT = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.matchedData;
    const { data, _metadata } = await aktaService.getAll(
        Number(currentpage),
        Number(limit),
    );
    res.status(200).json({
        success: true,
        _metadata,
        data,
    });
});

export const searchByNomorAkta = asyncHandler(async (req, res, next) => {
    const { value } = req.matchedData;
    const data = await aktaService.getAktaByNomorTahun(value);
    res.status(200).json({
        success: true,
        length: data.length,
        data,
    });
});

export const getAktaPPATByDate = asyncHandler(async (req, res, next) => {
    const { currentpage, limit, from, to } = req.matchedData;
    const { data, _metadata } = await aktaService.getByDate(
        Number(currentpage),
        Number(limit),
        from,
        to,
    );
    res.status(200).json({
        success: true,
        _metadata,
        data,
    });
});
