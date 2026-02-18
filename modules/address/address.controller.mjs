import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import * as addressService from "./address.service.mjs";

export const getKelurahan = asyncHandler(async (req, res, next) => {
    const { currentpage, name } = req.query;
    if (!name)
        return next(new ExpressError("please provide the name of the address"));
    else if (!currentpage)
        return next(new ExpressError("currentpage is empty"));

    const kelurahan = await addressService.getKelurahan(
        name,
        process.env.PAGINATION_LIMIT,
        currentpage,
    );
    res.status(200).json({ success: true, address: kelurahan });
});
