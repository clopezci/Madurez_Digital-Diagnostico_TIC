'use client';
/**
 * Capa de persistencia con doble modo:
 *  - Supabase (cuando NEXT_PUBLIC_SUPABASE_URL está configurado)
 *  - localStorage (fallback para desarrollo sin Supabase)
 */
import { supabase, isSupabaseEnabled } from './supabase';
import type { DiagnosticoResultado, Usuario, BenchmarkDatos } from '@/types';

// ─── helpers ──────────────────────────────────────────────────────────────────

function isBrowser() {
  return typeof window !== 'undefined';
}

const LS = {
  usuarios:    'md_usuarios',
  sesion:      'md_sesion',
  diagnosticos:'md_diagnosticos',
} as const;

function mapRow(row: Record<string, unknown>): DiagnosticoResultado {
  return {
    id:            row.id as string,
    fecha:         row.fecha as string,
    empresa: {
      nombre:   row.empresa_nombre as string,
      sector:   row.empresa_sector as string,
      tamanio:  row.empresa_tamanio as DiagnosticoResultado['empresa']['tamanio'],
      cargo:    row.empresa_cargo as string,
      ciudad:   row.empresa_ciudad as string | undefined,
    },
    respuestas:     row.respuestas     as DiagnosticoResultado['respuestas'],
    resultados:     row.resultados     as DiagnosticoResultado['resultados'],
    puntajeGlobal:  row.puntaje_global as number,
    nivelGlobal:    row.nivel_global   as DiagnosticoResultado['nivelGlobal'],
    recomendaciones:row.recomendaciones as DiagnosticoResultado['recomendaciones'],
    ruta90Dias:     row.ruta_90_dias   as DiagnosticoResultado['ruta90Dias'],
    benchmark:      row.benchmark      as DiagnosticoResultado['benchmark'],
    tokenPublico:   row.token_publico  as string | undefined,
    compartidoPublicamente: row.compartido_publicamente as boolean | undefined,
  };
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function registrarUsuario(
  nombre: string,
  email: string,
  password: string,
): Promise<{ ok: true; usuario: Usuario } | { ok: false; error: string }> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    if (error) return { ok: false, error: traducirErrorSupabase(error.message) };
    if (!data.user) return { ok: false, error: 'No se pudo crear el usuario.' };
    return {
      ok: true,
      usuario: {
        id: data.user.id,
        email: data.user.email ?? email,
        nombre: data.user.user_metadata?.nombre ?? nombre,
        createdAt: data.user.created_at,
      },
    };
  }

  // ── fallback localStorage ──
  if (!isBrowser()) return { ok: false, error: 'No disponible.' };
  const usuarios: (Usuario & { passwordHash: string })[] =
    JSON.parse(localStorage.getItem(LS.usuarios) ?? '[]');
  if (usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: 'Este correo ya está registrado.' };
  const nuevo = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    nombre: nombre.trim(),
    createdAt: new Date().toISOString(),
    passwordHash: btoa(password),
  };
  usuarios.push(nuevo);
  localStorage.setItem(LS.usuarios, JSON.stringify(usuarios));
  const { passwordHash: _, ...usuario } = nuevo;
  localStorage.setItem(LS.sesion, JSON.stringify(usuario));
  return { ok: true, usuario };
}

export async function iniciarSesion(
  email: string,
  password: string,
): Promise<{ ok: true; usuario: Usuario } | { ok: false; error: string }> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: traducirErrorSupabase(error.message) };
    if (!data.user) return { ok: false, error: 'No se pudo iniciar sesión.' };
    return {
      ok: true,
      usuario: {
        id: data.user.id,
        email: data.user.email ?? email,
        nombre: data.user.user_metadata?.nombre ?? email.split('@')[0],
        createdAt: data.user.created_at,
      },
    };
  }

  // ── fallback localStorage ──
  if (!isBrowser()) return { ok: false, error: 'No disponible.' };
  const usuarios: (Usuario & { passwordHash: string })[] =
    JSON.parse(localStorage.getItem(LS.usuarios) ?? '[]');
  const u = usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password),
  );
  if (!u) return { ok: false, error: 'Correo o contraseña incorrectos.' };
  const { passwordHash: _, ...usuario } = u;
  localStorage.setItem(LS.sesion, JSON.stringify(usuario));
  return { ok: true, usuario };
}

