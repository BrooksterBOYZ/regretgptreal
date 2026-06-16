import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are RegretGPT.

Return ONLY valid JSON:
{
  "immediate": string,
  "one_month": string,
  "one_year": string,
  "regret_score": number (0-100),
  "advice": string
}
          `.trim(),
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    console.log("RAW AI RESPONSE:", content);

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON from AI",
          raw: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("API ERROR:", err);
    const message = err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}