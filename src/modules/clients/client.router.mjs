import express from "express";
import * as ctrl from "./client.controller.mjs";
import * as rules from "./client.validator.mjs";
import * as mainRules from "../../shared/validator/validation.rules.mjs";
import * as cache from "../../shared/middlewares/caching.middleware.mjs";
import { validateToken } from "../../shared/middlewares/jwt.middleware.mjs";
import { validate } from "../../shared/middlewares/validator.middleware.mjs";
import { pagination } from "../../shared/middlewares/pagination.middleware.mjs";
import { keyBuilder } from "../../shared/utils/cachekeybuilder.mjs";

const router = express.Router();
router.use(validateToken);

router
    .route("/")
    .post(...rules.createClientValidationRules, validate, ctrl.addClient)
    .get(
        ...mainRules.paginationValidationRules,
        validate,
        pagination,
        cache.cachingMiddleware(keyBuilder("clients:list")),
        ctrl.getAllClientsLimitOffset,
    );

router.get(
    "/search",
    ...mainRules.paginationValidationRules,
    ...rules.searchValidationRules,
    validate,
    pagination,
    cache.cachingMiddleware(keyBuilder("clients:list")),
    ctrl.searchClient,
);

router
    .route("/:id")
    .get(
        ...mainRules.IDValidationRules,
        validate,
        cache.cachingMiddleware(keyBuilder("clients")),
        ctrl.getClient,
    )
    .delete(...mainRules.IDValidationRules, validate, ctrl.deleteClient)
    .patch(
        ...mainRules.IDValidationRules,
        ...rules.patchClientValidationRules,
        validate,
        pagination,
        ctrl.updateClientData,
    )
    .put(
        ...mainRules.IDValidationRules,
        ...rules.createClientValidationRules,
        validate,
        ctrl.updateClientData,
    );
router
    .route("/:id/alas-hak")
    .get(
        ...mainRules.IDValidationRules,
        ...mainRules.paginationValidationRules,
        validate,
        pagination,
        cache.cachingMiddleware(keyBuilder("clients:alas-hak:list")),
        ctrl.getAlasHak,
    );

export default router;
