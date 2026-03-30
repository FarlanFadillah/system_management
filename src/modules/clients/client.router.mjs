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
import * as cache from "../../middlewares/caching.middleware.mjs";

const router = express.Router();
router.use(validateToken);

router
    .route("/")
    .post(...createClientValidationRules, validate, addClient)
    .get(
        ...paginationValidationRules,
        validate,
        cache.generateCacheKey("clients"),
        cache.cacheMiddleware,
        getAllClientsLimitOffset,
    );

router.get(
    "/search",
    ...paginationValidationRules,
    ...searchValidationRules,
    validate,
    cache.generateCacheKey("clients"),
    cache.cacheMiddleware,
    searchClient,
);

router
    .route("/:id")
    .get(
        ...IDValidationRules,
        validate,
        cache.generateCacheKey("clients"),
        cache.cacheMiddleware,
        getClient,
    )
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
        cache.generateCacheKey("clients"),
        cache.cacheMiddleware,
        getAlasHak,
    );

export { router as default };
