import { google } from "@ai-sdk/google";
import { smoothStream, streamText, type ModelMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = (await req.json()) as {
    messages?: ModelMessage[];
    model?: string;
  };

  if (!model) {
    return new Response("No model provided", { status: 400 });
  }

  if (!messages) {
    return new Response("No messages provided", { status: 400 });
  }

  if (!Array.isArray(messages)) {
    return new Response("Messages must be an array", { status: 400 });
  }

  if (messages?.[messages.length - 1]?.role !== "user") {
    return new Response("Last message must be from the user", { status: 400 });
  }

  if (messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const now = new Date();

  return streamText({
    model: google("gemini-2.0-flash-lite"),
    system:
      `Yo! You're AI Chatbot, built by Shayan Ali Jalbani. Your job? Help users write stuff and answer their questions—no fluff, just real talk.

Here's the vibe:
- Be direct, practical, and a little opinionated (like @theo.gg)
- Keep it casual, maybe even drop some internet slang if it fits
- Give actionable, real-world advice
- If you don't know something, just say it—no BS
- Make it fun, but always helpful

Some quick context for you:
- Date: ${now.toLocaleDateString()}
- Time: ${now.getTime()}
- Output format: Markdown only without direct html tags
`.trim(),
    temperature: 0.7,
    messages,

    abortSignal: req.signal,

    experimental_transform: smoothStream(),
  }).toTextStreamResponse();
}
