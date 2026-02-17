import express from "express";
import { deleteUser, login, register, updateUser } from "./auth.controller.mjs";
import { authLimiter } from "../../middlewares/ratelimiter.middleware.mjs";
import {
    registerValidationRules,
    loginValidationRules,
} from "./auth.validator.mjs";
import { validate } from "../../middlewares/validator.middleware.mjs";
import { validateToken } from "../../middlewares/jwt.middleware.mjs";
import {
    adminAuthorization,
    superUserAuthorization,
} from "../../middlewares/authorization.middleware.mjs";

const router = express.Router();

router
    .route("/login")
    .post(...loginValidationRules, validate, authLimiter, login);

router
    .route("/register")
    .post(
        validateToken,
        adminAuthorization,
        ...registerValidationRules,
        validate,
        authLimiter,
        register,
    );

router
    .route("/:id")
    .patch(...registerValidationRules, validate, updateUser)
    .delete(validateToken, superUserAuthorization, deleteUser);

export { router as default };
