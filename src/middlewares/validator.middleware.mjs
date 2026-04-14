import { matchedData, validationResult } from "express-validator";
import { ExpressError } from "../utils/custom.error.mjs";

export function validate(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        console.log("[REQUEST VALID]");
        req.matchedData = matchedData(req);
        return next();
    }

    const errors = {};
    result.errors.map((data) => (errors[data.path] = data.msg));

    res.status(422).json({ status: false, msg: "validation failed", errors });
}
