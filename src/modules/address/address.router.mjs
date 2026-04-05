import express from "express";
import * as ctrl from "./address.controller.mjs";

const router = express.Router();

router.get("/kel", ctrl.getKelurahan);

router.get("/list/kel", ctrl.getAllKelurahan);
router.get("/list/kec", ctrl.getAllKecamatan);
router.get("/list/kab", ctrl.getAllKabupaten);
router.get("/list/prov", ctrl.getAllProvinsi);

export { router as default };
