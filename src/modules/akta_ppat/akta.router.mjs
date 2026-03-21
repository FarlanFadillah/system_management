import express from "express";
import {
    createAktaValidationRules,
    numberAktaValidationRules,
    updateAktaValidationRules,
} from "./akta.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import {
    addAktaPPAT,
    getAktaPPATByDate,
    getAllAktaPPAT,
    getByID,
    patchAktaPPAT,
    removeAktaPPAT,
    searchByNomorAkta,
} from "./akta.controller.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import {
    dateRangeValidationRules,
    IDValidationRules,
    paginationValidationRules,
} from "../../validator/validation.rules.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...createAktaValidationRules, validate, addAktaPPAT)
    .get(...paginationValidationRules, validate, getAllAktaPPAT);

router.get(
    "/nomor-akta/:value",
    ...numberAktaValidationRules,
    validate,
    searchByNomorAkta,
);
router.get(
    "/search",
    ...paginationValidationRules,
    ...dateRangeValidationRules,
    validate,
    getAktaPPATByDate,
);

router
    .route("/:id")
    .get(...IDValidationRules, validate, getByID)
    .patch(
        ...IDValidationRules,
        ...updateAktaValidationRules,
        validate,
        patchAktaPPAT,
    )
    .delete(...IDValidationRules, validate, removeAktaPPAT);

export { router as default };
