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
        cache.cachingMiddleware(keyBuilder("cases:list")),
        ctrl.getAllCases,
    );

router.get(
    "/search",
    ...mainRules.paginationValidationRules,
    ...rules.searchValidationRules,
    validate,
    cache.cachingMiddleware(keyBuilder("cases:list")),
    ctrl.searchByDate,
);

router.get(
    "/roles",
    cache.cachingMiddleware(keyBuilder("cases")),
    ctrl.getRoles,
);

router
    .route("/:id/steps/next")
    .post(...mainRules.IDValidationRules, validate, ctrl.nextStep);
router
    .route("/:id/steps/validate")
    .post(
        ...mainRules.IDValidationRules,
        ...rules.stepValidationRules,
        validate,
        ctrl.validateStep,
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
