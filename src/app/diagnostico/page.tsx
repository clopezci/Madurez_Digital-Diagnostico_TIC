'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CuestionarioWizard from '@/components/cuestionario/CuestionarioWizard';
import Header from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';

export default function DiagnosticoPage() {
  const { usuario, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !usuario) router.replace('/registro');
  }, [loading, usuario, router]);

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
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Diagnóstico de Madurez Digital</h1>
          <p className="text-gray-500 text-sm">
            Evalúa 5 dimensiones clave con 30 preguntas. Tiempo estimado: 10–15 minutos.
          </p>
        </div>
        <CuestionarioWizard />
      </main>
    </div>
  );
}
