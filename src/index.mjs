import "../env.mjs";
import express from "express";
import morgan from "morgan";
import cors from "cors";

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

const PORT = process.env.PORT || 3030;

import routerV1 from "./routes.mjs";

// middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.mjs";

const app = express();
app.set("etag", false);

app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1", routerV1);

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
