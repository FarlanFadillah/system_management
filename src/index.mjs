import "../env.mjs";
import express from "express";
import morgan from "morgan";
import cors from "cors";

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

const PORT = process.env.PORT || 3030;

// routes
import authRouter from "./modules/auth/auth.router.mjs";
import addressRouter from "./modules/address/address.router.mjs";
import clientsRouter from "./modules/clients/client.router.mjs";
import alasHakRouter from "./modules/alas_hak/alas_hak.router.mjs";
import casesRouter from "./modules/cases/case.router.mjs";
import aktaRouter from "./modules/akta_ppat/akta.router.mjs";
import statsRouter from "./modules/stats/stats.router.mjs";

// middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.mjs";

const app = express();
app.set("etag", false);

app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/clients", clientsRouter);
app.use("/api/v1/alas-hak", alasHakRouter);
app.use("/api/v1/cases", casesRouter);
app.use("/api/v1/akta-ppat", aktaRouter);
app.use("/api/v1/stats", statsRouter);

app.use(globalErrorHandler);

const server = app.listen(PORT, (error) => {
    if (error) console.log(error);
    else console.log(`Server listening on http://localhost:${PORT}`);
});

// proper server shutdown function
function shutdown() {
    console.log("Shuting down server...");
    server.close((err) => {
        if (err) console.log(err);
        console.log("Server closed");
        process.exit(0);
    });
}

// signal interupt
process.on("SIGINT", shutdown);
// signal terminate
process.on("SIGTERM", shutdown);
// signal user defined
process.on("SIGUSR2", shutdown);
