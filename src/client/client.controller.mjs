import { matchedData } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.mjs";


const addClient = asyncHandler(async (req, res, next)=>{
    const validate = matchedData(req);
    res.json({success : true});
})