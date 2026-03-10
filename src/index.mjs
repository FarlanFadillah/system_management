import dotenv from "dotenv";
dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});
console.log(process.env.NODE_ENV);
import express from "express";
import morgan from "morgan";
import cors from "cors";

// routes
import authRouter from "./modules/auth/auth.router.mjs";
import addressRouter from "./modules/address/address.router.mjs";
import clientsRouter from "./modules/clients/client.router.mjs";
import alasHakRouter from "./modules/alas_hak/alas_hak.router.mjs";
import prosesRouter from "./modules/proses_alas_hak/proses.router.mjs";
import aktaRouter from "./modules/akta_ppat/akta.router.mjs";

// middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.mjs";

const app = express();

app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/clients", clientsRouter);
app.use("/api/v1/alas-hak", alasHakRouter);
app.use("/api/v1/proses", prosesRouter);
app.use("/api/v1/akta-ppat", aktaRouter);
app.use(globalErrorHandler);

app.listen(process.env.PORT, (error) => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
