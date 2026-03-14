import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as addressService from "./address.service.mjs";

export const getKelurahan = asyncHandler(async (req, res, next) => {
    const { currentpage, name, limit } = req.query;
    if (!name)
        return next(new ExpressError("please provide the name of the address"));
    if (isNaN(currentpage))
        return next(new ExpressError("Invalid currentpage value"));
    const kelurahan = await addressService.getKelurahan(
        name,
        Number(limit),
        Number(currentpage),
    );
    res.status(200).json({ success: true, address: kelurahan });
});
