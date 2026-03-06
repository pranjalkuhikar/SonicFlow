import Song from "../models/song.model.js";
import ArtistPlayList from "../models/artistPlayList.model.js";
import UserPlayList from "../models/userPlayList.model.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";

// Songs
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

// Search
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

// Artist
export const createArtistPlayList = async (req, res) => {
  try {
    const { name, artistName } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const playList = new ArtistPlayList({
      name,
      artist: req.user.id,
      artistName: artistName || undefined,
    });
    await playList.save();
    res
      .status(201)
      .json({ message: "PlayList created successfully", playList });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getArtistPlayList = async (req, res) => {
  try {
    const { artistId } = req.query;
    const filter = artistId ? { artist: artistId } : {};
    const playLists = await ArtistPlayList.find(filter);
    res.status(200).json({ playLists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getArtistPlayListById = async (req, res) => {
  try {
    const { id } = req.params;
    const playList = await ArtistPlayList.findById(id);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    res.status(200).json({ playList });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteArtistPlayList = async (req, res) => {
  try {
    const { id } = req.params;
    const playList = await ArtistPlayList.findById(id);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await ArtistPlayList.findByIdAndDelete(id);
    res.status(200).json({ message: "PlayList deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addSongToArtistPlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const { songId } = req.body;
    if (!playListId?.trim() || !songId?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const playList = await ArtistPlayList.findById(playListId);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (playList.songs.some((id) => id.toString() === songId.toString())) {
      return res.status(409).json({ message: "Song already in playlist" });
    }
    playList.songs.push(songId);
    await playList.save();
    res.status(200).json({ message: "Song added to PlayList successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeSongToArtistPlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const { songId } = req.body;
    if (!playListId?.trim() || !songId?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const playList = await ArtistPlayList.findById(playListId);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    playList.songs = playList.songs.filter(
      (id) => id.toString() !== songId.toString(),
    );
    await playList.save();
    res.status(200).json({ message: "Song removed to PlayList successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// User
export const createUserPlayList = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const playList = new UserPlayList({
      name,
      user: req.user.id,
    });
    await playList.save();
    res
      .status(201)
      .json({ message: "PlayList created successfully", playList });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUserPlayList = async (req, res) => {
  try {
    const playLists = await UserPlayList.find({ user: req.user.id });
    res.status(200).json({ playLists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUserPlayListById = async (req, res) => {
  try {
    const { id } = req.params;
    const playList = await UserPlayList.findById(id);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json({ playList });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteUserPlayList = async (req, res) => {
  try {
    const { id } = req.params;
    const playList = await UserPlayList.findById(id);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await UserPlayList.findByIdAndDelete(id);
    res.status(200).json({ message: "PlayList deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addSongToUserPlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const { songId } = req.body;
    if (!playListId?.trim() || !songId?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const playList = await UserPlayList.findById(playListId);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (playList.songs.some((id) => id.toString() === songId.toString())) {
      return res.status(409).json({ message: "Song already in playlist" });
    }
    playList.songs.push(songId);
    await playList.save();
    res.status(200).json({ message: "Song added to PlayList successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeSongToUserPlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const { songId } = req.body;
    if (!playListId?.trim() || !songId?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const playList = await UserPlayList.findById(playListId);
    if (!playList) {
      return res.status(404).json({ message: "PlayList not found" });
    }
    if (playList.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    playList.songs = playList.songs.filter(
      (id) => id.toString() !== songId.toString(),
    );
    await playList.save();
    res.status(200).json({ message: "Song removed to PlayList successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
