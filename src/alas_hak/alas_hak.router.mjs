import express from "express";
import {
    addAlasHak,
    removeAlasHak,
    searchAlasHak,
    updateAlasHak,
} from "./alas_hak.controller.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import {
    addAlasHakValidationRules,
    updateAlasHakValidationRules,
} from "./alas_hak.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";

const router = express.Router();

router.use(validateToken);

router
    .route("/")
    .post(...addAlasHakValidationRules, validate, addAlasHak)
    .get(searchAlasHak);

router
    .route("/:id")
    .patch(...updateAlasHakValidationRules, validate, updateAlasHak)
    .delete(removeAlasHak);

export { router as default };
