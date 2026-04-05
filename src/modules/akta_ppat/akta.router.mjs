import express from "express";
import * as rules from "./akta.validator.mjs";
import * as ctrl from "./akta.controller.mjs";
import * as cache from "../../middlewares/caching.middleware.mjs";
import * as mainRules from "../../validator/validation.rules.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { keyBuilder } from "../../utils/cachekeybuilder.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...rules.createAktaValidationRules, validate, ctrl.addAktaPPAT)
    .get(
        ...mainRules.paginationValidationRules,
        validate,
        cache.cachingMiddleware(keyBuilder("akta-ppat")),
        ctrl.getAllAktaPPAT,
    );

router.get(
    "/nomor-akta/:value",
    ...rules.numberAktaValidationRules,
    validate,
    cache.cachingMiddleware(keyBuilder("akta-ppat")),
    ctrl.searchByNomorAkta,
);
router.get(
    "/search",
    ...mainRules.paginationValidationRules,
    ...mainRules.dateRangeValidationRules,
    validate,
    cache.cachingMiddleware(keyBuilder("akta-ppat:list")),
    ctrl.getAktaPPATByDate,
);

router
    .route("/:id")
    .get(
        ...mainRules.IDValidationRules,
        validate,
        cache.cachingMiddleware(keyBuilder("akta-ppat")),
        ctrl.getByID,
    )
    .patch(
        ...mainRules.IDValidationRules,
        ...rules.updateAktaValidationRules,
        validate,
        ctrl.patchAktaPPAT,
    )
    .delete(...mainRules.IDValidationRules, validate, ctrl.removeAktaPPAT);

export { router as default };
