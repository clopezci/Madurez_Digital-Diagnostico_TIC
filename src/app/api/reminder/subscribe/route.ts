import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { userId, email, nombre, diagnosticoId, puntajeGlobal, nivelGlobal, fecha } =
    await req.json();

  if (!userId || !email || !diagnosticoId) {
    return NextResponse.json({ error: 'Datos requeridos.' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabase.from('recordatorios_90dias').upsert({
    user_id: userId,
    email,
    nombre,
    diagnostico_id: diagnosticoId,
    puntaje_global: puntajeGlobal,
    nivel_global: nivelGlobal,
    fecha_diagnostico: fecha,
    fecha_recordatorio: new Date(new Date(fecha).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    enviado: false,
  }, { onConflict: 'diagnostico_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
