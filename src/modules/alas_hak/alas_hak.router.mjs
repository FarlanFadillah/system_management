import express from "express";
import * as ctrl from "./alas_hak.controller.mjs";
import * as rules from "./alas_hak.validator.mjs";

import * as mainRules from "../../validator/validation.rules.mjs";
import * as cache from "../../middlewares/caching.middleware.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { pagination } from "../../middlewares/pagination.middleware.mjs";
import { keyBuilder } from "../../utils/cachekeybuilder.mjs";

const router = express.Router();

router.use(validateToken);

router
    .route("/")
    .post(...rules.addAlasHakValidationRules, validate, ctrl.addAlasHak)
    .get(
        ...mainRules.paginationValidationRules,
        validate,
        pagination,
        cache.cachingMiddleware(keyBuilder("alas-hak:list")),
        ctrl.getAllAlasHak,
    );

router.get(
    "/search",
    ...rules.searchAlasHakValidationRules,
    ...mainRules.paginationValidationRules,
    validate,
    pagination,
    cache.cachingMiddleware(keyBuilder("alas-hak:list")),
    ctrl.searchAlasHak,
);

router
    .route("/:id")
    .patch(
        ...mainRules.IDValidationRules,
        ...rules.updateAlasHakValidationRules,
        validate,
        ctrl.updateAlasHak,
    )
    .put(
        ...mainRules.IDValidationRules,
        ...rules.addAlasHakValidationRules,
        validate,
        ctrl.updateAlasHak,
    )
    .delete(...mainRules.IDValidationRules, validate, ctrl.removeAlasHak)
    .get(
        ...mainRules.IDValidationRules,
        validate,
        cache.cachingMiddleware(keyBuilder("alas-hak")),
        ctrl.getAlasHak,
    );

router
    .route("/:id/owners")
    .post(
        ...mainRules.IDValidationRules,
        ...rules.addAlasHakOwnerValidationRules,
        validate,
        ctrl.addAlasHakOwner,
    )
    .get(
        ...mainRules.IDValidationRules,
        validate,
        cache.cachingMiddleware(keyBuilder("alas-hak:clients")),
        ctrl.getAlasHakOwners,
    );

router
    .route("/:id/owners/:client_id")
    .delete(
        ...rules.removeAlasHakOwnerValidationRules,
        validate,
        ctrl.removeAlasHakOwners,
    );

export { router as default };
