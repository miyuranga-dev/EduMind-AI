import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/gemini",geminiRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduMind API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
