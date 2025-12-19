import { gemini } from "@ai-sdk/gemini"; // Vercel Gemini SDK
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { cookies } from "next/headers";
import { getClient } from "@/lib/mcpClient";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const cookieStore = await cookies();
  const mcpSessionId = cookieStore.get("mcp-session-id")?.value;

  try {
    // Initialize MCP client
    const { client, sessionId } = await getClient(mcpSessionId ?? undefined);

    // Get any tools if needed
    const tools = await client.tools();

    // Use Gemini model instead of OpenAI
    const result = streamText({
      model: gemini({
        apiKey: process.env.GEMINI_API_KEY, // your Gemini API key from Vercel
        model: "gemini-1.5", // example model, adjust if needed
      }),
      messages: convertToModelMessages(messages),
      tools,
      onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        // optional callback
      },
    });

    const response = result.toUIMessageStreamResponse();

    // Store MCP session ID in cookie
    if (sessionId) {
      cookieStore.set("mcp-session-id", sessionId, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400, // 24 hours
      });
    }

    return response;
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
