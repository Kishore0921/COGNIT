import { NextResponse } from 'next/server';
import { ANALYSIS_PROMPT } from '@/lib/prompts';

export async function POST(request) {
  try {
    const { problem, apiKey, model = 'gemini-3.5-flash' } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required. Open Settings to add your Gemini API key.' }, { status: 400 });
    }
    const cleanKey = apiKey.trim();
    if (!problem || problem.trim().length < 10) {
      return NextResponse.json({ error: 'Problem description must be at least 10 characters.' }, { status: 400 });
    }

    const prompt = ANALYSIS_PROMPT.replace('{problem}', problem);

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
          parts: [{ text: 'You are Cognit, an expert algorithm analysis engine. Always respond with valid JSON only. No markdown fences.' }]
        },
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Gemini API Error Response:', err);
      let msg = err.error?.message || `Gemini API error: ${response.status}`;
      if (response.status === 429) {
        msg = `Gemini API Rate Limit Exceeded (429). The free tier of Gemini API is limited to 15 requests per minute. Please wait a minute and try again, or check your API key quota on Google AI Studio.`;
      }
      return NextResponse.json({ error: msg }, { status: response.status });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON - handle potential markdown fences
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
