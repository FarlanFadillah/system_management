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

export const update = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await prosesService.update(id, req.matchedData);

    res.status(200).json({
        status: true,
        msg: "Proses Alas Hak updated successfully",
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

export const addClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { clients_id, roles_id } = req.matchedData;
    const { warnings } = await prosesService.addClientAndRoles(
        id,
        clients_id,
        roles_id,
    );

    res.status(200).json({
        success: true,
        msg: "Client and Roles added succesfully",
        warnings,
    });
});

export const removeClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { clients_id } = req.matchedData;

    await prosesService.removeClientAndRoles(id, clients_id);
    res.status(200).json({
        success: true,
        msg: "Client and Roles deleted successfully",
    });
});

export const updateClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { clients_id, roles_id } = req.matchedData;
    await prosesService.updateClientRoles(id, clients_id, roles_id);
    res.status(200).json({
        success: true,
        msg: "Client and Roles updated successfully",
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

    const { data, _metadata } = await prosesService.getAll(
        Number(currentpage),
        Number(limit),
    );
    res.status(200).json({
        success: true,
        _metadata,
        data,
    });
});

export const searchByDate = asyncHandler(async (req, res, next) => {
    const { currentpage, limit, from, to } = req.query;
    const { data, _metadata } = await prosesService.getByDate(
        from,
        to,
        Number(currentpage),
        Number(limit),
    );
    res.status(200).json({
        success: true,
        _metadata,
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

export const getClientRoles = asyncHandler(async (req, res, next) => {
    const { name } = req.query;
    const roles = await prosesService.getClientRoles(name);

    res.status(200).json({ success: true, data: roles });
});
