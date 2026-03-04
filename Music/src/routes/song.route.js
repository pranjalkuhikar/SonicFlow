import express from "express";
import {
  addSong,
  getSong,
  deleteSong,
} from "../controllers/song.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post(
  "/addSong",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  addSong,
);
router.get("/getSong", getSong);
router.delete("/deleteSong/:id", deleteSong);

export default router;
