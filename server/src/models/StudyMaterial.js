import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      required: true,
    },

    flashcards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    quizzes: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswerIndex: { type: Number, required: true },
        explanation: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

export default StudyMaterial;
