import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";

import apiRouter from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", apiRouter);

export default app;