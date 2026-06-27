import { NextResponse } from 'next/server';
import { CODE_GEN_PROMPT } from '@/lib/prompts';

export async function POST(request) {
  try {
    const { problem, algorithm, language, apiKey, model = 'gemini-3.5-flash' } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }
    const cleanKey = apiKey.trim();

    const prompt = CODE_GEN_PROMPT
      .replace(/\{problem\}/g, problem)
      .replace(/\{algorithm\}/g, algorithm)
      .replace(/\{language\}/g, language);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        systemInstruction: {
          parts: [{ text: `You are an expert ${language} programmer. Output ONLY clean code, no markdown fences, no explanations outside code comments.` }]
        },
        generationConfig: {
          temperature: 0.2
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      let msg = err.error?.message || `Gemini API error: ${response.status}`;
      if (response.status === 429) {
        msg = `Gemini API Rate Limit Exceeded (429). The free tier of Gemini API is limited to 15 requests per minute. Please wait a minute and try again, or check your API key quota on Google AI Studio.`;
      }
      return NextResponse.json({ error: msg }, { status: response.status });
    }

    const data = await response.json();
    let code = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown fences if present
    code = code.replace(/^```\w*\n?/gm, '').replace(/```$/gm, '').trim();

    return NextResponse.json({ code, language });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
