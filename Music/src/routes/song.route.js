import express from "express";
import { createSong } from "../controllers/song.controller.js";

const router = express.Router();

router.post("/song", createSong);

export default router;
