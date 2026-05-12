'use client';
/**
 * Capa de persistencia con doble modo:
 *  - Supabase (cuando NEXT_PUBLIC_SUPABASE_URL está configurado)
 *  - localStorage (fallback para desarrollo sin Supabase)
 */
import { supabase, isSupabaseEnabled } from './supabase';
import type { DiagnosticoResultado, Usuario } from '@/types';

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
