import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { videosAPI } from "../utils/api";
import Footer from "../components/Footer";
import {
  Play,
  Search,
  Video,
  Award,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Youtube,
  BookOpen,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentVideos, setRecentVideos] = useState([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    masteredCards: 0,
    completedNotes: 0,
    avgQuizScore: 0,
  });

  // Processing steps animation state
  const [processingStep, setProcessingStep] = useState(0);
  const steps = [
    "Verifying YouTube URL and resolving video metadata...",
    "Extracting transcript segments and captions...",
    "Synthesizing video content with Gemini AI...",
    "Generating structured study notes & summary...",
    "Building interactive flashcards & quiz challenges...",
  ];

  // Simulated step increment during processing
  useEffect(() => {
    let interval;
    if (loading) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3500); // Progress step every 3.5s
    } else {
      setProcessingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const library = await videosAPI.getAll();
        // Take top 3 recent videos
        setRecentVideos(library.slice(0, 3));

        // Calculate stats
        let totalVideos = library.length;
        let masteredCards = 0;
        let completedNotes = 0;
        let totalQuizScore = 0;
        let totalQuizAttempts = 0;

        library.forEach((item) => {
          masteredCards += item.masteredFlashcards?.length || 0;
          if (item.notesCompleted) completedNotes++;

          if (item.quizAttempts && item.quizAttempts.length > 0) {
            // Take the best attempt
            const bestAttempt = Math.max(
              ...item.quizAttempts.map(
                (a) => (a.score / a.totalQuestions) * 100,
              ),
            );
            totalQuizScore += bestAttempt;
            totalQuizAttempts++;
          }
        });

        setStats({
          totalVideos,
          masteredCards,
          completedNotes,
          avgQuizScore:
            totalQuizAttempts > 0
              ? Math.round(totalQuizScore / totalQuizAttempts)
              : 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard details:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!url) return;

    setError("");
    setLoading(true);

    try {
      const response = await videosAPI.process(url);
      if (response && response.video) {
        // Redirect to the newly created study hub
        navigate(`/video/${response.video._id || response.video.videoId}`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "Failed to process video. Please check the URL and try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker text-white pb-12 flex flex-col">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-indigo/5 via-brand-violet/2 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 md:pt-16">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 flex items-center gap-2">
              Welcome back,{" "}
              <span className="text-gradient-primary">{user?.name}</span>{" "}
              <Sparkles className="w-6 h-6 text-brand-pink animate-pulse" />
            </h1>
            <p className="text-zinc-400 mt-1.5 text-base">
              Paste any YouTube URL below to turn it into an interactive study
              dashboard.
            </p>
          </div>
          <div className="text-zinc-500 text-xs md:text-sm bg-zinc-900/40 border border-white/5 py-2 px-4 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-indigo" />
            <span>Learning Session Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-brand-indigo/10 p-3 rounded-xl border border-brand-indigo/15">
              <Video className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Saved Videos
              </p>
              <h3 className="text-2xl font-display font-bold mt-0.5">
                {stats.totalVideos}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-brand-pink/10 p-3 rounded-xl border border-brand-pink/15">
              <Award className="w-6 h-6 text-brand-pink" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Mastered Cards
              </p>
              <h3 className="text-2xl font-display font-bold mt-0.5">
                {stats.masteredCards}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-brand-violet/10 p-3 rounded-xl border border-brand-violet/15">
              <BookOpen className="w-6 h-6 text-brand-violet" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Finished Notes
              </p>
              <h3 className="text-2xl font-display font-bold mt-0.5">
                {stats.completedNotes}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-brand-cyan/10 p-3 rounded-xl border border-brand-cyan/15">
              <Award className="w-6 h-6 text-brand-cyan" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Avg Quiz Score
              </p>
              <h3 className="text-2xl font-display font-bold mt-0.5">
                {stats.avgQuizScore}%
              </h3>
            </div>
          </div>
        </div>

        {/* Input Process URL Panel */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl mb-12 shadow-2xl relative overflow-hidden border border-white/10">
          {/* Overlay grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

          {!loading ? (
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/10 mb-6">
                <Youtube className="w-4 h-4 text-red-500" /> Grounded AI Copilot
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-4 leading-tight">
                Process Educational YouTube Video
              </h2>
              <p className="text-zinc-400 mb-8 text-sm md:text-base">
                Paste the URL of any lecture, coding guide, or documentary. We
                will pull the transcript and compile structured study notes,
                flashcards, and quizzes automatically.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-medium text-left">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleProcess}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-zinc-900/60 border border-white/10 focus:border-brand-indigo/60 focus:ring-2 focus:ring-brand-indigo/20 px-5 py-4 rounded-2xl text-white placeholder-zinc-500 outline-none transition-all text-base shadow-inner"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-pink hover:opacity-95 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 group transition-all shrink-0 cursor-pointer"
                >
                  Generate Study Hub
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          ) : (
            <div className="relative z-10 max-w-2xl mx-auto py-6">
              {/* Dynamic steps load panel */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-zinc-800 border-t-brand-indigo border-r-brand-pink animate-spin"></div>
                  <Sparkles className="w-8 h-8 text-brand-pink absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white">
                  Generating Study Hub
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  This typically takes 10 to 15 seconds. Please don't close the
                  window.
                </p>
              </div>

              {/* Progress Steps List */}
              <div className="space-y-4 bg-zinc-950/40 p-6 rounded-2xl border border-white/5">
                {steps.map((stepText, idx) => {
                  const isCompleted = processingStep > idx;
                  const isActive = processingStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 transition-all duration-500 ${isCompleted
                          ? "text-zinc-400"
                          : isActive
                            ? "text-brand-indigo font-medium scale-[1.01]"
                            : "text-zinc-600"
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-2 border-brand-indigo border-t-transparent animate-spin shrink-0"></div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-800 shrink-0"></div>
                      )}
                      <span className="text-sm">{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recent Studies */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl md:text-2xl text-zinc-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-indigo" /> Recent Studies
            </h2>
            <Link
              to="/library"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 hover:underline transition-all"
            >
              View Full Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentVideos.map((item) => {
                if (!item.video) return null;
                const masteredCount = item.masteredFlashcards?.length || 0;
                return (
                  <div
                    key={item.video._id || item.video.videoId}
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full border border-white/5"
                  >
                    {/* Thumbnail preview */}
                    <div className="relative aspect-video overflow-hidden group">
                      <img
                        src={item.video.thumbnail}
                        alt={item.video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/video/${item.video._id || item.video.videoId}`}
                          className="bg-white text-zinc-950 p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="w-5 h-5 fill-current" />
                        </Link>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-xs text-zinc-500 uppercase font-extrabold tracking-wider block mb-1">
                        {item.video.channelTitle}
                      </span>
                      <h4 className="font-display font-semibold text-white text-base leading-snug line-clamp-2 mb-4 hover:text-indigo-300 transition-colors">
                        <Link
                          to={`/video/${item.video._id || item.video.videoId}`}
                        >
                          {item.video.title}
                        </Link>
                      </h4>

                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-pink"></span>
                          {masteredCount} Flashcards Mastered
                        </span>
                        {item.notesCompleted && (
                          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-medium">
                            Notes Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl text-center border border-dashed border-white/10">
              <Video className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h4 className="font-semibold text-zinc-300 text-lg">
                No videos processed yet
              </h4>
              <p className="text-zinc-500 text-sm max-w-md mx-auto mt-1 mb-4">
                Paste a YouTube URL above and click 'Generate Study Hub' to
                create your first grounded learning environment.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
