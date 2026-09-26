import { NextRequest, NextResponse } from 'next/server';

interface SpatialDirectorResponse {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  timecodeScale: number;
  focusActor: string;
}

const SYSTEM_PROMPT = `You are ChronoSplat 4D's Spatial Copilot. Convert natural language director instructions into 6DoF camera vectors and audio focus targets. Output strictly valid JSON without any markdown code fences or explanatory prose.
The output MUST have these exact keys:
- cameraX: number (-5.0 to 5.0)
- cameraY: number (0.0 to 5.0)
- cameraZ: number (-5.0 to 5.0)
- timecodeScale: number (0.1 to 2.0)
- focusActor: string (e.g. "actor-lead", "actor-support", or "ambient-scene")`;

function cleanAndParseJson<T>(rawText: string): T {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

function computeHeuristicFallback(prompt: string): SpatialDirectorResponse {
  const lower = prompt.toLowerCase();
  let cameraX = 0.0;
  let cameraY = 1.2;
  let cameraZ = 2.5;
  let timecodeScale = 1.0;
  let focusActor = 'actor-lead';

  if (lower.includes('close') || lower.includes('zoom') || lower.includes('intimate')) {
    cameraZ = 0.8;
    cameraY = 1.4;
  } else if (lower.includes('wide') || lower.includes('diorama') || lower.includes('panoramic')) {
    cameraZ = 4.2;
    cameraY = 2.0;
  }

  if (lower.includes('left') || lower.includes('profile')) {
    cameraX = -1.8;
  } else if (lower.includes('right')) {
    cameraX = 1.8;
  }

  if (lower.includes('slow') || lower.includes('bullet') || lower.includes('dramatic')) {
    timecodeScale = 0.3;
  } else if (lower.includes('fast') || lower.includes('rush')) {
    timecodeScale = 1.7;
  }

  if (lower.includes('support') || lower.includes('background') || lower.includes('secondary')) {
    focusActor = 'actor-support';
  } else if (lower.includes('ambient') || lower.includes('world') || lower.includes('crowd')) {
    focusActor = 'ambient-scene';
  }

  return { cameraX, cameraY, cameraZ, timecodeScale, focusActor };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt : 'Focus on the protagonist with a dramatic cinematic orbit';

    // Step 1: Primary - Google Gemini 1.5 Flash
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nDirector Instruction: "${prompt}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = cleanAndParseJson<SpatialDirectorResponse>(rawText);
            return NextResponse.json({
              engine: 'Google Gemini 1.5 Flash',
              status: 'success',
              data: parsed,
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini Spatial Director call failed, failing over to NVIDIA Nemotron:', geminiError);
      }
    }

    // Step 2: Fallback - NVIDIA Nemotron NIM
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (nvidiaKey) {
      try {
        const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${nvidiaKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-4-340b-instruct',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 512,
          }),
        });

        if (nvidiaRes.ok) {
          const nvidiaData = await nvidiaRes.json();
          const rawText = nvidiaData?.choices?.[0]?.message?.content;
          if (rawText) {
            const parsed = cleanAndParseJson<SpatialDirectorResponse>(rawText);
            return NextResponse.json({
              engine: 'NVIDIA Nemotron (Failover Active)',
              status: 'success',
              data: parsed,
            });
          }
        }
      } catch (nvidiaError) {
        console.warn('NVIDIA Nemotron call failed, engaging deterministic fallback:', nvidiaError);
      }
    }

    // Step 3: Deterministic Spatial Simulation Fallback
    const simulatedData = computeHeuristicFallback(prompt);
    return NextResponse.json({
      engine: 'Deterministic Spatial Simulation (Offline Fallback)',
      status: 'success',
      data: simulatedData,
    });
  } catch (error) {
    console.error('Spatial Director route error:', error);
    return NextResponse.json(
      {
        engine: 'Error Recovery Fallback',
        status: 'error',
        data: computeHeuristicFallback('default'),
      },
      { status: 500 }
    );
  }
}
