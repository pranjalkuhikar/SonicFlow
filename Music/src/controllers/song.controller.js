import Song from "../models/song.model.js";
import { uploadToImageKit } from "../utils/imageKit.js";

export const addSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.coverImage || !req.files?.audioFile) {
      return res.status(400).json({ message: "Files are required" });
    }

    const coverImageUrl = await uploadToImageKit(
      req.files.coverImage[0],
      "songs/covers",
    );
    const audioFileUrl = await uploadToImageKit(
      req.files.audioFile[0],
      "songs/audios",
    );

    const songData = new Song({
      title,
      artist,
      coverImage: coverImageUrl.url,
      audioFile: audioFileUrl.url,
    });
    await songData.save();

    res.status(201).json({ message: "Song added successfully", songData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getSong = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json({ songs });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.body;
    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
