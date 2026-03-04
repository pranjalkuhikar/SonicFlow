import express from "express";
import {
  createSong,
  getSong,
  deleteSong,
} from "../controllers/song.controller.js";

const router = express.Router();

router.post("/createSong", createSong);
router.get("/getSong", getSong);
router.delete("/deleteSong", deleteSong);

export default router;
