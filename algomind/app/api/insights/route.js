import { NextResponse } from 'next/server';
import { INSIGHTS_PROMPT } from '@/lib/prompts';

export async function POST(request) {
  try {
    const { stats, apiKey, model = 'gemini-3.5-flash' } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    }

    const cleanKey = apiKey.trim();

    // Build paradigm string
    const paradigmStr = Object.entries(stats.paradigms || {})
      .map(([name, count]) => `${name}: ${count} problems`)
      .join(', ') || 'None yet';

    const prompt = INSIGHTS_PROMPT
      .replace('{totalProblems}', stats.totalProblems || 0)
      .replace('{paradigms}', paradigmStr)
      .replace('{easy}', stats.difficulties?.easy || 0)
      .replace('{medium}', stats.difficulties?.medium || 0)
      .replace('{hard}', stats.difficulties?.hard || 0);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        systemInstruction: {
          parts: [{ text: 'You are Cognit, a personalized AI coding coach. Always respond with valid JSON only. No markdown fences.' }]
        },
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      let msg = err.error?.message || `Gemini API error: ${response.status}`;
      if (response.status === 429) {
        msg = 'Rate limit exceeded. Please wait a minute and try again.';
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
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
