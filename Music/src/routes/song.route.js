import express from "express";
import {
  addSong,
  getSong,
  getSongById,
  deleteSong,
  searchSong,
  createArtistPlayList,
  getArtistPlayList,
  getArtistPlayListById,
  deleteArtistPlayList,
  addSongToArtistPlayList,
  removeSongToArtistPlayList,
  createUserPlayList,
  getUserPlayList,
  getUserPlayListById,
  deleteUserPlayList,
  addSongToUserPlayList,
  removeSongToUserPlayList,
} from "../controllers/song.controller.js";
import upload from "../utils/multer.js";
import {
  authenticateArtist,
  authenticateUser,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/addSong",
  authenticateArtist,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  addSong,
);
router.get("/getSongs", getSong);
router.get("/getSongById", getSongById);
router.delete("/deleteSong/:id", authenticateArtist, deleteSong);
router.get("/search", searchSong);

// Artist
router.post("/createArtistPlayList", authenticateArtist, createArtistPlayList);
router.get("/getArtistPlayList", authenticateArtist, getArtistPlayList);
router.get(
  "/getArtistPlayListById/:id",
  authenticateArtist,
  getArtistPlayListById,
);
router.delete(
  "/deleteArtistPlayList/:id",
  authenticateArtist,
  deleteArtistPlayList,
);
router.post(
  "/addSongToArtistPlayList/:playListId",
  authenticateArtist,
  addSongToArtistPlayList,
);
router.post(
  "/removeSongToArtistPlayList/:playListId",
  authenticateArtist,
  removeSongToArtistPlayList,
);

// User
router.post("/createUserPlayList", authenticateUser, createUserPlayList);
router.get("/getUserPlayList", authenticateUser, getUserPlayList);
router.get("/getUserPlayListById/:id", authenticateUser, getUserPlayListById);
router.delete("/deleteUserPlayList/:id", authenticateUser, deleteUserPlayList);
router.post(
  "/addSongToUserPlayList/:playListId",
  authenticateUser,
  addSongToUserPlayList,
);
router.post(
  "/removeSongToUserPlayList/:playListId",
  authenticateUser,
  removeSongToUserPlayList,
);

export default router;
