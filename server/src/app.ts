import express from "express";
import cors from "cors";
import morgan from "morgan";

import apiRouter from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", apiRouter);

export default app;