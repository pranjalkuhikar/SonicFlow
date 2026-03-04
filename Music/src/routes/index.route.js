import express from "express";
import songRouter from "./song.route.js";

const router = express.Router();

router.use("/song", songRouter);

export default router;
