import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as prosesService from "./proses.service.mjs";

export const createProsesAlasHak = asyncHandler(async (req, res, next) => {
    const id = await prosesService.create(req.matchedData);

    res.status(200).json({
        success: true,
        msg: "Proses Alas Hak added Successfully",
        data: {
            id,
        },
    });
});

export const update = asyncHandler(async (req, res, next) => {
    const { id, ...data } = req.matchedData;
    await prosesService.update(id, data);

    res.status(200).json({
        status: true,
        msg: "Proses Alas Hak updated successfully",
    });
});

export const removeProsesAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;
    await prosesService.remove(id);
    res.status(200).json({
        success: true,
        msg: "Proses Alas Hak remove successfully",
    });
});

export const getProsesAlasHak = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;
    const data = await prosesService.get(id);
    res.status(200).json({
        success: true,
        data,
    });
});

export const addClient = asyncHandler(async (req, res, next) => {
    const { id, clients_id, roles_id } = req.matchedData;
    const { result } = await prosesService.addClientAndRoles(
        id,
        clients_id,
        roles_id,
    );

    res.status(200).json({
        success: true,
        msg: "Client and Roles added succesfully",
        data: result,
    });
});

export const removeClient = asyncHandler(async (req, res, next) => {
    const { id, client_id } = req.matchedData;

    await prosesService.removeClientAndRoles(id, client_id);
    res.status(200).json({
        success: true,
        msg: "Client - Roles relations processed",
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

export const getAllProsesAlasHak = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.matchedData;

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
    const { currentpage, limit, from, to, number = null } = req.matchedData;
    const { data, _metadata } = await prosesService.search(
        from,
        to,
        number,
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
    const { name } = req.matchedData;
    const roles = await prosesService.getClientRoles(name);

    res.status(200).json({ success: true, data: roles });
});
