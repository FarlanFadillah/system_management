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

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...createProsesValidationRules, validate, createProsesAlasHak)
    .get(...paginationValidationRules, validate, getAllProsesAlasHak);

router.get(
    "/search",
    ...paginationValidationRules,
    ...searchValidationRules,
    validate,
    searchByDate,
);
router.get(
    "/no-surat/:value",
    ...nomorSuratValidationRules,
    validate,
    getByNoSurat,
);

router.get("/roles", ...rolesNameValidationRules, validate, getClientRoles);

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
    .get(...IDValidationRules, validate, getProsesAlasHak);

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
