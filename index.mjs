import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// routes
import authRouter from "./src/auth/auth.router.mjs";

// middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.mjs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

app.listen(process.env.PORT, (error)=>{
    console.log("Server listening on http://localhost:3000");
})