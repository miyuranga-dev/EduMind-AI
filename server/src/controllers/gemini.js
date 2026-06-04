import ai from "../config/gemini.js";

export const testGemini = async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain React in 10 sentence.",
    });

    res.json({
      response: response.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};