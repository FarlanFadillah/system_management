import express from "express";
import {
    addAlasHak,
    addAlasHakOwner,
    getAlasHak,
    getAlasHakOwners,
    getAllAlasHak,
    removeAlasHak,
    removeAlasHakOwners,
    searchAlasHak,
    updateAlasHak,
} from "./alas_hak.controller.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import {
    addAlasHakOwnerValidationRules,
    addAlasHakValidationRules,
    IDValidatorRules,
    paginationValidationRules,
    removeAlasHakOwnerValidationRules,
    searchAlasHakValidationRules,
    updateAlasHakValidationRules,
} from "./alas_hak.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import * as cache from "../../middlewares/caching.middleware.mjs";

const router = express.Router();

router.use(validateToken);

router
    .route("/")
    .post(...addAlasHakValidationRules, validate, addAlasHak)
    .get(
        ...paginationValidationRules,
        validate,
        cache.generateCacheKey("alas-hak"),
        cache.cacheMiddleware,
        getAllAlasHak,
    );

router.get(
    "/search",
    ...searchAlasHakValidationRules,
    ...paginationValidationRules,
    cache.generateCacheKey("alas-hak"),
    cache.cacheMiddleware,
    validate,
    searchAlasHak,
);

router
    .route("/:id")
    .patch(
        ...IDValidatorRules,
        ...updateAlasHakValidationRules,
        validate,
        updateAlasHak,
    )
    .put(
        ...IDValidatorRules,
        ...addAlasHakValidationRules,
        validate,
        updateAlasHak,
    )
    .delete(...IDValidatorRules, validate, removeAlasHak)
    .get(
        ...IDValidatorRules,
        validate,
        cache.generateCacheKey("alas-hak"),
        cache.cacheMiddleware,
        getAlasHak,
    );

router
    .route("/:id/owners")
    .post(
        ...IDValidatorRules,
        ...addAlasHakOwnerValidationRules,
        validate,
        addAlasHakOwner,
    )
    .get(
        ...IDValidatorRules,
        validate,
        cache.generateCacheKey("alas-hak"),
        cache.cacheMiddleware,
        getAlasHakOwners,
    );

router
    .route("/:id/owners/:client_id")
    .delete(
        ...removeAlasHakOwnerValidationRules,
        validate,
        removeAlasHakOwners,
    );

export { router as default };
