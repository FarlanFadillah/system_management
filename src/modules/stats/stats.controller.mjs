import { asyncHandler } from "../../utils/asyncHandler.mjs";
import * as statsService from "./stats.service.mjs";
export const getStats = asyncHandler(async (req, res, next) => {
    const { data, result } = await statsService.getStats();

    res.status(200).json({
        success: true,
        count: result,
        data,
    });
});
