import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// routes
import authRouter from "./modules/auth/auth.router.mjs";
import addressRouter from "./modules/address/address.router.mjs";
import clientsRouter from "./modules/client/client.router.mjs";
import alasHakRouter from "./modules/alas_hak/alas_hak.router.mjs";

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

app.use(globalErrorHandler);

app.listen(process.env.PORT, (error) => {
    console.log("Server listening on http://localhost:3000");
});
