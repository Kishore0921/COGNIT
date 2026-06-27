import { NextResponse } from 'next/server';
import { HINT_PROMPTS } from '@/lib/prompts';

export async function POST(request) {
  try {
    const { problem, algorithm, level, apiKey, model = 'gemini-3.5-flash' } = await request.json();

    if (!apiKey) return NextResponse.json({ error: 'API key required' }, { status: 400 });
    const cleanKey = apiKey.trim();
    if (level < 1 || level > 5) return NextResponse.json({ error: 'Hint level must be 1-5' }, { status: 400 });

    const prompt = HINT_PROMPTS[level]
      .replace(/\{problem\}/g, problem)
      .replace(/\{algorithm\}/g, algorithm);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [{ text: 'You are a patient coding mentor. Always respond with valid JSON only. No markdown fences, no preamble, no trailing text.' }]
        },
        generationConfig: {
          temperature: 0.5,
          responseMimeType: 'application/json',
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
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Parse the structured JSON hint
    let hint;
    try {
      hint = JSON.parse(rawText);
    } catch {
      // Fallback: strip any accidental markdown fences and retry
      const stripped = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        hint = JSON.parse(stripped);
      } catch {
        // Last resort: return as plain text in the old format
        hint = {
          title: `Level ${level} Hint`,
          level_name: ['Nudge','Direction','Approach','Pseudocode','Solution'][level - 1],
          explanation: rawText,
          steps: [],
          key_insight: '',
          code_snippet: null,
        };
      }
    }

    return NextResponse.json({ hint, level });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
