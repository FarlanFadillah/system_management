import dotenv from "dotenv";
import process from "process";

dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

console.log("ENV LOADED");
