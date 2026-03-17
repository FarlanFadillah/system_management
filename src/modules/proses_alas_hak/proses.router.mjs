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
    patchProsesValidationRules,
    removeClientRolesValidationRules,
} from "./proses.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";

const router = express.Router();

router.use(validateToken);
router
    .route("/")
    .post(...createProsesValidationRules, validate, createProsesAlasHak)
    .get(getAllProsesAlasHak);

router.get("/search", searchByDate);
router.get("/no-surat/:value", getByNoSurat);

router.get("/roles", getClientRoles);

router
    .route("/:id/clients")
    .post(...clientRolesValidationRules, validate, addClient)
    .delete(...removeClientRolesValidationRules, validate, removeClient)
    .patch(...clientRolesValidationRules, validate, updateClient);

router
    .route("/:id")
    .delete(removeProsesAlasHak)
    .patch(...patchProsesValidationRules, validate, update)
    .put(...createProsesValidationRules, validate, update)
    .get(getProsesAlasHak);

export default router;
