import dotenv from "dotenv";
import process from "process";
import createDebug from "debug";
const debug = createDebug("app:utils:env");

dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

debug("ENV LOADED");
