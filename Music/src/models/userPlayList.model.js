import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
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

const UserPlayList = mongoose.model("UserPlayList", playListSchema);

export default UserPlayList;