export async function cerrarSesion(): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    await supabase.auth.signOut();
    return;
  }
  if (isBrowser()) localStorage.removeItem(LS.sesion);
}

export function getSesionLocal(): Usuario | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(LS.sesion);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}

// ─── DIAGNÓSTICOS ─────────────────────────────────────────────────────────────

export async function guardarDiagnostico(
  resultado: DiagnosticoResultado,
  userId?: string,
): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    const uid = userId ?? user?.id;
    if (!uid) return;
    await supabase.from('diagnosticos').insert({
      id:               resultado.id,
      user_id:          uid,
      fecha:            resultado.fecha,
      empresa_nombre:   resultado.empresa.nombre,
      empresa_sector:   resultado.empresa.sector,
      empresa_tamanio:  resultado.empresa.tamanio,
      empresa_cargo:    resultado.empresa.cargo,
      empresa_ciudad:   resultado.empresa.ciudad ?? null,
      puntaje_global:   resultado.puntajeGlobal,
      nivel_global:     resultado.nivelGlobal,
      respuestas:       resultado.respuestas,
      resultados:       resultado.resultados,
      recomendaciones:  resultado.recomendaciones,
      ruta_90_dias:     resultado.ruta90Dias,
      benchmark:        resultado.benchmark,
    });
    return;
  }

  // ── fallback localStorage ──
  if (!isBrowser()) return;
  const todos: DiagnosticoResultado[] =
    JSON.parse(localStorage.getItem(LS.diagnosticos) ?? '[]');
  todos.unshift(resultado);
  localStorage.setItem(LS.diagnosticos, JSON.stringify(todos));
}

export async function getDiagnosticos(): Promise<DiagnosticoResultado[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('diagnosticos')
      .select('*')
      .order('fecha', { ascending: false });
    if (error || !data) return [];
    return data.map(mapRow);
  }

  if (!isBrowser()) return [];
  return JSON.parse(localStorage.getItem(LS.diagnosticos) ?? '[]');
}

export async function getDiagnosticoPorId(
  id: string,
): Promise<DiagnosticoResultado | null> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('diagnosticos')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapRow(data);
  }

  if (!isBrowser()) return null;
  const todos: DiagnosticoResultado[] =
    JSON.parse(localStorage.getItem(LS.diagnosticos) ?? '[]');
  return todos.find(d => d.id === id) ?? null;
}

export async function eliminarDiagnostico(id: string): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    await supabase.from('diagnosticos').delete().eq('id', id);
    return;
  }

  if (!isBrowser()) return;
  const todos = (await getDiagnosticos()).filter(d => d.id !== id);
  localStorage.setItem(LS.diagnosticos, JSON.stringify(todos));
}

// ─── ADMIN STATS ─────────────────────────────────────────────────────────────

export interface AdminStats {
  total_diagnosticos: number;
  total_usuarios: number;
  promedio_global: number;
  niveles: Record<string, number>;
  por_dimension: Record<string, number>;
}

export interface StatsSector  { sector: string;  total: number; promedio: number; }
export interface StatsTamanio { tamanio: string; total: number; promedio: number; }
export interface StatsMes     { mes: string;     total: number; promedio: number; }

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!isSupabaseEnabled || !supabase) return null;
  const { data, error } = await supabase.rpc('get_admin_stats');
  if (error || !data) return null;
  return data as AdminStats;
}

export async function getStatsPorSector(): Promise<StatsSector[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  const { data, error } = await supabase.rpc('get_stats_por_sector');
  if (error || !data) return [];
  return (data as StatsSector[]).map(r => ({
    sector:   String(r.sector),
    total:    Number(r.total),
    promedio: Number(r.promedio),
  }));
}

export async function getStatsPorTamanio(): Promise<StatsTamanio[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  const { data, error } = await supabase.rpc('get_stats_por_tamanio');
  if (error || !data) return [];
  return (data as StatsTamanio[]).map(r => ({
    tamanio:  String(r.tamanio),
    total:    Number(r.total),
    promedio: Number(r.promedio),
  }));
}

