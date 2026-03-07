import * as jwtHelper from "../helper/jwt.helper.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { ExpressError } from "../utils/custom.error.mjs";

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 */
export const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return next(
            new ExpressError(
                "Unauthorized, please provide the authorization headers",
                401,
            ),
        );
    const { decoded, user } = await jwtHelper.verifyUser(
        authHeader.split(" ")[1],
    );
    console.log("[TOKEN VALID]");
    req.user = decoded;
    req.user.role = user.role;
    next();
});
