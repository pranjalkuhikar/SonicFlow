import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
  },
  coverImage: {
    type: {
      fileId: String,
      url: String,
      _id: false,
    },
    required: true,
  },
  audioFile: {
    type: {
      fileId: String,
      url: String,
      _id: false,
    },
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);

export default Song;
