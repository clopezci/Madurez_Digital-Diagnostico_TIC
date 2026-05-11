'use client';
import type { DiagnosticoResultado, Usuario } from '@/types';

// Keys
const KEYS = {
  usuarios: 'md_usuarios',
  sesion: 'md_sesion',
  diagnosticos: 'md_diagnosticos',
} as const;

function isBrowser() {
  return typeof window !== 'undefined';
}

// ---- AUTH ----

export function registrarUsuario(
  nombre: string,
  email: string,
  password: string
): { ok: true; usuario: Usuario } | { ok: false; error: string } {
  if (!isBrowser()) return { ok: false, error: 'No disponible en servidor' };
  const usuarios: Usuario[] = JSON.parse(localStorage.getItem(KEYS.usuarios) ?? '[]');
  if (usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'Este correo ya está registrado.' };
  }
  const nuevo: Usuario = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    nombre: nombre.trim(),
    createdAt: new Date().toISOString(),
    passwordHash: btoa(password), // MVP only – replace with bcrypt in production
  };
  usuarios.push(nuevo);
  localStorage.setItem(KEYS.usuarios, JSON.stringify(usuarios));
  localStorage.setItem(KEYS.sesion, JSON.stringify(nuevo));
  return { ok: true, usuario: nuevo };
}

export function iniciarSesion(
  email: string,
  password: string
): { ok: true; usuario: Usuario } | { ok: false; error: string } {
  if (!isBrowser()) return { ok: false, error: 'No disponible en servidor' };
  const usuarios: Usuario[] = JSON.parse(localStorage.getItem(KEYS.usuarios) ?? '[]');
  const usuario = usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password)
  );
  if (!usuario) return { ok: false, error: 'Correo o contraseña incorrectos.' };
  localStorage.setItem(KEYS.sesion, JSON.stringify(usuario));
  return { ok: true, usuario };
}

export function cerrarSesion() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.sesion);
}

export function getSesion(): Usuario | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(KEYS.sesion);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}

// ---- DIAGNÓSTICOS ----

export function guardarDiagnostico(resultado: DiagnosticoResultado) {
  if (!isBrowser()) return;
  const todos: DiagnosticoResultado[] = JSON.parse(
    localStorage.getItem(KEYS.diagnosticos) ?? '[]'
  );
  todos.unshift(resultado);
  localStorage.setItem(KEYS.diagnosticos, JSON.stringify(todos));
}

export function getDiagnosticos(): DiagnosticoResultado[] {
  if (!isBrowser()) return [];
  return JSON.parse(localStorage.getItem(KEYS.diagnosticos) ?? '[]');
}

export function getDiagnosticoPorId(id: string): DiagnosticoResultado | null {
  const todos = getDiagnosticos();
  return todos.find(d => d.id === id) ?? null;
}

export function eliminarDiagnostico(id: string) {
  if (!isBrowser()) return;
  const todos = getDiagnosticos().filter(d => d.id !== id);
  localStorage.setItem(KEYS.diagnosticos, JSON.stringify(todos));
}
