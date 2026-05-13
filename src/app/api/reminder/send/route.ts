import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic so env vars are read at request time, not build time
export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET ?? '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://madurez-digital-diagnostico-tic.vercel.app';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Read env vars inside the handler so they're always fresh at runtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  const resendApiKey = process.env.RESEND_API_KEY ?? '';

  const missing = [
    !supabaseUrl        && 'NEXT_PUBLIC_SUPABASE_URL',
    !supabaseServiceKey && 'SUPABASE_SERVICE_ROLE_KEY',
    !resendApiKey       && 'RESEND_API_KEY',
  ].filter(Boolean);
  if (missing.length) {
    return NextResponse.json({ error: 'Not configured', missing }, { status: 503 });
  }

  try {
    // Disable session persistence — this is a server-side admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // Use native fetch with no-store to bypass Next.js fetch caching
        fetch: (url: RequestInfo | URL, options?: RequestInit) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    });

    const ahora = new Date().toISOString();

    const { data: pendientes, error } = await supabase
      .from('recordatorios_90dias')
      .select('*')
      .eq('enviado', false)
      .lte('fecha_recordatorio', ahora)
      .limit(50);

    if (error || !pendientes) {
      return NextResponse.json(
        { error: error?.message ?? 'Query failed', code: error?.code },
        { status: 500 }
      );
    }

    let enviados = 0;

    for (const r of pendientes) {
      const html = buildEmail(r, BASE_URL);
      const res = await fetch('https://api.resend.com/emails', {
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

      if (res.ok) {
        await supabase
          .from('recordatorios_90dias')
          .update({ enviado: true, fecha_envio: new Date().toISOString() })
          .eq('id', r.id);
        enviados++;
      }
    }

    return NextResponse.json({ ok: true, enviados, total: pendientes.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const cause = e instanceof Error && (e as NodeJS.ErrnoException).cause
      ? String((e as NodeJS.ErrnoException).cause)
      : undefined;
    return NextResponse.json({ error: msg, cause }, { status: 500 });
  }
}

function buildEmail(r: Record<string, unknown>, baseUrl: string): string {
  const nombre = (r.nombre as string)?.split(' ')[0] ?? 'Hola';
  const puntaje = r.puntaje_global as number;
  const nivel = r.nivel_global as string;
  const diagId = r.diagnostico_id as string;

  return `
<!DOCTYPE html>
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
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827">
            ¡Han pasado 90 días, ${nombre}!
          </h1>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6">
            Hace tres meses realizaste tu diagnóstico con un resultado de
            <strong style="color:#111827">${puntaje}/100</strong> (nivel <strong style="color:#6366f1">${nivel}</strong>).
          </p>
          <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
            <p style="margin:0;font-size:48px;font-weight:900;color:#6366f1;line-height:1">${puntaje}</p>
            <p style="margin:4px 0 0;font-size:14px;color:#6366f1;font-weight:600">${nivel}</p>
          </div>
          <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
            <a href="${baseUrl}/diagnostico"
               style="display:inline-block;background:#6366f1;color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none">
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