export async function getTendenciaMensual(): Promise<StatsMes[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  const { data, error } = await supabase.rpc('get_tendencia_mensual');
  if (error || !data) return [];
  return (data as StatsMes[]).map(r => ({
    mes:      String(r.mes),
    total:    Number(r.total),
    promedio: Number(r.promedio),
  }));
}

// ─── LINK PÚBLICO ────────────────────────────────────────────────────────────

export async function generarLinkPublico(id: string): Promise<string | null> {
  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 12);

  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from('diagnosticos')
      .update({ token_publico: token, compartido_publicamente: true })
      .eq('id', id);
    if (error) return null;
    return token;
  }

  if (!isBrowser()) return null;
  const todos: DiagnosticoResultado[] =
    JSON.parse(localStorage.getItem(LS.diagnosticos) ?? '[]');
  const idx = todos.findIndex(d => d.id === id);
  if (idx === -1) return null;
  todos[idx] = { ...todos[idx], tokenPublico: token, compartidoPublicamente: true };
  localStorage.setItem(LS.diagnosticos, JSON.stringify(todos));
  return token;
}

export async function revocarLinkPublico(id: string): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    await supabase
      .from('diagnosticos')
      .update({ token_publico: null, compartido_publicamente: false })
      .eq('id', id);
    return;
  }

  if (!isBrowser()) return;
  const todos: DiagnosticoResultado[] =
    JSON.parse(localStorage.getItem(LS.diagnosticos) ?? '[]');
  const idx = todos.findIndex(d => d.id === id);
  if (idx === -1) return;
  todos[idx] = { ...todos[idx], tokenPublico: undefined, compartidoPublicamente: false };
  localStorage.setItem(LS.diagnosticos, JSON.stringify(todos));
}

export async function getDiagnosticoPorToken(
  token: string,
): Promise<DiagnosticoResultado | null> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('diagnosticos_publicos')
      .select('*')
      .eq('token_publico', token)
      .single();
    if (error || !data) return null;
    return mapRow(data as Record<string, unknown>);
  }

  if (!isBrowser()) return null;
  const todos: DiagnosticoResultado[] =
    JSON.parse(localStorage.getItem(LS.diagnosticos) ?? '[]');
  return todos.find(d => d.tokenPublico === token && d.compartidoPublicamente) ?? null;
}

// ─── BENCHMARK REAL ──────────────────────────────────────────────────────────

export async function getBenchmarkReal(
  sector: string,
  tamanio: string,
): Promise<BenchmarkDatos | null> {
  if (!isSupabaseEnabled || !supabase) return null;

  const { data, error } = await supabase
    .from('benchmark_anonimo')
    .select('*')
    .eq('sector', sector)
    .eq('tamanio', tamanio)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  return {
    sector,
    tamanio,
    promedioGlobal: Number(row.promedio_global ?? 0),
    nEmpresas:      Number(row.n_empresas ?? 0),
    etiqueta:       `Benchmark real · ${sector.replace(/_/g, ' ')} · ${tamanio} (${row.n_empresas} empresas)`,
    promedioPorDimension: {
      estrategia: Number(row.promedio_estrategia ?? 0),
      tecnologia: Number(row.promedio_tecnologia ?? 0),
      datos:      Number(row.promedio_datos      ?? 0),
      talento:    Number(row.promedio_talento    ?? 0),
      cliente:    Number(row.promedio_cliente    ?? 0),
    },
  };
}

// ─── helpers privados ─────────────────────────────────────────────────────────

function traducirErrorSupabase(msg: string): string {
  if (msg.includes('already registered') || msg.includes('User already registered'))
    return 'Este correo ya está registrado.';
  if (msg.includes('Invalid login credentials'))
    return 'Correo o contraseña incorrectos.';
  if (msg.includes('Email not confirmed'))
    return 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.';
  if (msg.includes('Password should be'))
    return 'La contraseña debe tener al menos 6 caracteres.';
  return msg;
}
