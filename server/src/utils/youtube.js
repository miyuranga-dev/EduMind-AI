import { YoutubeTranscript } from "youtube-transcript";
import fetch from "node-fetch";

/**
 * Extracts the 11-character YouTube video ID from a URL.
 * Supports various formats: watch, embed, shorts, youtu.be, etc.
 */
export const extractVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Fetches the transcript for a YouTube video.
 * Returns an array of { text, start, duration }
 */
export const fetchTranscript = async (videoId) => {
  try {
    const transcriptList = await YoutubeTranscript.fetchTranscript(videoId);
    return transcriptList.map((item) => ({
      text: item.text,
      start: Math.round(item.offset / 1000), // convert offset (ms) to start (s)
      duration: Math.round(item.duration / 1000) || 1, // convert duration (ms) to duration (s)
    }));
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error("Could not retrieve transcript from YouTube. Make sure the video exists and has captions enabled.");
  }
};

/**
 * Fetches video metadata from the YouTube oEmbed API.
 * Returns { title, channelTitle, thumbnail }
 */
export const fetchMetadata = async (videoId) => {
  try {
    const embedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(embedUrl);
    if (!response.ok) {
      throw new Error("Metadata fetch failed");
    }
    const data = await response.json();
    return {
      title: data.title || "Untitled YouTube Video",
      channelTitle: data.author_name || "Unknown Creator",
      thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.warn("oEmbed metadata fetch failed, using fallbacks:", error.message);
    return {
      title: `Study Guide: YouTube Video (${videoId})`,
      channelTitle: "YouTube Creator",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }
};
