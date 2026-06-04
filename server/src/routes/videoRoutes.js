import express from "express";
import {
  processVideo,
  getVideos,
  getVideoById,
  deleteVideo,
  updateProgress,
  chatVideo,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/process", protect, processVideo);
router.get("/", protect, getVideos);
router.get("/:id", protect, getVideoById);
router.delete("/:id", protect, deleteVideo);
router.put("/:id/progress", protect, updateProgress);
router.post("/:id/chat", protect, chatVideo);

export default router;
