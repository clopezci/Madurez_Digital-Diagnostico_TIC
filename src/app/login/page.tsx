'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { iniciarSesion } from '@/lib/storage';
import { BarChart3, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { usuario, recargar } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (usuario) router.replace('/diagnostico');
  }, [usuario, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = iniciarSesion(form.email, form.password);
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
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <p className="text-gray-500 mt-1 text-sm">Inicia sesión para ver tu diagnóstico</p>
        </div>

        <div className="card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Correo electrónico</label>
              <input
                className="input-field"
                type="email"
                placeholder="ana@empresa.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  className="input-field pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-indigo-600 font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-indigo-50 rounded-xl text-center">
          <p className="text-xs text-indigo-600">
            <strong>Demo:</strong> Regístrate con cualquier correo para explorar la herramienta.
          </p>
        </div>
      </div>
    </div>
  );
}
