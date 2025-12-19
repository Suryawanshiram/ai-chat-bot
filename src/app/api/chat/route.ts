import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    messages,
  });

  return NextResponse.json({
    role: "user",
    content: result.text,
  });
}
