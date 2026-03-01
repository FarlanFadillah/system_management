import express from "express";
import { createProsesAlasHak } from "./proses.controller.mjs";
import { createProsesValidationRules } from "./proses.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";

const router = express.Router();

router
    .route("/")
    .post(...createProsesValidationRules, validate, createProsesAlasHak);

export default router;
