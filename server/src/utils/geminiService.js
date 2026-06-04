import ai from "../config/gemini.js";

/**
 * Generates a bulleted, high-level summary of the transcript.
 */
export const generateSummary = async (transcriptText) => {
  try {
    const prompt = `
You are an expert tutor. Based on the following video transcript, write a concise, high-level summary of the video.
Focus on the main objectives, core concepts, and key conclusions.
Use a few bullet points, keeping it highly readable and under 3-4 paragraphs.

Transcript:
${transcriptText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "No summary could be generated.";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary using Gemini.");
  }
};

/**
 * Generates detailed, structured Markdown notes from the transcript.
 */
export const generateNotes = async (transcriptText) => {
  try {
    const prompt = `
You are an expert educator. Create a comprehensive, well-structured, and beautifully formatted set of study notes in Markdown based on the following transcript.
Organize the notes logically using:
- Markdown headers (h2, h3)
- Clear bullet points and numbered lists
- Bold text for key terms
- Blockquotes for important warnings or notes
- Fenced code blocks if coding/technical concepts are mentioned

Make the notes very thorough, covering all important facts, technical details, and methodologies mentioned in the transcript.

Transcript:
${transcriptText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "No notes could be generated.";
  } catch (error) {
    console.error("Error generating notes:", error);
    throw new Error("Failed to generate notes using Gemini.");
  }
};

/**
 * Generates structured study flashcards from the transcript.
 * Returns an array of { question, answer }
 */
export const generateFlashcards = async (transcriptText) => {
  try {
    const prompt = `
Based on the following video transcript, generate a list of 5-10 interactive study flashcards.
Each flashcard must test a single key concept, term, or definition mentioned in the transcript.
Keep the question short and direct. Keep the answer clear, concise, and explanatory.

You must respond with a JSON array of objects. Each object in the array must strictly have these fields:
- "question": string containing the question
- "answer": string containing the answer / definition / explanation

Transcript:
${transcriptText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const flashcards = JSON.parse(response.text);
    if (!Array.isArray(flashcards)) {
      throw new Error("Response is not a valid JSON array");
    }
    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    // Fallback flashcards in case of failure
    return [
      {
        question: "What was the main topic of the video?",
        answer:
          "Please refer to the notes and video transcript to review the main topics discussed.",
      },
    ];
  }
};

/**
 * Generates an interactive multiple-choice quiz from the transcript.
 * Returns an array of { question, options, correctAnswerIndex, explanation }
 */
export const generateQuiz = async (transcriptText) => {
  try {
    const prompt = `
Based on the following video transcript, generate a multiple-choice quiz containing 5-8 challenging questions.
For each question:
- Provide 4 distinct options (multiple-choice).
- Identify the zero-based index of the correct answer (0, 1, 2, or 3).
- Provide a detailed explanation explaining why the correct answer is correct and why other options are incorrect.

You must respond with a JSON array of objects. Each object in the array must strictly have these fields:
- "question": string containing the question
- "options": array of exactly 4 strings (options)
- "correctAnswerIndex": integer (0 to 3) representing the index of the correct option
- "explanation": string containing the detailed explanation / breakdown

Transcript:
${transcriptText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const quizzes = JSON.parse(response.text);
    if (!Array.isArray(quizzes)) {
      throw new Error("Response is not a valid JSON array");
    }
    return quizzes;
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback quiz in case of failure
    return [
      {
        question:
          "Which of the following is the best way to study from this video?",
        options: [
          "Review the structured study notes",
          "Ask questions in the AI Chat assistant",
          "Test yourself with flashcards",
          "All of the above",
        ],
        correctAnswerIndex: 3,
        explanation:
          "All tools are designed to work together to reinforce learning from the video.",
      },
    ];
  }
};
