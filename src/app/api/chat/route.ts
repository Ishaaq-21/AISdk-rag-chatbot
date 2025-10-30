import { streamText, UIMessage, convertToModelMessages } from "ai";

import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openrouter.chat("deepseek/deepseek-chat"),
      messages: convertToModelMessages(messages),
    });
    console.log("Streaming chat completion...", result);
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error streaming chat completion", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
