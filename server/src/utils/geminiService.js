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
You are an elite university professor and study-note creator.

Convert the transcript into BEAUTIFULLY FORMATTED MARKDOWN STUDY NOTES.

IMPORTANT FORMATTING RULES:

# Video Title / Topic

## Overview
Write a short overview of the lesson.

## Key Concepts

For every major concept:

### Concept Name

- Important point
- Important point
- Important point

### Example

> Provide examples when available.

### Key Takeaways

- Takeaway 1
- Takeaway 2

## Detailed Notes

Use:
- Bullet points
- Numbered lists
- Tables when useful
- Bold important terminology
- Blockquotes for important ideas

Example table format:

| Term | Meaning |
|------|---------|
| Example | Description |

## Important Facts

- Fact 1
- Fact 2
- Fact 3

## Exam Notes

### Things to Remember

- Important exam point
- Important exam point

### Common Mistakes

- Mistake 1
- Mistake 2

## Summary

Provide a concise summary of the lesson.

STRICT RULES:
- ALWAYS use Markdown headings (# ## ###)
- ALWAYS use bullet points
- NEVER return plain paragraphs only
- Format content like professional university notes
- Make notes visually attractive and easy to scan
- Use bold text frequently for important concepts
- Use tables whenever concepts can be compared

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
You are an expert quiz generator for students.

Create 5–8 multiple-choice questions from the transcript.

STRICT RULES:
- Questions MUST be short and readable (max 2 lines)
- DO NOT include code blocks (no \`\`\`)
- DO NOT include long JavaScript or examples inside questions
- If code is needed, summarize it in plain English
- Keep each question clean and exam-style
- Options must be short (max 1 line each)
- Avoid explanations inside questions

OUTPUT FORMAT (STRICT JSON ONLY):
Return ONLY a valid JSON array. No markdown. No extra text.

Each object must have:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswerIndex": 0,
  "explanation": "string"
}

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
      throw new Error("Invalid quiz format");
    }

    return quizzes;
  } catch (error) {
    console.error("Error generating quiz:", error);

    return [
      {
        question: "What is the main purpose of this video?",
        options: [
          "Understand key concepts",
          "Memorize full code examples",
          "Ignore explanations",
          "Skip learning process",
        ],
        correctAnswerIndex: 0,
        explanation:
          "The goal of the video content is to help learners understand core concepts clearly.",
      },
    ];
  }
};
