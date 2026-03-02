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

const router = express.Router();

router
    .route("/")
    .post(...createProsesValidationRules, validate, createProsesAlasHak)
    .get(getAllProsesAlasHak);

router.get("/search", searchByDate);

router
    .route("/:id")
    .delete(removeProsesAlasHak)
    .patch(...patchProsesValidationRules, validate, update)
    .put(...createProsesValidationRules, validate, update)
    .get(getProsesAlasHak);

router.get("/no-surat/:value", getByNoSurat);

export default router;
