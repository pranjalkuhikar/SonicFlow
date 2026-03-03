import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/index.route.js";
import config from "./configs/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: config.Frontend_URL,
    credentials: true,
  }),
);
app.use("/api", indexRoute);

export default app;
