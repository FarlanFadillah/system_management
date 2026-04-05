import { asyncHandler } from "../utils/asyncHandler.mjs";
import { ExpressError } from "../utils/custom.error.mjs";

export const adminAuthorization = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "superuser")
        return next(
            new ExpressError(
                "Unauthorized access, only admins can access this endpoint",
                403,
            ),
        );
    next();
});

export const superUserAuthorization = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "superuser")
        return next(
            new ExpressError(
                "Unauthorized access, only superuser can access this endpoint",
                403,
            ),
        );
    next();
});
