import { NextRequest, NextResponse } from 'next/server';

const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.1';
const HF_URL   = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const TIMEOUT_MS = 20_000;

export interface InsightRequest {
  empresa:      string;
  sector:       string;
  tamanio:      string;
  ciudad?:      string;
  puntaje:      number;
  nivel:        string;
  dimDebil:     string;
  puntajeDebil: number;
  dimFuerte:    string;
  puntajeFuerte: number;
}

function buildPrompt(d: InsightRequest): string {
  const ciudad = d.ciudad ? `, ubicada en ${d.ciudad},` : '';
  return `<s>[INST] Eres un consultor experto en transformación digital para PYMES TIC de Colombia. Escribe exactamente 3 oraciones en español, sin listas, sin títulos, en tono profesional y motivador. Contextualiza el diagnóstico de esta empresa específica.

Datos: empresa "${d.empresa}"${ciudad} del sector ${d.sector.replace(/_/g, ' ')} (tamaño ${d.tamanio}). Puntaje global: ${d.puntaje}/100, nivel "${d.nivel}". Dimensión más débil: ${d.dimDebil} (${d.puntajeDebil}/100). Dimensión más fuerte: ${d.dimFuerte} (${d.puntajeFuerte}/100).

Párrafo ejecutivo de 3 oraciones: [/INST]`;
}

function limpiarTexto(raw: string): string {
  return raw
    .replace(/^\s*\[\/INST\]\s*/i, '')
    .replace(/^(párrafo|resumen|análisis)[:\s]*/i, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{2,}/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  const token = process.env.HF_API_TOKEN;
  if (!token) {
    return NextResponse.json({ insight: null, source: 'no_token' });
  }

  let body: InsightRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const prompt = buildPrompt(body);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const hfRes = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens:   220,
          temperature:      0.65,
          top_p:            0.9,
          return_full_text: false,
          do_sample:        true,
        },
        options: { wait_for_model: true },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (hfRes.status === 503) {
      return NextResponse.json({ insight: null, source: 'loading' });
    }
    if (!hfRes.ok) {
      return NextResponse.json({ insight: null, source: 'hf_error' });
    }

    const data = await hfRes.json() as Array<{ generated_text: string }>;
    const raw = data?.[0]?.generated_text ?? '';
    const insight = limpiarTexto(raw);

    if (insight.length < 30) {
      return NextResponse.json({ insight: null, source: 'empty' });
    }

    return NextResponse.json({ insight, source: 'hf' });

  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return NextResponse.json({ insight: null, source: isAbort ? 'timeout' : 'error' });
  }
}
