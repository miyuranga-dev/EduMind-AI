import Video from "../models/Video.js";
import StudyMaterial from "../models/StudyMaterial.js";
import {
  extractVideoId,
  fetchTranscript,
  fetchMetadata,
} from "../utils/youtube.js";
import {
  generateAllStudyMaterials,
} from "../utils/geminiService.js";
import ai from "../config/gemini.js";

/**
 * Processes a YouTube URL: fetches metadata/transcript, generates study material via Gemini,
 * and saves both documents to MongoDB.
 */
export const processVideo = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "YouTube URL is required." });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL format." });
    }

    // Check if the user has already processed this video
    let existingVideo = await Video.findOne({ user: req.user._id, videoId });
    if (existingVideo) {
      // Find associated study material
      const studyMaterial = await StudyMaterial.findOne({
        video: existingVideo._id,
      });
      return res.status(200).json({
        success: true,
        video: existingVideo,
        studyMaterial: studyMaterial,
        userProgress: {
          masteredFlashcards: existingVideo.masteredFlashcards,
          quizAttempts: existingVideo.quizAttempts,
          notesCompleted: existingVideo.notesCompleted,
          chatHistory: existingVideo.chatHistory,
        },
      });
    }

    // 1. Fetch transcript and metadata in parallel
    const [transcript, metadata] = await Promise.all([
      fetchTranscript(videoId),
      fetchMetadata(videoId),
    ]);

    const transcriptText = transcript.map((seg) => seg.text).join(" ");

    // Estimate video duration in seconds from transcript offsets
    let duration = 0;
    if (transcript.length > 0) {
      const lastSeg = transcript[transcript.length - 1];
      duration = lastSeg.start + lastSeg.duration;
    }

    // 2. Generate study materials via Gemini in a single request
    const { summary, notes, flashcards, quizzes } = await generateAllStudyMaterials(transcriptText);

    // 3. Create the Video document
    const video = await Video.create({
      user: req.user._id,
      youtubeUrl: url,
      videoId,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      channelTitle: metadata.channelTitle,
      duration,
      transcript,
      masteredFlashcards: [],
      quizAttempts: [],
      notesCompleted: false,
      chatHistory: [],
    });

    // 4. Create the StudyMaterial document linked to the Video
    const studyMaterial = await StudyMaterial.create({
      video: video._id,
      summary,
      notes,
      flashcards,
      quizzes,
    });

    res.status(201).json({
      success: true,
      video,
      studyMaterial,
      userProgress: {
        masteredFlashcards: video.masteredFlashcards,
        quizAttempts: video.quizAttempts,
        notesCompleted: video.notesCompleted,
        chatHistory: video.chatHistory,
      },
    });
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).json({
      message: error.message || "An error occurred while processing the video.",
    });
  }
};

/**
 * Returns all videos saved by the logged-in user.
 * Supports keyword search (?q=...) and maps to frontend expectations.
 */
