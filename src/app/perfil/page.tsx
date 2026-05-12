'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDiagnosticos } from '@/lib/storage';
import { formatFecha } from '@/lib/utils';
import Header from '@/components/layout/Header';
import {
  User, Mail, Calendar, ClipboardList, LogOut,
  Loader2, ShieldCheck, Trash2, AlertTriangle,
} from 'lucide-react';

export default function PerfilPage() {
  const { usuario, loading, logout } = useAuth();
  const router = useRouter();
  const [totalDiag, setTotalDiag] = useState<number | null>(null);
  const [confirmEliminar, setConfirmEliminar] = useState(false);

  useEffect(() => {
    if (!loading && !usuario) { router.replace('/login'); return; }
    if (!loading && usuario) {
      getDiagnosticos().then(d => setTotalDiag(d.length));
    }
  }, [loading, usuario, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi perfil</h1>

        {/* Info de cuenta */}
        <div className="card mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{usuario.nombre}</h2>
              <p className="text-sm text-gray-500">Cuenta activa</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Correo electrónico</p>
                <p className="text-sm font-medium text-gray-800">{usuario.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Miembro desde</p>
                <p className="text-sm font-medium text-gray-800">{formatFecha(usuario.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <ClipboardList className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Diagnósticos realizados</p>
                <p className="text-sm font-medium text-gray-800">
                  {totalDiag === null ? '...' : `${totalDiag} diagnóstico${totalDiag !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habeas Data */}
        <div className="card mb-4 border border-indigo-100 bg-indigo-50/40">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <h3 className="font-bold text-gray-900">Tus derechos (Habeas Data)</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            Conforme a la Ley 1581 de 2012, puedes conocer, actualizar y eliminar tus datos. Para solicitar
            la eliminación completa de tu cuenta y todos tus datos escribe a{' '}
            <a href="mailto:clpezci@gmail.com" className="text-indigo-600 hover:underline font-medium">
              clpezci@gmail.com
            </a>{' '}
            y tu solicitud será atendida en máximo 15 días hábiles.
          </p>
          <a
            href="mailto:clpezci@gmail.com?subject=Solicitud%20eliminaci%C3%B3n%20de%20datos%20DiagnosticoTIC&body=Hola%2C%20solicito%20la%20eliminaci%C3%B3n%20completa%20de%20mi%20cuenta%20y%20datos%20asociados%20al%20correo%3A%20"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            Solicitar eliminación de mi cuenta
          </a>
        </div>

        {/* Cerrar sesión */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-3">Sesión</h3>

          {!confirmEliminar ? (
            <button
              onClick={() => setConfirmEliminar(true)}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-red-700">¿Cerrar sesión?</p>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Tus diagnósticos quedan guardados en la nube. Podrás volver a acceder con tu correo y contraseña.
              </p>
              <div className="flex gap-2">
                <button onClick={handleLogout} className="btn-primary bg-red-600 hover:bg-red-700 text-sm py-2 px-4">
                  Sí, cerrar sesión
                </button>
                <button onClick={() => setConfirmEliminar(false)} className="btn-secondary text-sm py-2 px-4">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
