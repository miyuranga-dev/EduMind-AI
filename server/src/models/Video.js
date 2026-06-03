import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
