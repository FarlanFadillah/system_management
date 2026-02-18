import express from "express";
import { getKelurahan } from "./address.controller.mjs";

const router = express.Router();

router.get("/kel", getKelurahan);

export { router as default };
