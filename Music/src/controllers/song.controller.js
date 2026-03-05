import Song from "../models/song.model.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";

export const addSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title?.trim() || !artist?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.coverImage || !req.files?.audioFile) {
      return res.status(400).json({ message: "Files are required" });
    }

    const existingSong = await Song.findOne({ title, artist });
    if (existingSong) {
      return res.status(400).json({ message: "Song already exists" });
    }

    const [coverImageUrl, audioFileUrl] = await Promise.all([
      uploadToImageKit(req.files.coverImage[0], "songs/covers"),
      uploadToImageKit(req.files.audioFile[0], "songs/audios"),
    ]);

    const songData = new Song({
      title,
      artist,
      coverImage: {
        fileId: coverImageUrl.fileId,
        url: coverImageUrl.url,
      },
      audioFile: {
        fileId: audioFileUrl.fileId,
        url: audioFileUrl.url,
      },
    });
    await songData.save();

    res.status(201).json({ message: "Song added successfully", songData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSong = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json({ songs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id?.trim()) {
      return res.status(400).json({ message: "ID is required" });
    }
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json({ song });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    await deleteFromImageKit(song.coverImage.fileId);
    await deleteFromImageKit(song.audioFile.fileId);
    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const searchSong = async (req, res) => {
  const { query } = req.query;
  if (!query?.trim()) {
    return res.status(400).json({ message: "Query is required" });
  }
  try {
    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({ songs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
