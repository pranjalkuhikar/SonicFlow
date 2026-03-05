import express from "express";
import {
  addSong,
  getSong,
  deleteSong,
} from "../controllers/song.controller.js";
import upload from "../utils/multer.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/addSong",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  addSong,
);
router.get("/getSongs", getSong);
router.delete("/deleteSong/:id", authenticate, deleteSong);

export default router;
