import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { videosAPI } from "../utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Brain,
  Video,
  FileText,
  Bookmark,
  HelpCircle,
  MessageSquare,
  Send,
  Sparkles,
  Check,
  CheckSquare,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

const StudyHub = () => {
  const { id } = useParams();
  const iframeRef = useRef(null);
  const chatEndRef = useRef(null);

  // Core data states
  const [video, setVideo] = useState(null);
  const [studyMaterial, setStudyMaterial] = useState(null);
  const [userProgress, setUserProgress] = useState({
    masteredFlashcards: [],
    quizAttempts: [],
    notesCompleted: false,
    chatHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state variables
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'notes' | 'flashcards' | 'quiz'

  // Chat States
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Flashcards States
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz States
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const data = await videosAPI.getById(id);
        setVideo(data.video);
        setStudyMaterial(data.studyMaterial);
        if (data.userProgress) {
          setUserProgress(data.userProgress);
          setChatHistory(data.userProgress.chatHistory || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load this study hub workspace.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  // Scroll chat to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  // Keyboard shortcut listener for Flashcards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== "flashcards") return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, currentCardIdx, studyMaterial]);

  // Seek YouTube video player to specific seconds
  const seekTo = (seconds) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seconds, true],
        }),
        "*",
      );
    }
  };

  // ------------------
  // AI Grounded Chat
  // ------------------
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userText = chatMessage.trim();
    setChatMessage("");
    setChatLoading(true);

    // Optimistically update UI chat messages
    setChatHistory((prev) => [...prev, { role: "user", content: userText }]);

    try {
      const response = await videosAPI.chat(
        video._id || video.videoId,
        userText,
      );
      setChatHistory(
        response.chatHistory || [
          ...chatHistory,
          { role: "user", content: userText },
          { role: "model", content: response.reply },
        ],
      );
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "⚠️ Sorry, I could not answer that. Please check your connection and verify the server is running.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ------------------
  // Notes Completed
  // ------------------
  const handleToggleNotes = async () => {
    const newStatus = !userProgress.notesCompleted;
    try {
      const response = await videosAPI.updateProgress(
        video._id || video.videoId,
        {
          type: "notes",
          notesCompleted: newStatus,
        },
      );
      setUserProgress((prev) => ({
        ...prev,
        notesCompleted: response.userProgress.notesCompleted,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------
  // Flashcards Handlers
  // ------------------
  const handleNextCard = () => {
    if (!studyMaterial?.flashcards) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx((prev) => (prev + 1) % studyMaterial.flashcards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    if (!studyMaterial?.flashcards) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx(
        (prev) =>
          (prev - 1 + studyMaterial.flashcards.length) %
          studyMaterial.flashcards.length,
      );
    }, 150);
  };

  const handleToggleMastery = async (cardId) => {
    try {
      const response = await videosAPI.updateProgress(
        video._id || video.videoId,
        {
          type: "flashcard",
          flashcardId: cardId,
        },
      );
      setUserProgress((prev) => ({
        ...prev,
        masteredFlashcards: response.userProgress.masteredFlashcards,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------
  // Quiz Handlers
  // ------------------
  const handleOptionSelect = (idx) => {
    if (quizSubmitted) return;
    setSelectedOptionIdx(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOptionIdx === null || quizSubmitted) return;
    setQuizSubmitted(true);

    const quizList = studyMaterial.quizzes;
    const isCorrect =
      selectedOptionIdx === quizList[currentQuizIdx].correctAnswerIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleQuizNext = async () => {
    const quizList = studyMaterial.quizzes;

    if (currentQuizIdx < quizList.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setQuizSubmitted(false);
    } else {
      // Completed last quiz question. Log to progress API.
      setQuizCompleted(true);
      try {
        const response = await videosAPI.updateProgress(
          video._id || video.videoId,
          {
            type: "quiz",
            score:
              quizScore +
              (selectedOptionIdx ===
                quizList[currentQuizIdx].correctAnswerIndex && quizSubmitted
                ? 0
                : selectedOptionIdx ===
                    quizList[currentQuizIdx].correctAnswerIndex
                  ? 1
                  : 0),
            totalQuestions: quizList.length,
          },
        );
        setUserProgress((prev) => ({
          ...prev,
          quizAttempts: response.userProgress.quizAttempts,
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // Formatting timestamp helper for transcript display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Loader screen
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center flex-col gap-4">
        <div className="relative w-16 h-16 animate-spin rounded-full bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-pink p-[3px]">
          <div className="w-full h-full bg-bg-darker rounded-full"></div>
        </div>
        <p className="text-zinc-400 font-medium">
          Opening learning workspace...
        </p>
      </div>
    );
  }

  // Error screen
  if (error || !video || !studyMaterial) {
    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl text-center border border-white/10">
          <HelpCircle className="w-12 h-12 text-brand-pink mx-auto mb-4" />
          <h3 className="font-display font-bold text-2xl text-white">
            Workspace Offline
          </h3>
          <p className="text-zinc-500 text-sm mt-2 mb-6">
            {error || "Could not load video materials."}
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-brand-indigo to-brand-violet text-white font-bold py-2.5 px-6 rounded-xl hover:opacity-95 shadow-md cursor-pointer"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-darker text-white flex flex-col">
      {/* Header bar */}
      <div className="glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 transition-all"
            title="Back to library"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] text-brand-pink uppercase font-extrabold tracking-wider block mb-0.5">
              {video.channelTitle || "YouTube Creator"}
            </span>
            <h2 className="font-display font-bold text-lg md:text-xl text-zinc-100 line-clamp-1">
              {video.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto text-xs font-semibold text-zinc-400">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> grounded Gemini AI Active
          </div>
        </div>
      </div>

      {/* Main split work area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-140px)]">
        {/* Left Side: Video and Transcript */}
        <div className="lg:col-span-5 flex flex-col border-r border-white/5 h-full overflow-y-auto">
          {/* IFrame Video Player */}
          <div className="aspect-video w-full bg-black relative border-b border-white/5">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&origin=${window.location.origin}`}
              title={video.title}
              className="w-full h-full absolute inset-0 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Clickable Transcript Box */}
          <div className="flex-1 flex flex-col overflow-hidden bg-bg-dark/40 min-h-[300px]">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/20">
              <h3 className="font-display font-semibold text-sm text-zinc-300 flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-indigo" /> Clickable
                Transcript
              </h3>
              <span className="text-[10px] text-zinc-500 font-medium">
                Click lines to seek video
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {video.transcript && video.transcript.length > 0 ? (
                video.transcript.map((seg, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekTo(seg.start)}
                    className="flex gap-3 text-left w-full hover:bg-white/3 p-2.5 rounded-xl group/line transition-all border border-transparent hover:border-white/5 focus:outline-none cursor-pointer"
                  >
                    <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10 h-fit select-none group-hover/line:bg-brand-indigo group-hover/line:text-white transition-colors">
                      {formatTime(seg.start)}
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed group-hover/line:text-white transition-colors flex-1">
                      {seg.text}
                    </p>
                  </button>
                ))
              ) : (
                <div className="text-center text-zinc-500 text-sm py-12">
                  No transcript available for this video workspace.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Study Workspaces */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-bg-darker">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/5 bg-zinc-950/30 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { id: "chat", label: "AI Chat", icon: MessageSquare },
              { id: "notes", label: "Structured Notes", icon: FileText },
              { id: "flashcards", label: "Flashcards", icon: Bookmark },
              { id: "quiz", label: "Interactive Quiz", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-display text-sm font-semibold whitespace-nowrap transition-all focus:outline-none cursor-pointer ${
                    activeTab === tab.id
                      ? "border-brand-indigo text-indigo-400 bg-brand-indigo/5"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/2"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* 1. AI CHAT TAB */}
            {activeTab === "chat" && (
              <div className="h-full flex flex-col bg-bg-dark/40 border border-white/5 rounded-2xl overflow-hidden min-h-[450px]">
                {/* Chat header grounding description */}
                <div className="bg-zinc-950/40 border-b border-white/5 py-3 px-5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-pink" />
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Answers are grounded strictly in the transcript above.
                  </span>
                </div>

                {/* Messages Hub */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="h-full flex items-center justify-center flex-col text-center max-w-sm mx-auto">
                      <Brain className="w-12 h-12 text-zinc-700 animate-float mb-4" />
                      <h4 className="font-semibold text-zinc-300">
                        Ask Anything About the Video
                      </h4>
                      <p className="text-zinc-500 text-xs mt-1">
                        I am trained specifically on this video's transcript.
                        Ask me to explain concepts, list steps, or clarify
                        points from the audio.
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "model" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
                            msg.role === "model"
                              ? "bg-zinc-900/60 border-white/5 text-zinc-200"
                              : "bg-brand-indigo/15 border-brand-indigo/25 text-white"
                          }`}
                        >
                          {/* Parse message content using standard formatting */}
                          <div className="whitespace-pre-line font-sans">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Typing State */}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900/60 border border-white/5 px-4 py-3.5 rounded-2xl max-w-fit flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Prompt Box */}
                <form
                  onSubmit={handleSendChat}
                  className="p-4 border-t border-white/5 bg-zinc-950/20 flex gap-2"
                >
                  <input
                    type="text"
                    required
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question about this video..."
                    className="flex-1 bg-zinc-900/50 hover:bg-zinc-900/90 focus:bg-zinc-950/50 border border-white/5 focus:border-brand-indigo/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!chatMessage.trim() || chatLoading}
                    className="bg-brand-indigo hover:bg-indigo-600 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. STRUCTURED NOTES TAB */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                {/* Notes Read Complete Toggle */}
                <div className="flex justify-between items-center bg-zinc-900/30 p-4 rounded-xl border border-white/5 mb-6">
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Toggle Completion
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Check this box when you finish reviewing the notes
                    </p>
                  </div>
                  <button
                    onClick={handleToggleNotes}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      userProgress.notesCompleted
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-zinc-900/80 hover:bg-zinc-900 text-zinc-400 border-white/5"
                    }`}
                  >
                    {userProgress.notesCompleted ? (
                      <>
                        <CheckSquare className="w-4 h-4" /> Notes Read
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border border-zinc-500 rounded"></div>{" "}
                        Mark as Read
                      </>
                    )}
                  </button>
                </div>

                {/* Markdown content container */}
                <div className="prose prose-invert max-w-none prose-sm md:prose-base space-y-4">
                  {/* Premium CSS-driven markdown viewer */}
                  <div className="markdown-body p-6 bg-zinc-900/20 border border-white/5 rounded-2xl leading-relaxed text-zinc-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {studyMaterial.notes}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FLASHCARDS TAB */}
            {activeTab === "flashcards" && (
              <div className="space-y-8 max-w-xl mx-auto py-4">
                {/* Info Tip */}
                <div className="text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                  <span>
                    💡 Press [Space] to flip | [← / →] arrows for next/prev
                    cards
                  </span>
                </div>

                {studyMaterial.flashcards &&
                studyMaterial.flashcards.length > 0 ? (
                  <>
                    {/* Card container */}
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className={`flashcard-container select-none ${isFlipped ? "is-flipped" : ""}`}
                    >
                      <div className="flashcard-inner">
                        {/* Front Side */}
                        <div className="flashcard-front glass-panel border-white/10 hover:border-brand-indigo/30 transition-colors shadow-xl">
                          <span className="text-[10px] text-brand-indigo uppercase font-extrabold tracking-wider mb-4 block">
                            Question
                          </span>
                          <h3 className="font-display font-bold text-lg md:text-xl text-center text-white leading-snug">
                            {studyMaterial.flashcards[currentCardIdx].question}
                          </h3>
                          <span className="text-zinc-500 text-[11px] mt-8 block">
                            Click to reveal answer
                          </span>
                        </div>

                        {/* Back Side */}
                        <div className="flashcard-back bg-gradient-to-br from-indigo-950/70 to-bg-dark border border-brand-indigo/20 shadow-2xl">
                          <span className="text-[10px] text-brand-pink uppercase font-extrabold tracking-wider mb-4 block">
                            Answer Explanation
                          </span>
                          <p className="text-zinc-300 text-sm md:text-base text-center leading-relaxed font-medium">
                            {studyMaterial.flashcards[currentCardIdx].answer}
                          </p>
                          <span className="text-zinc-500 text-[11px] mt-8 block">
                            Click to show question
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                        {/* Mastery Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMastery(
                              studyMaterial.flashcards[currentCardIdx]._id ||
                                currentCardIdx,
                            );
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            userProgress.masteredFlashcards?.includes(
                              studyMaterial.flashcards[currentCardIdx]._id ||
                                currentCardIdx,
                            )
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-zinc-900/80 hover:bg-zinc-900 text-zinc-400 border-white/5"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {userProgress.masteredFlashcards?.includes(
                            studyMaterial.flashcards[currentCardIdx]._id ||
                              currentCardIdx,
                          )
                            ? "Mastered"
                            : "Mark as Mastered"}
                        </button>
                      </div>

                      {/* Pagination buttons */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevCard();
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <span className="text-sm font-semibold text-zinc-400">
                          {currentCardIdx + 1} /{" "}
                          {studyMaterial.flashcards.length}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextCard();
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-zinc-500 text-sm py-12">
                    No flashcards created for this video.
                  </div>
                )}
              </div>
            )}

            {/* 4. INTERACTIVE QUIZ TAB */}
            {activeTab === "quiz" && (
              <div className="max-w-xl mx-auto py-2">
                {studyMaterial.quizzes && studyMaterial.quizzes.length > 0 ? (
                  !quizCompleted ? (
                    <div className="space-y-6">
                      {/* Score indicator */}
                      <div className="flex justify-between items-center text-xs text-zinc-500 bg-zinc-900/20 px-4 py-3 rounded-xl border border-white/5">
                        <span>
                          Question {currentQuizIdx + 1} of{" "}
                          {studyMaterial.quizzes.length}
                        </span>
                        <span>Score: {quizScore}</span>
                      </div>

                      {/* Question Text */}
                      <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="font-display font-semibold text-base md:text-lg text-white leading-relaxed">
                          {studyMaterial.quizzes[currentQuizIdx].question}
                        </h3>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {studyMaterial.quizzes[currentQuizIdx].options.map(
                          (opt, oIdx) => {
                            const isSelected = selectedOptionIdx === oIdx;
                            const isCorrectOption =
                              oIdx ===
                              studyMaterial.quizzes[currentQuizIdx]
                                .correctAnswerIndex;

                            let buttonStyle =
                              "bg-zinc-900/40 hover:bg-zinc-900 border-white/5 text-zinc-300";

                            if (quizSubmitted) {
                              if (isCorrectOption) {
                                buttonStyle =
                                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                              } else if (isSelected) {
                                buttonStyle =
                                  "bg-brand-pink/15 border-brand-pink/30 text-brand-pink";
                              } else {
                                buttonStyle =
                                  "bg-zinc-950/20 border-white/5 text-zinc-600 opacity-60";
                              }
                            } else if (isSelected) {
                              buttonStyle =
                                "bg-brand-indigo/15 border-brand-indigo/40 text-indigo-400 font-semibold";
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleOptionSelect(oIdx)}
                                className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all focus:outline-none flex justify-between items-center ${buttonStyle} ${
                                  !quizSubmitted
                                    ? "hover:scale-[1.01] hover:border-brand-indigo/25 cursor-pointer"
                                    : ""
                                }`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrectOption && (
                                  <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          },
                        )}
                      </div>

                      {/* Explanation Reveal */}
                      {quizSubmitted && (
                        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-brand-indigo/15 space-y-2 animate-pulse-slow">
                          <span className="text-[10px] text-brand-indigo uppercase font-extrabold tracking-wider block">
                            Explanation
                          </span>
                          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                            {studyMaterial.quizzes[currentQuizIdx].explanation}
                          </p>
                        </div>
                      )}

                      {/* Bottom action trigger */}
                      <div className="flex justify-end pt-2">
                        {!quizSubmitted ? (
                          <button
                            disabled={selectedOptionIdx === null}
                            onClick={handleQuizSubmit}
                            className="bg-brand-indigo hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleQuizNext}
                            className="bg-gradient-to-r from-brand-indigo to-brand-violet text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            {currentQuizIdx < studyMaterial.quizzes.length - 1
                              ? "Next Question"
                              : "Finish Quiz"}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Score card report results */
                    <div className="glass-panel p-8 rounded-3xl text-center max-w-sm mx-auto border border-white/5 space-y-6">
                      <div className="w-20 h-20 rounded-full bg-brand-indigo/10 border-2 border-brand-indigo flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
                        <Award className="w-8 h-8 text-indigo-400" />
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-2xl text-white">
                          Quiz Finished
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          Grounding knowledge tested successfully
                        </p>
                      </div>

                      <div className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5 flex justify-around">
                        <div>
                          <span className="text-xs text-zinc-500 block uppercase tracking-wider font-bold">
                            Accuracy
                          </span>
                          <span className="text-2xl font-bold text-white">
                            {Math.round(
                              (quizScore / studyMaterial.quizzes.length) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-[1px] bg-zinc-800"></div>
                        <div>
                          <span className="text-xs text-zinc-500 block uppercase tracking-wider font-bold">
                            Correct
                          </span>
                          <span className="text-2xl font-bold text-white">
                            {quizScore} / {studyMaterial.quizzes.length}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleResetQuiz}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-3.5 px-4 rounded-xl border border-white/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry Test
                      </button>
                    </div>
                  )
                ) : (
                  <div className="text-center text-zinc-500 text-sm py-12">
                    No quizzes created for this video.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHub;
