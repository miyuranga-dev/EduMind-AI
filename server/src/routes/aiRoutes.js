import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getTranscript } from "../controllers/aiController.js";

const router = express.Router();

router.get("/transcript/:videoId", protect, getTranscript);

export default router;
