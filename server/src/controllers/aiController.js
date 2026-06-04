import { YoutubeTranscript } from "youtube-transcript";

export const getTranscript = async (req, res) => {
  try {
    const { videoId } = req.params;

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    const transcriptText = transcript.map((item) => item.text).join(" ");

    res.json({
      transcript: transcriptText,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Transcript fetch failed",
    });
  }
};
