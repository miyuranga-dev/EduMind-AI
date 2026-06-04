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

    videoId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    channelTitle: {
      type: String,
    },

    duration: {
      type: Number,
    },

    transcript: [
      {
        text: { type: String, required: true },
        start: { type: Number, required: true },
        duration: { type: Number, required: true },
      },
    ],

    masteredFlashcards: [
      {
        type: String,
      },
    ],

    quizAttempts: [
      {
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],

    notesCompleted: {
      type: Boolean,
      default: false,
    },

    chatHistory: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
