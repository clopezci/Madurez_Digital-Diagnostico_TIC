import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET ?? '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://madurez-digital-diagnostico-tic.vercel.app';

// Raw REST helpers — avoids supabase-js client issues in Vercel Node runtime
async function sbFetch(url: string, serviceKey: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options?.headers ?? {}),
    },
  });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Trim to remove accidental whitespace/newlines from copy-paste in Vercel
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  const resendApiKey = (process.env.RESEND_API_KEY ?? '').trim();

  const missing = [
    !supabaseUrl        && 'NEXT_PUBLIC_SUPABASE_URL',
    !supabaseServiceKey && 'SUPABASE_SERVICE_ROLE_KEY',
    !resendApiKey       && 'RESEND_API_KEY',
  ].filter(Boolean);
  if (missing.length) {
    return NextResponse.json({ error: 'Not configured', missing }, { status: 503 });
  }

  // Quick connectivity test before the real query
  try {
    const ping = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      cache: 'no-store',
      headers: { apikey: supabaseServiceKey },
    });
    if (!ping.ok && ping.status !== 401) {
      return NextResponse.json({ error: `Supabase unreachable: HTTP ${ping.status}`, url: supabaseUrl }, { status: 502 });
    }
  } catch (pingErr) {
    return NextResponse.json({
      error: 'Supabase unreachable',
      url: supabaseUrl,
      urlLen: supabaseUrl.length,
      cause: String((pingErr as { cause?: unknown })?.cause ?? pingErr),
    }, { status: 502 });
  }

  const restBase = `${supabaseUrl}/rest/v1`;
  const ahora = new Date().toISOString();

  try {
    // Query pending reminders via raw REST
    const queryUrl = `${restBase}/recordatorios_90dias?select=*&enviado=eq.false&fecha_recordatorio=lte.${encodeURIComponent(ahora)}&limit=50`;
    const res = await sbFetch(queryUrl, supabaseServiceKey);

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `Supabase REST ${res.status}`, body },
        { status: 500 }
      );
    }

    const pendientes: Record<string, unknown>[] = await res.json();
    let enviados = 0;

    for (const r of pendientes) {
      const html = buildEmail(r, BASE_URL);
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'DiagnosticoTIC <onboarding@resend.dev>',
          to: [r.email as string],
          subject: `¡Han pasado 90 días! ¿Cómo va tu transformación digital, ${(r.nombre as string)?.split(' ')[0] ?? ''}?`,
          html,
        }),
      });

      if (emailRes.ok) {
        await sbFetch(
          `${restBase}/recordatorios_90dias?id=eq.${r.id}`,
          supabaseServiceKey,
          {
            method: 'PATCH',
            body: JSON.stringify({ enviado: true, fecha_envio: new Date().toISOString() }),
          }
        );
        enviados++;
      }
    }

    return NextResponse.json({ ok: true, enviados, total: pendientes.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const cause = (e as { cause?: unknown })?.cause;
    return NextResponse.json(
      { error: msg, cause: cause ? String(cause) : undefined },
      { status: 500 }
    );
  }
}

function buildEmail(r: Record<string, unknown>, baseUrl: string): string {
  const nombre = (r.nombre as string)?.split(' ')[0] ?? 'Hola';
  const puntaje = r.puntaje_global as number;
  const nivel = r.nivel_global as string;
  const diagId = r.diagnostico_id as string;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
        <tr><td style="background:#6366f1;padding:28px 32px">
          <span style="color:white;font-weight:700;font-size:16px">📊 DiagnosticoTIC</span>
        </td></tr>
        <tr><td style="padding:32px">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827">¡Han pasado 90 días, ${nombre}!</h1>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6">
            Hace tres meses realizaste tu diagnóstico con resultado
            <strong style="color:#111827">${puntaje}/100</strong> — nivel <strong style="color:#6366f1">${nivel}</strong>.
          </p>
          <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
            <p style="margin:0;font-size:48px;font-weight:900;color:#6366f1;line-height:1">${puntaje}</p>
            <p style="margin:4px 0 0;font-size:14px;color:#6366f1;font-weight:600">${nivel}</p>
          </div>
          <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
            <a href="${baseUrl}/diagnostico" style="display:inline-block;background:#6366f1;color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none">
              Hacer nuevo diagnóstico
            </a>
          </td></tr></table>
          <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center">
            <a href="${baseUrl}/resultados/${diagId}" style="color:#6366f1">Ver diagnóstico anterior</a>
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #f3f4f6">
          <p style="margin:0;font-size:12px;color:#d1d5db;text-align:center">
            DiagnosticoTIC · UPB-SAPIENCIA 2026 · Ley 1581/2012 —
            <a href="mailto:clpezci@gmail.com" style="color:#6366f1">Desuscribirse</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
