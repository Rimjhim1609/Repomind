import { GoogleGenerativeAI, type EmbedContentRequest } from "@google/generative-ai";
//import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use Google's production active flash model
const flashModel = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retries a Gemini call when Google is temporarily overloaded (503)
 * or rate-limiting us (429). Any other error is thrown immediately.
 */
async function withRetry<T>(task: () => Promise<T>, maxAttempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      const status = (error as { status?: number }).status;
      const isRetryable = status === 503 || status === 429;
      if (!isRetryable || attempt >= maxAttempts) throw error;
      await sleep(attempt * 5000); // waits 5s, 10s, 15s
    }
  }
}

export const aiSummariseCommit = async (diff: string) => {
  try {
    const result = await withRetry(() =>
      flashModel.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.
      Reminders about the git diff format:
      For every file, there are a few metadata lines, like (for example):
      \`\`\`
      diff --git a/lib/index.js b/lib/index.js
      index aadf691..bfef603 100644
      --- a/lib/index.js
      +++ b/lib/index.js
      \`\`\`
      Then there is a specifier of the lines that were modified.
      A line starting with \`+\` means it was added.
      A line starting with \`-\` means that line was deleted.
      Please summarise the following diff file succinctly: \n\n${diff.slice(0, 15000)}`,
      ]),
    );

    return result.response.text();
  } catch (error) {
    console.error("Error summarizing commit diff:", error);
    return "Commit changes recorded";
  }
};

export async function summariseCode(doc: Document) {
  const code = doc.pageContent.slice(0, 10000);
  const sourceName = doc.metadata?.source || "source file";

  try {
    const result = await withRetry(() =>
      flashModel.generateContent([
        `You are a senior software engineer explaining the codebase to a new team member.
      Explain the purpose and architecture of the ${sourceName} file in no more than 80 words.
      ---
      ${code}
      ---`,
      ]),
    );

    const summary = result.response.text().trim();
    return summary || `Source code file ${sourceName}`;
  } catch (error) {
    console.warn(`Fallback summary used for ${sourceName}:`, error);
    return `Source file ${sourceName} containing ${code.split("\n").length} lines of code.`;
  }
}

export async function generateEmbedding(summary: string) {
  // gemini-embedding-001 can return 768 numbers, which matches the vector(768) column in Postgres
  const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
  });

  const request: EmbedContentRequest & { outputDimensionality: number } = {
    content: { role: "user", parts: [{ text: summary.trim() || "Source code component" }] },
    outputDimensionality: 768,
  };

  const result = await withRetry(() => embeddingModel.embedContent(request));

  return result.embedding.values;
}