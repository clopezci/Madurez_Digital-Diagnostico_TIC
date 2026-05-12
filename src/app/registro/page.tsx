'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registrarUsuario } from '@/lib/storage';
import { BarChart3, Eye, EyeOff } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const { usuario, recargar } = useAuth();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', acepta: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (usuario) router.replace('/diagnostico');
  }, [usuario, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.nombre.trim().length < 2) return setError('Ingresa tu nombre completo.');
    if (!form.email.includes('@')) return setError('Ingresa un correo válido.');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.');
    if (!form.acepta) return setError('Debes aceptar el tratamiento de datos.');

    setLoading(true);
    const result = await registrarUsuario(form.nombre, form.email, form.password);
    if (result.ok) {
      recargar();
      router.push('/diagnostico');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">DiagnosticoTIC</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta gratuita</h1>
          <p className="text-gray-500 mt-1 text-sm">Comienza tu diagnóstico de madurez digital hoy</p>
        </div>

        <div className="card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre completo</label>
              <input className="input-field" type="text" placeholder="Ana García"
                value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Correo electrónico</label>
              <input className="input-field" type="email" placeholder="ana@empresa.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPass ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirmar contraseña</label>
              <input className="input-field" type="password" placeholder="Repite la contraseña"
                value={form.confirmar} onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))} required />
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="acepta" checked={form.acepta}
                onChange={e => setForm(f => ({ ...f, acepta: e.target.checked }))}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
              <label htmlFor="acepta" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                Acepto el tratamiento de mis datos según la{' '}
                <Link href="/privacidad" className="text-indigo-600 hover:underline">Política de Privacidad</Link>{' '}
                y la Ley 1581 de 2012 (Habeas Data Colombia).
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
