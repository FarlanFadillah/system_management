import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as authService from "./auth.service.mjs";

export const register =  asyncHandler(async(req, res, next)=>{
    const {username, password} = req.body;
    if(!username || !password) return next(new Error("Please provide username and password"));
    await authService.registerUser({username}, password);
    
    res.json({success : true, msg : "User created"});
})

export const login = asyncHandler(async(req, res, next)=>{
    const {username, password} = req.body;
    if(!username || !password) return next(new Error("Please provide username and password"));

    const match = await authService.verifyPassword(username, password);
    if(!match) return next(new Error("Password missmatch"));

    const token = await authService.generateToken({username});

    res.json({success : true, token});
})