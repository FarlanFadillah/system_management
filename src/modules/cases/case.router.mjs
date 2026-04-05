import express from "express";
import * as ctrl from "./case.controller.mjs";
import * as rules from "./case.validator.mjs";
import * as mainRules from "../../validator/validation.rules.mjs";
import * as cache from "../../middlewares/caching.middleware.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import { keyBuilder } from "../../utils/cachekeybuilder.mjs";
import { pagination } from "../../middlewares/pagination.middleware.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...rules.createProsesValidationRules, validate, ctrl.createCase)
    .get(
        ...mainRules.paginationValidationRules,
        validate,
        pagination,
        cache.cachingMiddleware(keyBuilder("cases")),
        ctrl.getAllCases,
    );

router.get(
    "/search",
    ...mainRules.paginationValidationRules,
    ...rules.searchValidationRules,
    validate,
    cache.cachingMiddleware(keyBuilder("cases")),
    ctrl.searchByDate,
);
router.get(
    "/case-num/:value",
    ...rules.nomorSuratValidationRules,
    validate,
    cache.cachingMiddleware(keyBuilder("cases")),
    ctrl.getByNoSurat,
);

router.get(
    "/roles",
    cache.cachingMiddleware(keyBuilder("cases")),
    ctrl.getRoles,
);

router
    .route("/:id")
    .delete(...mainRules.IDValidationRules, validate, ctrl.removeCase)
    .patch(
        ...mainRules.IDValidationRules,
        ...rules.patchProsesValidationRules,
        validate,
        ctrl.updateCase,
    )
    .put(
        ...mainRules.IDValidationRules,
        ...rules.createProsesValidationRules,
        validate,
        ctrl.updateCase,
    )
    .get(
        ...mainRules.IDValidationRules,
        validate,
        cache.cachingMiddleware(keyBuilder("cases")),
        ctrl.getCase,
    );

router
    .route("/:id/steps")
    .patch(
        ...rules.stepsValidationRules,
        ...mainRules.IDValidationRules,
        validate,
        ctrl.updateStep,
    );

router
    .route("/:id/clients")
    .post(
        ...mainRules.IDValidationRules,
        ...rules.clientRolesValidationRules,
        validate,
        ctrl.addClient,
    )
    .patch(
        ...mainRules.IDValidationRules,
        ...rules.clientRolesValidationRules,
        validate,
        ctrl.updateClient,
    );

router
    .route("/:id/clients/:client_id")
    .delete(
        ...mainRules.IDValidationRules,
        ...rules.removeClientRolesValidationRules,
        validate,
        ctrl.removeClient,
    );

export default router;
