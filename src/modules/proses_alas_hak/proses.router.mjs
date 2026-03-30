import express from "express";
import {
    addClient,
    createProsesAlasHak,
    getAllProsesAlasHak,
    getByNoSurat,
    getClientRoles,
    getProsesAlasHak,
    removeClient,
    removeProsesAlasHak,
    searchByDate,
    update,
    updateClient,
} from "./proses.controller.mjs";
import {
    clientRolesValidationRules,
    createProsesValidationRules,
    IDValidationRules,
    nomorSuratValidationRules,
    paginationValidationRules,
    patchProsesValidationRules,
    removeClientRolesValidationRules,
    rolesNameValidationRules,
    searchValidationRules,
} from "./proses.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import * as cache from "../../middlewares/caching.middleware.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...createProsesValidationRules, validate, createProsesAlasHak)
    .get(
        ...paginationValidationRules,
        validate,
        cache.generateCacheKey("proses"),
        cache.cacheMiddleware,
        getAllProsesAlasHak,
    );

router.get(
    "/search",
    ...paginationValidationRules,
    ...searchValidationRules,
    validate,
    cache.generateCacheKey("proses"),
    cache.cacheMiddleware,
    searchByDate,
);
router.get(
    "/no-surat/:value",
    ...nomorSuratValidationRules,
    validate,
    cache.generateCacheKey("proses"),
    cache.cacheMiddleware,
    getByNoSurat,
);

router.get(
    "/roles",
    ...rolesNameValidationRules,
    validate,
    cache.generateCacheKey("proses"),
    getClientRoles,
);

router
    .route("/:id")
    .delete(...IDValidationRules, validate, removeProsesAlasHak)
    .patch(
        ...IDValidationRules,
        ...patchProsesValidationRules,
        validate,
        update,
    )
    .put(...IDValidationRules, ...createProsesValidationRules, validate, update)
    .get(
        ...IDValidationRules,
        validate,
        cache.generateCacheKey("proses"),
        cache.cacheMiddleware,
        getProsesAlasHak,
    );

router
    .route("/:id/clients")
    .post(
        ...IDValidationRules,
        ...clientRolesValidationRules,
        validate,
        addClient,
    )
    .patch(
        ...IDValidationRules,
        ...clientRolesValidationRules,
        validate,
        updateClient,
    );

router
    .route("/:id/clients/:client_id")
    .delete(
        ...IDValidationRules,
        ...removeClientRolesValidationRules,
        validate,
        removeClient,
    );

export default router;
