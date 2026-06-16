import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
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

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from Groq" },
        { status: 500 }
      );
    }

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      return NextResponse.json(
        {
          error: "Model did not return valid JSON",
          raw: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}