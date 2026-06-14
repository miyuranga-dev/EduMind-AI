import { MOCK_VIDEOS, getMockStudyMaterials } from "./mockData.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.1.4:5000/";

// Helper to get headers
const getHeaders = () => {
  const token = localStorage.getItem("edumind_token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Simple fetch wrapper to detect if server is down and toggle mock mode
const request = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    // If it's a network error (failed to fetch), handle mock mode or rethrow
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.warn(
        "Backend server is offline. Running in Mock Standalone Mode.",
      );
      return handleMockFallback(url, options);
    }
    throw error;
  }
};

// Initialize localStorage mock DB if it doesn't exist
const initMockDB = () => {
  if (!localStorage.getItem("mock_videos")) {
    localStorage.setItem("mock_videos", JSON.stringify(MOCK_VIDEOS));
  }
};

// Handle Mock Standalone Mode logic
const handleMockFallback = async (url, options) => {
  initMockDB();
  const mockVideos = JSON.parse(localStorage.getItem("mock_videos"));

  // Route matches
  // Auth
  if (url === "/auth/login") {
    const { email } = JSON.parse(options.body);
    const mockUser = {
      _id: "mock-user-1",
      name: "Scholar Guest",
      email: email || "scholar@edumind.ai",
      token: "mock-jwt-token-key-abc123xyz",
    };
    localStorage.setItem("edumind_token", mockUser.token);
    localStorage.setItem("edumind_user", JSON.stringify(mockUser));
    return mockUser;
  }

  if (url === "/auth/register") {
    const { name, email } = JSON.parse(options.body);
    const mockUser = {
      _id: "mock-user-1",
      name: name || "New Scholar",
      email: email || "scholar@edumind.ai",
      token: "mock-jwt-token-key-abc123xyz",
    };
    localStorage.setItem("edumind_token", mockUser.token);
    localStorage.setItem("edumind_user", JSON.stringify(mockUser));
    return mockUser;
  }

  if (url === "/auth/me") {
    const mockUser = JSON.parse(localStorage.getItem("edumind_user"));
    if (!mockUser) throw new Error("Not authorized, token failed");
    return mockUser;
  }

  // Videos process
  if (url === "/videos/process") {
    const { url: ytUrl } = JSON.parse(options.body);
    // Simple regex to extract videoId
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = ytUrl.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : "Ke90Tje7VS0";

    // Simulate Gemini generation delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if already in mock DB
    let existingIndex = mockVideos.findIndex((v) => v.videoId === videoId);
    let videoData;

    if (existingIndex > -1) {
      videoData = mockVideos[existingIndex];
    } else {
      // Create new video entry
      const title =
        videoId === "Ke90Tje7VS0"
          ? "React in 100 Seconds"
          : videoId === "zjkBMFhNj_g"
            ? "How Transformers Work (Transformers & LLMs Explained)"
            : `Study Guide: YouTube Video (${videoId})`;

      videoData = {
        _id: `mock-video-${videoId}`,
        videoId,
        title,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channelTitle: "EduMind AI Academy",
        savedAt: new Date().toISOString(),
        userProgress: {
          masteredFlashcards: [],
          quizAttempts: [],
          notesCompleted: false,
        },
      };
      mockVideos.unshift(videoData);
      localStorage.setItem("mock_videos", JSON.stringify(mockVideos));
    }

    // Save study materials to localStorage
    const studyMaterials = getMockStudyMaterials(videoId, videoData.title);
    localStorage.setItem(
      `mock_materials_${videoId}`,
      JSON.stringify(studyMaterials.studyMaterial),
    );
    localStorage.setItem(
      `mock_transcript_${videoId}`,
      JSON.stringify(studyMaterials.video.transcript),
    );

    return {
      success: true,
      video: videoData,
      studyMaterial: studyMaterials.studyMaterial,
      userProgress: videoData.userProgress,
    };
  }

  // Videos get all
  if (url.startsWith("/videos?q=") || url === "/videos") {
    const urlObj = new URL(url, "http://localhost");
    const query = urlObj.searchParams.get("q");

    let result = mockVideos;
    if (query) {
      const searchRegex = new RegExp(query, "i");
      result = mockVideos.filter(
        (v) => searchRegex.test(v.title) || searchRegex.test(v.channelTitle),
      );
    }

    // Format response to look like UserVideo items which wrap the video details
    return result.map((v) => ({
      _id: `user-video-${v.videoId}`,
      video: v,
      savedAt: v.savedAt,
      masteredFlashcards: v.userProgress.masteredFlashcards,
      quizAttempts: v.userProgress.quizAttempts,
      notesCompleted: v.userProgress.notesCompleted,
    }));
  }

  // Videos get by ID
  if (url.startsWith("/videos/")) {
    const id = url.split("/")[2];
    // Find video in mock DB
    // ID could be user-video-id or video-id. Let's find by videoId or _id
    const video = mockVideos.find(
      (v) =>
        v._id === id || v.videoId === id || `mock-video-${v.videoId}` === id,
    );
    if (!video) throw new Error("Video not found");

    const videoId = video.videoId;
    let studyMaterial = JSON.parse(
      localStorage.getItem(`mock_materials_${videoId}`),
    );
    let transcript = JSON.parse(
      localStorage.getItem(`mock_transcript_${videoId}`),
    );

    if (!studyMaterial || !transcript) {
      const defaults = getMockStudyMaterials(videoId, video.title);
      studyMaterial = defaults.studyMaterial;
      transcript = defaults.video.transcript;
      localStorage.setItem(
        `mock_materials_${videoId}`,
        JSON.stringify(studyMaterial),
      );
      localStorage.setItem(
        `mock_transcript_${videoId}`,
        JSON.stringify(transcript),
      );
    }

    // Attach transcript to video model
    const videoWithTranscript = {
      ...video,
      transcript,
    };

    // Return format
    return {
      video: videoWithTranscript,
      studyMaterial,
      userProgress: {
        masteredFlashcards: video.userProgress.masteredFlashcards,
        quizAttempts: video.userProgress.quizAttempts,
        notesCompleted: video.userProgress.notesCompleted,
        chatHistory:
          JSON.parse(localStorage.getItem(`mock_chat_${videoId}`)) || [],
      },
    };
  }

  // Delete video
  if (url.startsWith("/videos/") && options.method === "DELETE") {
    const id = url.split("/")[2];
    const filtered = mockVideos.filter(
      (v) =>
        v._id !== id && v.videoId !== id && `mock-video-${v.videoId}` !== id,
    );
    localStorage.setItem("mock_videos", JSON.stringify(filtered));
    return { success: true, message: "Video removed from library" };
  }

  // Update progress
  if (url.endsWith("/progress") && options.method === "PUT") {
    const parts = url.split("/");
    const id = parts[2]; // Video ID
    const { type, flashcardId, score, totalQuestions, notesCompleted } =
      JSON.parse(options.body);

    const videoIndex = mockVideos.findIndex(
      (v) =>
        v._id === id || v.videoId === id || `mock-video-${v.videoId}` === id,
    );
    if (videoIndex === -1) throw new Error("Video not found");

    const video = mockVideos[videoIndex];
    if (type === "flashcard") {
      const idx = video.userProgress.masteredFlashcards.indexOf(flashcardId);
      if (idx > -1) {
        video.userProgress.masteredFlashcards.splice(idx, 1);
      } else {
        video.userProgress.masteredFlashcards.push(flashcardId);
      }
    } else if (type === "quiz") {
      video.userProgress.quizAttempts.push({
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
      });
    } else if (type === "notes") {
      video.userProgress.notesCompleted = notesCompleted;
    }

    mockVideos[videoIndex] = video;
    localStorage.setItem("mock_videos", JSON.stringify(mockVideos));

    return {
      success: true,
      userProgress: {
        masteredFlashcards: video.userProgress.masteredFlashcards,
        quizAttempts: video.userProgress.quizAttempts,
        notesCompleted: video.userProgress.notesCompleted,
      },
    };
  }

  // Chat grounded response simulation
  if (url.endsWith("/chat") && options.method === "POST") {
    const parts = url.split("/");
    const id = parts[2];
    const { message } = JSON.parse(options.body);

    const video = mockVideos.find(
      (v) =>
        v._id === id || v.videoId === id || `mock-video-${v.videoId}` === id,
    );
    const videoId = video ? video.videoId : "Ke90Tje7VS0";

    // Save user message to mock history
    const chatKey = `mock-chat_${videoId}`;
    const chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];

    chatHistory.push({ role: "user", content: message });

    // Generate intelligent AI response based on keywords
    let reply = `I've analyzed the transcript for **${video ? video.title : "this video"}**. `;
    const cleanMsg = message.toLowerCase();

    if (cleanMsg.includes("react") || cleanMsg.includes("components")) {
      reply += `React is a component-based frontend library. It allows you to build modular, reusable UI elements. The video emphasizes that state management and rendering are core responsibilities of client-side code.`;
    } else if (cleanMsg.includes("acid") || cleanMsg.includes("transaction")) {
      reply += `According to the video, **ACID** transactions are a key database scaling model:
1. **Atomicity**: Either all operations succeed, or everything rolls back (all-or-nothing).
2. **Consistency**: Data moves between valid schema states.
3. **Isolation**: Concurrent operations result in the same state as sequential ones.
4. **Durability**: Committed data survives system crashes.`;
    } else if (
      cleanMsg.includes("normalize") ||
      cleanMsg.includes("database")
    ) {
      reply += `Database normalization structuring reduces data redundancy, making writes faster and more consistent. However, the video points out that over-normalizing forces too many \`JOIN\` operations, which slows down read performance. To fix this, you should set up database **indexes** on columns in the \`WHERE\` clause.`;
    } else if (cleanMsg.includes("index") || cleanMsg.includes("where")) {
      reply += `An index creates a special search tree structure (like a B-Tree). The video explains that indexing columns used in searches speeds up reads, preventing database engines from doing a slow, row-by-row full-table scan.`;
    } else if (
      cleanMsg.includes("hi") ||
      cleanMsg.includes("hello") ||
      cleanMsg.includes("hey")
    ) {
      reply = `Hello! I'm your learning assistant. Ask me anything about the concepts discussed in **${video ? video.title : "the video"}**, such as client-server architectures, database normalization, or transaction properties.`;
    } else {
      reply += `I couldn't find a direct match for your question in the video transcript. 
      
However, from what was discussed, the video focuses on client-server separation of concerns, the ACID database transaction standard, and how databases normalize data or use indexing to optimize read performance. Let me know if you would like me to explain any of those sections!`;
    }

    chatHistory.push({ role: "model", content: reply });
    localStorage.setItem(chatKey, JSON.stringify(chatHistory));

    // Small delay to simulate typing
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      reply,
      chatHistory,
    };
  }

  throw new Error("Not Found in mock fallback handler");
};

// Export API interfaces
export const authAPI = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  getMe: () => request("/auth/me"),
};

export const videosAPI = {
  process: (url) =>
    request("/videos/process", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
  getAll: (searchQuery = "") => {
    const url = searchQuery
      ? `/videos?q=${encodeURIComponent(searchQuery)}`
      : "/videos";
    return request(url);
  },
  getById: (id) => request(`/videos/${id}`),
  delete: (id) =>
    request(`/videos/${id}`, {
      method: "DELETE",
    }),
  updateProgress: (id, progressData) =>
    request(`/videos/${id}/progress`, {
      method: "PUT",
      body: JSON.stringify(progressData),
    }),
  chat: (id, message) =>
    request(`/videos/${id}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
