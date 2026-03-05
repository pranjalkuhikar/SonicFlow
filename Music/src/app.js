import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import indexRoute from "./routes/index.route.js";
import config from "./configs/config.js";

const app = express();

app.use(express.urlencoded({ extends: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({ origin: config.Frontend_URL, credentials: true }));
app.use("/api", indexRoute);

export default app;
