import express from "express";
import { testGemini } from "../controllers/gemini.js";

const router = express.Router();

router.get("/test",testGemini);

export default router;