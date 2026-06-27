import { NextResponse } from 'next/server';
import { VIVA_PROMPT } from '@/lib/prompts';

export async function POST(request) {
  try {
    const { problem, algorithm, code, apiKey, model = 'gemini-3.5-flash' } = await request.json();

    if (!apiKey) return NextResponse.json({ error: 'API key required' }, { status: 400 });
    const cleanKey = apiKey.trim();

    const prompt = VIVA_PROMPT
      .replace('{problem}', problem)
      .replace('{algorithm}', algorithm)
      .replace('{code}', code || 'Not provided')
      .replace('{language}', 'python');

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
          parts: [{ text: 'You are a CS professor. Respond with a valid JSON array only, no markdown fences.' }]
        },
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
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
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse viva questions' }, { status: 500 });
    }

    return NextResponse.json({ questions: parsed });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
