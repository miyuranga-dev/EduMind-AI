import express from "express";
import { createVideo } from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVideo);

export default router;
