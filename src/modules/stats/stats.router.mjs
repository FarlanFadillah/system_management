import express from "express";
import * as ctrl from "./stats.controller.mjs";
import * as cache from "../../middlewares/caching.middleware.mjs";
import { keyBuilder } from "../../utils/cachekeybuilder.mjs";
const router = express.Router();

router.get(
    "/",
    cache.cachingMiddleware(
        keyBuilder("stats:clients:cases:alas-hak:akta-ppat"),
    ),
    ctrl.getStats,
);

export { router as default };
