import express from "express";
import {
    addClient,
    deleteClient,
    updateClientData,
    searchClient,
    getAllClients,
    getClient,
    getAlasHak,
    getAllClientsLimitOffset,
} from "./client.controller.mjs";
import {
    patchClientValidationRules,
    createClientValidationRules,
    paginationValidationRules,
    IDValidationRules,
    searchValidationRules,
} from "./client.validator.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";

const router = express.Router();
router.use(validateToken);

router
    .route("/")
    .post(...createClientValidationRules, validate, addClient)
    .get(...paginationValidationRules, validate, getAllClientsLimitOffset);

router.get(
    "/search",
    ...paginationValidationRules,
    ...searchValidationRules,
    validate,
    searchClient,
);

router
    .route("/:id")
    .get(...IDValidationRules, validate, getClient)
    .delete(...IDValidationRules, validate, deleteClient)
    .patch(
        ...IDValidationRules,
        ...patchClientValidationRules,
        validate,
        updateClientData,
    )
    .put(
        ...IDValidationRules,
        ...createClientValidationRules,
        validate,
        updateClientData,
    );
router
    .route("/:id/alas-hak")
    .get(
        ...IDValidationRules,
        ...paginationValidationRules,
        validate,
        getAlasHak,
    );

export { router as default };
