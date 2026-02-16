import { matchedData, validationResult } from "express-validator";

export function validate(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    const errors = {};
    result.errors.map((data) => (errors[data.path] = data.msg));

    res.status(200).json({ status: false, msg: "validation failed", errors });
}
