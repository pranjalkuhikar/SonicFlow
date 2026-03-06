import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const ArtistPlayList = mongoose.model("ArtistPlayList", playListSchema);

export default ArtistPlayList;
