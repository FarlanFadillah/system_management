import express from "express";
import {
    createProsesAlasHak,
    getAllProsesAlasHak,
    getByNoSurat,
    getProsesAlasHak,
    removeProsesAlasHak,
    searchByDate,
    update,
} from "./proses.controller.mjs";
import {
    createProsesValidationRules,
    patchProsesValidationRules,
} from "./proses.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...createProsesValidationRules, validate, createProsesAlasHak)
    .get(getAllProsesAlasHak);

router.get("/search", searchByDate);
router.get("/no-surat/:value", getByNoSurat);

router
    .route("/:id")
    .delete(removeProsesAlasHak)
    .patch(...patchProsesValidationRules, validate, update)
    .put(...createProsesValidationRules, validate, update)
    .get(getProsesAlasHak);

export default router;
