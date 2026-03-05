import express from "express";
import {
  addSong,
  getSong,
  getSongById,
  deleteSong,
  searchSong,
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
router.get("/getSongById", getSongById);
router.delete("/deleteSong/:id", authenticate, deleteSong);
router.get("/search", searchSong);

export default router;
