import express from "express";
import {
    createAktaValidationRules,
    updateAktaValidationRules,
} from "./akta.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import {
    addAktaPPAT,
    getAktaPPATByDate,
    getAllAktaPPAT,
    patchAktaPPAT,
    removeAktaPPAT,
    searchByNomorAkta,
} from "./akta.controller.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...createAktaValidationRules, validate, addAktaPPAT)
    .get(getAllAktaPPAT);

router.get("/nomor-akta/:value", searchByNomorAkta);
router.get("/search", getAktaPPATByDate);

router
    .route("/:id")
    .patch(...updateAktaValidationRules, validate, patchAktaPPAT)
    .delete(removeAktaPPAT);

export { router as default };
