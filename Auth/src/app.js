import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/index.route.js";

const app = express();

app.use(express.urlencoded({ extends: true }));
app.use(express.json());

app.use(cookieParser());
app.use(cors("*"));
app.use("/api", indexRoute);

export default app;
