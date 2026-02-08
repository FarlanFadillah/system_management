import express from "express";
import {login, register} from "./auth.controller.mjs"
import { authLimiter } from "../../middlewares/ratelimiter.middleware.mjs";

const router = express.Router();

router.route("/register")
.post(authLimiter, register);

router.route("/login")
.post(authLimiter, login);

export {router as default}