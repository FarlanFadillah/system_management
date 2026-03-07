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
    await prosesService.remove(id);
    res.status(200).json({
        success: true,
        msg: "Proses Alas Hak remove successfully",
    });
});

export const getProsesAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await prosesService.get(id);
    res.status(200).json({
        success: true,
        data,
    });
});

export const getAllProsesAlasHak = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.query;

    const data = await prosesService.getAll(
        Number(limit),
        Number(currentpage) * Number(limit),
    );
    res.status(200).json({
        success: true,
        length: data.length,
        data,
    });
});

export const searchByDate = asyncHandler(async (req, res, next) => {
    const { currentpage, limit, from, to } = req.query;
    const data = await prosesService.getByDate(
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

export const getByNoSurat = asyncHandler(async (req, res, next) => {
    let { value } = req.params;
    const data = await prosesService.getByNoSurat(value);
    res.status(200).json({
        success: true,
        data,
    });
});

export const update = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await prosesService.update(id, req.matchedData);

    res.status(200).json({
        status: true,
        msg: "Proses Alas Hak updated successfully",
    });
});
