import ai from "../config/gemini.js";

/**
 * Generates summary, detailed notes, flashcards, and a quiz in a single structured JSON response.
 * This heavily reduces the number of tokens used and prevents hitting Gemini free-tier rate limits.
 */
export const generateAllStudyMaterials = async (transcriptText) => {
  try {
    const prompt = `
You are an expert tutor and study-note creator.
Based on the following video transcript, generate comprehensive study materials.
You MUST respond with a valid JSON object matching the following structure exactly. 

CRITICAL JSON FORMATTING RULES:
1. Do NOT wrap the JSON in markdown blocks like \`\`\`json.
2. ALL newlines inside string values MUST be escaped as \\n. NEVER use raw newlines inside string values.
3. Escape all double quotes inside string values as \\".
4. Ensure the JSON is perfectly valid and strictly parseable.

{
  "summary": "A concise, high-level summary of the video. Focus on main objectives, core concepts, and key conclusions. Keep it highly readable and under 3-4 paragraphs.",
  "notes": "Detailed, structured Markdown study notes using Markdown headings (#, ##, ###), bullet points, and tables. Make it visually attractive like professional university notes. Bold important terminology.",
  "flashcards": [
    {
      "question": "string (keep it short and direct)",
      "answer": "string (clear, concise explanation)"
    }
  ],
  "quizzes": [
    {
      "question": "string (max 2 lines, clean and exam-style)",
      "options": ["string", "string", "string", "string"],
      "correctAnswerIndex": 0,
      "explanation": "string"
    }
  ]
}

Ensure "flashcards" has 5-10 items and "quizzes" has 5-8 items.

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

    let responseText = response.text;
    
    // Clean potential markdown wrappers and trailing commas
    responseText = responseText.replace(/^```(json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    
    const result = JSON.parse(responseText);

    // Validate the response structure
    if (
      !result.summary ||
      !result.notes ||
      !Array.isArray(result.flashcards) ||
      !Array.isArray(result.quizzes)
    ) {
      throw new Error("Invalid structure returned from Gemini");
    }

    return result;
  } catch (error) {
    console.error("Error generating combined study materials:", error);
    
    // Provide a fallback in case of failure
    return {
      summary: "No summary could be generated.",
      notes: "## Notes Unavailable\n\nNotes could not be generated at this time.",
      flashcards: [
        {
          question: "What was the main topic of the video?",
          answer: "Please refer to the video transcript to review the main topics discussed.",
        },
      ],
      quizzes: [
        {
          question: "What is the main purpose of this video?",
          options: [
            "Understand key concepts",
            "Memorize full code examples",
            "Ignore explanations",
            "Skip learning process",
          ],
          correctAnswerIndex: 0,
          explanation: "The goal of the video content is to help learners understand core concepts clearly.",
        },
      ],
    };
  }
};
