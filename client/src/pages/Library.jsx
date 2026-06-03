import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { videosAPI } from "../utils/api";
import {
  Search,
  Play,
  Trash2,
  Video,
  Calendar,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const Library = () => {
  const [library, setLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLibrary = async (query = "") => {
    try {
      setLoading(true);
      const data = await videosAPI.getAll(query);
      setLibrary(data);
    } catch (err) {
      console.error(err);
      setError("Could not retrieve your library files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLibrary(searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Instant search debouncing alternative: fetch when empty
    if (e.target.value === "") {
      fetchLibrary("");
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to remove this video and its study guides from your library?",
      )
    ) {
      return;
    }

    try {
      await videosAPI.delete(id);
      setLibrary((prev) =>
        prev.filter(
          (item) => item.video?._id !== id && item.video?.videoId !== id,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove video from library");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-bg-darker text-white pb-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 md:pt-12">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 flex items-center gap-2">
              My Learning Library
            </h1>
            <p className="text-zinc-400 mt-1 text-sm md:text-base">
              Revisit and practice knowledge from your saved study hubs.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-80 shrink-0"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search library title or channel..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-zinc-900/40 border border-white/5 focus:border-brand-indigo/50 pl-11 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
            />
          </form>
        </div>

        {/* Loading / Error states */}
        {loading ? (
          <div className="py-20 flex justify-center flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-brand-indigo animate-spin"></div>
            <p className="text-zinc-500 text-sm">
              Retrieving your index card index...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm text-center">
            {error}
          </div>
        ) : library.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {library.map((item) => {
              if (!item.video) return null;
              const video = item.video;
              const masteredCount = item.masteredFlashcards?.length || 0;
              const quizTally = item.quizAttempts?.length || 0;

              return (
                <div
                  key={video._id || video.videoId}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full border border-white/5 relative group/card"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover/card:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <Link
                        to={`/video/${video._id || video.videoId}`}
                        className="bg-white text-zinc-950 p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-5 h-5 fill-current" />
                      </Link>
                    </div>

                    {/* Delete overlay */}
                    <button
                      onClick={(e) =>
                        handleDelete(video._id || video.videoId, e)
                      }
                      className="absolute top-3 right-3 bg-zinc-950/80 hover:bg-brand-pink/20 text-zinc-400 hover:text-brand-pink border border-white/5 p-2 rounded-xl transition-all cursor-pointer opacity-0 group-hover/card:opacity-100"
                      title="Remove from Library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] text-indigo-400 uppercase font-extrabold tracking-wider block mb-1">
                      {video.channelTitle}
                    </span>
                    <h4 className="font-display font-semibold text-white text-base leading-snug line-clamp-2 mb-4 hover:text-indigo-300 transition-colors">
                      <Link to={`/video/${video._id || video.videoId}`}>
                        {video.title}
                      </Link>
                    </h4>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-zinc-500 pt-4 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.savedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{masteredCount} Mastered</span>
                      </div>
                    </div>
                  </div>

                  {/* Practice CTA Bar */}
                  <Link
                    to={`/video/${video._id || video.videoId}`}
                    className="bg-white/2 hover:bg-brand-indigo/10 border-t border-white/5 py-3 px-5 flex items-center justify-between text-xs text-indigo-400 font-semibold transition-all group/cta"
                  >
                    <span>Open Study Workspace</span>
                    <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel py-20 rounded-3xl text-center border border-dashed border-white/10 max-w-md mx-auto">
            <Video className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h4 className="font-semibold text-zinc-300 text-xl">
              No materials found
            </h4>
            <p className="text-zinc-500 text-sm mt-1 mb-6">
              {searchQuery
                ? `No videos match "${searchQuery}". Try searching other keywords.`
                : "You don't have any study materials generated yet."}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-indigo to-brand-violet text-white font-bold py-2.5 px-6 rounded-xl hover:opacity-95 shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
