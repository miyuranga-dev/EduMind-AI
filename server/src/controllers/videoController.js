import Video from "../models/Video.js";

export const createVideo = async (req, res) => {
  try {
    const { youtubeUrl, title } = req.body;

    const video = await Video.create({
      user: req.user._id,
      youtubeUrl,
      title,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
