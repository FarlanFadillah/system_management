import express from "express";
import {
    addAlasHak,
    addAlasHakOwner,
    getAlasHak,
    getAllAlasHak,
    removeAlasHak,
    searchAlasHak,
    updateAlasHak,
} from "./alas_hak.controller.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import {
    addAlasHakOwnerValidationRules,
    addAlasHakValidationRules,
    updateAlasHakValidationRules,
} from "./alas_hak.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";

const router = express.Router();

router.use(validateToken);

router
    .route("/")
    .post(...addAlasHakValidationRules, validate, addAlasHak)
    .get(getAllAlasHak);

router.get("/search", searchAlasHak);

router
    .route("/:id")
    .patch(...updateAlasHakValidationRules, validate, updateAlasHak)
    .put(...addAlasHakValidationRules, validate, updateAlasHak)
    .delete(removeAlasHak)
    .get(getAlasHak);

router.post(
    "/:id/owners",
    addAlasHakOwnerValidationRules,
    validate,
    addAlasHakOwner,
);

export { router as default };
