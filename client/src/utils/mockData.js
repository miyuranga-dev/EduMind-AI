export const MOCK_VIDEOS = [
  {
    _id: "mock-video-1",
    videoId: "Ke90Tje7VS0",
    title: "React in 100 Seconds",
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    channelTitle: "Fireship",
    savedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    userProgress: {
      masteredFlashcards: [],
      quizAttempts: [],
      notesCompleted: false,
    },
  },
  {
    _id: "mock-video-2",
    videoId: "zjkBMFhNj_g",
    title: "How Transformers Work (Transformers & LLMs Explained)",
    thumbnail: "https://img.youtube.com/vi/zjkBMFhNj_g/maxresdefault.jpg",
    channelTitle: "3Blue1Brown",
    savedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    userProgress: {
      masteredFlashcards: ["card-1", "card-3"],
      quizAttempts: [
        {
          score: 3,
          totalQuestions: 4,
          completedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
        },
      ],
      notesCompleted: true,
    },
  },
];

export const getMockStudyMaterials = (videoId, title = "Study Material") => {
  return {
    video: {
      _id: `mock-video-${videoId}`,
      videoId: videoId,
      title: title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      channelTitle: "EduMind AI Academy",
      transcript: [
        {
          text: "Welcome to this educational session on modern software engineering.",
          start: 0,
          duration: 4.5,
        },
        {
          text: "Today, we are going to explore core architectures and how systems scale.",
          start: 4.5,
          duration: 5,
        },
        {
          text: "We will cover clients, servers, and database normalization paradigms.",
          start: 9.5,
          duration: 6.2,
        },
        {
          text: "First, let's understand why we use a client-server architecture model.",
          start: 15.7,
          duration: 5.1,
        },
        {
          text: "The client acts as the interface, rendering data and capturing user interactions.",
          start: 20.8,
          duration: 6,
        },
        {
          text: "The server handles business logic, security permissions, and API endpoints.",
          start: 26.8,
          duration: 5.5,
        },
        {
          text: "Lastly, the database stores state persistently, ensuring transactions are ACID compliant.",
          start: 32.3,
          duration: 6.8,
        },
        {
          text: "ACID stands for Atomicity, Consistency, Isolation, and Durability.",
          start: 39.1,
          duration: 5.9,
        },
        {
          text: "To optimize queries, database normalization removes redundant data points.",
          start: 45,
          duration: 6.1,
        },
        {
          text: "However, over-normalization can sometimes lead to excessive table joins.",
          start: 51.1,
          duration: 5,
        },
        {
          text: "Therefore, a balanced approach combining SQL indexing is crucial.",
          start: 56.1,
          duration: 4.8,
        },
        {
          text: "That wraps up our quick summary of basic scaling and architecture concepts.",
          start: 60.9,
          duration: 5.1,
        },
      ],
    },
    studyMaterial: {
      summary: `This tutorial provides a clear introduction to full-stack application architecture and database scaling. It explains the distinct roles of the frontend client, the backend business logic server, and persistent database storage. Additionally, it highlights database normalization standards, explains the ACID transaction model (Atomicity, Consistency, Isolation, Durability), and discusses query optimization using indexes.`,
      notes: `# Full-Stack Application Architecture & Scaling Notes

## 1. Client-Server Model
The **client-server architecture** is the foundation of modern web applications, segregating concerns between presentation and logic layers.

*   **Client (Frontend)**:
    *   Responsible for rendering UI elements.
    *   Captures user input and sends network requests.
    *   Maintains local state.
*   **Server (Backend)**:
    *   Exposes secure API endpoints (REST / GraphQL).
    *   Executes business logic.
    *   Authenticates users and handles authorizations.

---

## 2. Database Fundamentals & ACID
State is stored persistently in a database. Transactions in enterprise databases must adhere to **ACID** properties:

1.  **Atomicity**: All operations in a transaction succeed, or the entire transaction is rolled back.
2.  **Consistency**: Database transitions from one valid state to another, maintaining constraints.
3.  **Isolation**: Concurrent execution of transactions yields the same state as sequential execution.
4.  **Durability**: Once committed, transactions remain saved even in the event of a system crash.

---

## 3. Database Normalization & Performance
Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity.

*   **Benefits**: Reduces disk storage space and ensures data consistency across rows.
*   **Trade-offs**: Over-normalization can lead to complex queries requiring too many SQL \`JOIN\` statements.
*   **Optimization**: Indexing columns frequently used in \`WHERE\` clauses dramatically speeds up read operations by avoiding sequential table scans.
`,
      flashcards: [
        {
          _id: "card-1",
          question:
            "What does the 'A' in ACID transactions stand for, and what does it guarantee?",
          answer:
            "Atomicity. It guarantees that either all operations in a database transaction succeed, or the entire transaction is completely rolled back, leaving the database unchanged.",
        },
        {
          _id: "card-2",
          question:
            "What is the primary trade-off of over-normalizing a relational database?",
          answer:
            "Over-normalization requires numerous JOIN operations to retrieve related data, which can degrade query performance on large tables.",
        },
        {
          _id: "card-3",
          question: "How does a database Index speed up search queries?",
          answer:
            "An index creates a search data structure (like a B-Tree) that allows the database engine to find specific rows quickly without performing a slow full-table scan.",
        },
        {
          _id: "card-4",
          question:
            "What is the main role of a Client in the Client-Server model?",
          answer:
            "The client acts as the user interface, responsible for rendering data, capturing user inputs, and sending requests to the server.",
        },
      ],
      quizzes: [
        {
          _id: "q-1",
          question:
            "Which transaction property ensures that concurrent transactions don't interfere with each other?",
          options: ["Atomicity", "Consistency", "Isolation", "Durability"],
          correctAnswerIndex: 2,
          explanation:
            "Isolation guarantees that the execution of concurrent transactions yields the same database state as if they were executed sequentially, preventing intermediate modifications from colliding.",
        },
        {
          _id: "q-2",
          question: "What is the main goal of database normalization?",
          options: [
            "To encrypt database passwords securely",
            "To minimize data redundancy and prevent anomalies",
            "To create backups of the server storage",
            "To merge client and server states into one table",
          ],
          correctAnswerIndex: 1,
          explanation:
            "Database normalization organizes tables and columns to ensure data redundancy is minimized and that dependencies are logically stored, preventing insert, update, and delete anomalies.",
        },
        {
          _id: "q-3",
          question:
            "What happens if a database transaction fails during an Atomic execution?",
          options: [
            "The database corrupts instantly",
            "Half of the changes are written, half are discarded",
            "All changes are fully rolled back, leaving state clean",
            "The system alerts the client to manually delete the rows",
          ],
          correctAnswerIndex: 2,
          explanation:
            "Atomicity is an all-or-nothing guarantee. If any operation within the transaction boundary fails, the entire transaction is aborted and rolled back, ensuring no partial data is written.",
        },
      ],
    },
  };
};
