'use client';
import Link from 'next/link';
import CuestionarioWizard from '@/components/cuestionario/CuestionarioWizard';
import { BarChart3, FlaskConical } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">DiagnosticoTIC</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <FlaskConical className="w-3.5 h-3.5" /> Modo demo — sin cuenta
            </span>
            <Link href="/registro" className="btn-primary text-sm py-2">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Banner demo */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
        <p className="text-sm text-amber-800">
          Estás en modo demo. Tu diagnóstico <strong>no se guardará</strong>.{' '}
          <Link href="/registro" className="font-semibold underline">Crea una cuenta gratis</Link>{' '}
          para guardar tus resultados y hacer seguimiento en el tiempo.
        </p>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Diagnóstico de Madurez Digital</h1>
          <p className="text-gray-500 text-sm">
            Evalúa 5 dimensiones clave con 30 preguntas. Tiempo estimado: 10–15 minutos.
          </p>
        </div>
        <CuestionarioWizard modoDemo />
      </main>
    </div>
  );
}