export const getVideos = async (req, res) => {
  try {
    const { q } = req.query;
    let queryFilter = { user: req.user._id };

    if (q) {
      const regex = new RegExp(q, "i");
      queryFilter.$or = [{ title: regex }, { channelTitle: regex }];
    }

    const videos = await Video.find(queryFilter).sort({ createdAt: -1 });

    // Format response exactly as frontend videosAPI.getAll expects:
    // array of objects, each containing { _id, video, savedAt, masteredFlashcards, quizAttempts, notesCompleted }
    const formattedVideos = videos.map((v) => ({
      _id: v._id,
      video: v,
      savedAt: v.createdAt,
      masteredFlashcards: v.masteredFlashcards || [],
      quizAttempts: v.quizAttempts || [],
      notesCompleted: v.notesCompleted || false,
    }));

    res.status(200).json(formattedVideos);
  } catch (error) {
    console.error("Error fetching library:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Gets video, study materials, and user progress by ID.
 * Supports lookup by MongoDB ID or YouTube Video ID.
 */
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find video by either _id or videoId
    let video = await Video.findOne({
      user: req.user._id,
      $or: [
        { _id: id.match(/^[0-9a-fA-C]{24}$/i) ? id : null },
        { videoId: id },
      ].filter(Boolean),
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const studyMaterial = await StudyMaterial.findOne({ video: video._id });

    res.status(200).json({
      video,
      studyMaterial,
      userProgress: {
        masteredFlashcards: video.masteredFlashcards || [],
        quizAttempts: video.quizAttempts || [],
        notesCompleted: video.notesCompleted || false,
        chatHistory: video.chatHistory || [],
      },
    });
  } catch (error) {
    console.error("Error getting video workspace:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Deletes a video and its associated study materials from the user's library.
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({
      user: req.user._id,
      $or: [
        { _id: id.match(/^[0-9a-fA-C]{24}$/i) ? id : null },
        { videoId: id },
      ].filter(Boolean),
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete associated study material first
    await StudyMaterial.deleteOne({ video: video._id });
    // Delete video
    await video.deleteOne();

    res.status(200).json({ message: "Video removed from library" });
  } catch (error) {
    console.error("Error deleting video workspace:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Updates learning progress: notes reading state, mastered flashcard lists, or quiz attempts.
 */
export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, flashcardId, score, totalQuestions, notesCompleted } =
      req.body;

    const video = await Video.findOne({
      user: req.user._id,
      $or: [
        { _id: id.match(/^[0-9a-fA-C]{24}$/i) ? id : null },
        { videoId: id },
      ].filter(Boolean),
    });

    if (!video) {
      return res.status(404).json({ message: "Video workspace not found" });
    }

    if (type === "flashcard") {
      const index = video.masteredFlashcards.indexOf(flashcardId);
      if (index > -1) {
        // Toggle off if already present
        video.masteredFlashcards.splice(index, 1);
      } else {
        // Add to mastered list
        video.masteredFlashcards.push(flashcardId);
      }
    } else if (type === "quiz") {
      video.quizAttempts.push({
        score,
        totalQuestions,
        completedAt: new Date(),
      });
    } else if (type === "notes") {
      video.notesCompleted = notesCompleted;
    }

    await video.save();

    res.status(200).json({
      success: true,
      userProgress: {
        masteredFlashcards: video.masteredFlashcards,
        quizAttempts: video.quizAttempts,
        notesCompleted: video.notesCompleted,
      },
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Grounded conversational assistant. Answers questions strictly using the video transcript.
 */
export const chatVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Chat message is required." });
    }

    const video = await Video.findOne({
      user: req.user._id,
      $or: [
        { _id: id.match(/^[0-9a-fA-C]{24}$/i) ? id : null },
        { videoId: id },
      ].filter(Boolean),
    });

    if (!video) {
      return res.status(404).json({ message: "Video workspace not found" });
    }

    const transcriptText = video.transcript.map((seg) => seg.text).join(" ");

    // Prepare message sequence for conversational memory using Gemini SDK format
    // Map existing db history to match Gemini roles ('user' -> 'user', 'model' -> 'model')
    const contents = video.chatHistory.map((h) => ({
      role: h.role,
      parts: [{ text: h.content }],
    }));

    // Inject system guidelines in the user prompt as instructions
    const systemPrompt = `
You are a helpful learning assistant for this video.
Your responses must be grounded STRICTLY in the following transcript:
===
${transcriptText}
===

Rules:
1. ONLY answer questions using facts directly stated or implied in the video transcript above.
2. If the user's question asks about something NOT mentioned in the transcript (even if it's generally true), politely explain that you can only answer questions based on the video content.
3. Keep answers clear, engaging, and directly related to the lecture/guide.

User query: ${message}
`;

    // Append the current user message to contents list
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const reply = response.text || "I was unable to formulate a response.";

    // Save actual user message (not the massive system prompt) and response to database history
    video.chatHistory.push({ role: "user", content: message });
    video.chatHistory.push({ role: "model", content: reply });
    await video.save();

    res.status(200).json({
      reply,
      chatHistory: video.chatHistory,
    });
  } catch (error) {
    console.error("Error in grounded chat:", error);
    res.status(500).json({ message: "Server Error during chat execution" });
  }
};
