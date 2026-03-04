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
  coverImage: {
    type: String,
    required: true,
  },
  audioFile: {
    type: String,
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);

export default Song;
