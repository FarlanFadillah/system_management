import express from "express";
import {
    addClient,
    deleteClient,
    updateClientData,
    searchClient,
} from "./client.controller.mjs";
import {
    patchClientValidationRules,
    createClientValidationRules,
} from "./client.validator.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";

const router = express.Router();
router.use(validateToken);

router
    .route("/")
    .post(...createClientValidationRules, validate, addClient)
    .get(searchClient);

router
    .route("/:id")
    .delete(deleteClient)
    .patch(...patchClientValidationRules, validate, updateClientData)
    .put(...createClientValidationRules, validate, updateClientData);

export { router as default };
