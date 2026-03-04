import Song from "../models/song.model.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";

export const addSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.coverImage || !req.files?.audioFile) {
      return res.status(400).json({ message: "Files are required" });
    }

    const existingSong = await Song.findOne({ title });
    if (existingSong) {
      return res.status(400).json({ message: "Song already exists" });
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
