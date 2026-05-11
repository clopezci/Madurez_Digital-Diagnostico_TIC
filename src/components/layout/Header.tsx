'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, LogOut, History, ClipboardList } from 'lucide-react';

export default function Header() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">DiagnosticoTIC</span>
        </Link>

        {usuario ? (
          <nav className="flex items-center gap-1">
            <Link
              href="/diagnostico"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo diagnóstico</span>
            </Link>
            <Link
              href="/historial"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <span className="text-sm text-gray-500 hidden sm:block px-2">{usuario.nombre}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Link href="/login" className="btn-secondary py-2 px-4 text-sm">
              Iniciar sesión
            </Link>
            <Link href="/registro" className="btn-primary py-2 px-4 text-sm">
              Comenzar gratis
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
