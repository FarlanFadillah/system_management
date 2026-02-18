import { matchedData } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as authService from "./auth.service.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";

export const register = asyncHandler(async (req, res, next) => {
    await authService.registerUser(req.matchedData);
    res.json({ success: true, msg: "User created" });
});

export const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.matchedData;

    const match = await authService.verifyPassword(username, password);
    if (!match) return next(new ExpressError("Password missmatch", 400));

    const token = await authService.generateToken({ username });

    res.json({ success: true, token });
});

export const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Invalid id", 400));
    await authService.updateUser(id, req.matchedData);
    res.status(200).json({ success: true, msg: "User updated successfully" });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ExpressError("Invalid id", 400));
    await authService.deleteUser(id, req.user.username);
    res.status(200).json({ success: true, msg: "User deleted successfully" });
});
