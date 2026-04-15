import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as casesService from "./case.service.mjs";

export const createCase = asyncHandler(async (req, res, next) => {
    const id = await casesService.create(req.matchedData);

    res.status(200).json({
        success: true,
        msg: "Proses Alas Hak added Successfully",
        data: {
            id,
        },
    });
});

export const updateCase = asyncHandler(async (req, res, next) => {
    const { id, ...data } = req.matchedData;
    await casesService.update(id, data);

    res.status(200).json({
        status: true,
        msg: "Proses Alas Hak updated successfully",
    });
});

export const removeCase = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;
    await casesService.remove(id);
    res.status(200).json({
        success: true,
        msg: "Proses Alas Hak remove successfully",
    });
});

export const getCase = asyncHandler(async (req, res, next) => {
    const { id } = req.matchedData;
    const data = await casesService.get(id);
    res.status(200).json({
        success: true,
        data,
    });
});

export const updateStep = asyncHandler(async (req, res, next) => {
    const { id, status } = req.matchedData;

    await casesService.updateCaseStep(id, status);

    res.status(200).json({
        success: true,
        msg: "Case updated successfully",
    });
});

export const nextStep = asyncHandler(async (req, res, next) => {
    const { id, ...data } = req.matchedData;
    await casesService.nextStep(id, data);

    res.status(200).json({
        success: true,
        msg: "Case is processed to the next step",
    });
});

export const addClient = asyncHandler(async (req, res, next) => {
    const { id, clients_id, roles_id } = req.matchedData;
    const { result } = await casesService.addClientAndRoles(
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

    await casesService.removeClientAndRoles(id, client_id);
    res.status(200).json({
        success: true,
        msg: "Client - Roles relations processed",
    });
});

export const updateClient = asyncHandler(async (req, res, next) => {
    const { id, clients_id, roles_id } = req.matchedData;
    await casesService.updateClientRoles(id, clients_id, roles_id);
    res.status(200).json({
        success: true,
        msg: "Client and Roles updated successfully",
    });
});

export const getAllCases = asyncHandler(async (req, res, next) => {
    const { currentpage, limit } = req.matchedData;

    const { data, _metadata } = await casesService.getAll(
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
    const { currentpage, limit, from, to, code = null } = req.matchedData;
    const { data, _metadata } = await casesService.getFilteredCases(
        Number(currentpage),
        Number(limit),
        { from, to, code },
    );
    res.status(200).json({
        success: true,
        _metadata,
        data,
    });
});

export const getRoles = asyncHandler(async (req, res, next) => {
    const roles = await casesService.getRoles();
    res.status(200).json({ success: true, data: roles });
});
