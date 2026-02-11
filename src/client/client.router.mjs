import express from "express";
import { addClient } from "./client.service.mjs";
import {clientValidation} from "./client.validator.mjs"
import { validatorErrorHandler } from "../../utils/validator.mjs";

const router = express.Router();

router.route("/")
    .post(...clientValidation, validatorErrorHandler, addClient)



export {router as default}