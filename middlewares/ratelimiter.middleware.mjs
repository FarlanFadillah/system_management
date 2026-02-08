import {rateLimit} from "express-rate-limit";

export const authLimiter = rateLimit({
    limit : 5, 
    windowMs : 60000 * 15,
    message : "Too many attempts, please try again later!",
    handler : (req, res, next, options)=>{
        res.status(400).json({success : false, msg : options.message});
    }
})