'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDiagnosticoPorId } from '@/lib/storage';
import { NIVEL_COLORES, NIVEL_DESCRIPCIONES } from '@/lib/scoring';
import { formatFecha, cn } from '@/lib/utils';
import type { DiagnosticoResultado } from '@/types';
import Header from '@/components/layout/Header';
import RadarMadurez from '@/components/dashboard/RadarMadurez';
import BarraDimensiones from '@/components/dashboard/BarraDimensiones';
import Recomendaciones from '@/components/dashboard/Recomendaciones';
import Ruta90Dias from '@/components/dashboard/Ruta90Dias';
import BenchmarkCard from '@/components/dashboard/BenchmarkCard';
import { Loader2, Printer, ClipboardList, ArrowLeft, Building2 } from 'lucide-react';

export default function ResultadosPage() {
  const { id } = useParams<{ id: string }>();
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!loading && !usuario) { router.replace('/login'); return; }
    if (!loading && usuario) {
      const r = getDiagnosticoPorId(id);
      setResultado(r);
      setCargando(false);
    }
  }, [loading, usuario, id, router]);

  if (loading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Diagnóstico no encontrado</h1>
          <p className="text-gray-500 mb-6">Este resultado no existe o fue eliminado.</p>
          <button onClick={() => router.push('/historial')} className="btn-primary">
            Ver historial
          </button>
        </div>
      </div>
    );
  }

  const { nivelGlobal, puntajeGlobal, empresa, resultados } = resultado;
  const colorNivel = NIVEL_COLORES[nivelGlobal];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Print header (only visible when printing) */}
      <div className="hidden print:block p-6 border-b text-center">
        <h1 className="text-2xl font-bold">Diagnóstico de Madurez Digital</h1>
        <p className="text-gray-500">{empresa.nombre} · {formatFecha(resultado.fecha)}</p>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8" id="resultado-print">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 no-print">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="flex gap-2">
            <button onClick={() => router.push('/diagnostico')} className="btn-secondary text-sm py-2">
              <ClipboardList className="w-4 h-4" />
              Nuevo diagnóstico
            </button>
            <button onClick={() => window.print()} className="btn-primary text-sm py-2">
              <Printer className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Hero score */}
        <div
          className="rounded-2xl text-white p-6 mb-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colorNivel}dd, ${colorNivel}99)` }}
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 opacity-80" />
                  <p className="text-sm opacity-90 font-medium">{empresa.nombre}</p>
                </div>
                <p className="text-xs opacity-70">{empresa.sector.replace(/_/g, ' ')} · {empresa.tamanio} · {formatFecha(resultado.fecha)}</p>
              </div>
              <span className="bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {nivelGlobal}
              </span>
            </div>

            <div className="flex items-end gap-4">
              <div>
                <p className="text-6xl font-extrabold leading-none">{puntajeGlobal}</p>
                <p className="text-sm opacity-80 mt-1">/ 100 puntos</p>
              </div>
              <p className="text-sm opacity-90 leading-relaxed max-w-sm">
                {NIVEL_DESCRIPCIONES[nivelGlobal]}
              </p>
            </div>
          </div>
        </div>

        {/* Dimension summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {resultados.map(r => (
            <div key={r.dimensionId} className="card p-4 text-center">
              <p className="text-xs text-gray-500 mb-1 truncate">{r.nombre.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-2xl font-extrabold" style={{ color: r.color }}>{r.puntaje}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: r.color }}>{r.nivel}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <RadarMadurez resultado={resultado} />
          <BarraDimensiones resultado={resultado} />
        </div>

        {/* Benchmark */}
        <div className="mb-6">
          <BenchmarkCard resultado={resultado} />
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <Recomendaciones recomendaciones={resultado.recomendaciones} />
        </div>

        {/* 90-day plan */}
        <div className="mb-6">
          <Ruta90Dias acciones={resultado.ruta90Dias} />
        </div>

        {/* Legal footer */}
        <div className="text-xs text-gray-400 text-center py-4 border-t border-gray-100">
          DiagnosticoTIC · Proyecto académico UPB-SAPIENCIA 2026 · Datos tratados según Ley 1581 de 2012 (Habeas Data)
        </div>
      </main>
    </div>
  );
}
