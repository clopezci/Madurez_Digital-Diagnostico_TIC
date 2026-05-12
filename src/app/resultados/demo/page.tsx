'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NIVEL_COLORES, NIVEL_DESCRIPCIONES } from '@/lib/scoring';
import { formatFecha } from '@/lib/utils';
import type { DiagnosticoResultado } from '@/types';
import RadarMadurez from '@/components/dashboard/RadarMadurez';
import BarraDimensiones from '@/components/dashboard/BarraDimensiones';
import Recomendaciones from '@/components/dashboard/Recomendaciones';
import Ruta90Dias from '@/components/dashboard/Ruta90Dias';
import BenchmarkCard from '@/components/dashboard/BenchmarkCard';
import CubiertaPDF from '@/components/dashboard/CubiertaPDF';
import Link from 'next/link';
import { BarChart3, Building2, Printer, FlaskConical, UserPlus, ArrowLeft } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ResultadosDemoPage() {
  const router = useRouter();
  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem('demo_resultado');
    if (!raw) { router.replace('/demo'); return; }
    try {
      setResultado(JSON.parse(raw) as DiagnosticoResultado);
    } catch {
      router.replace('/demo');
    }
    setCargando(false);
  }, [router]);

  if (cargando || !resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const { nivelGlobal, puntajeGlobal, empresa, resultados } = resultado;
  const colorNivel = NIVEL_COLORES[nivelGlobal];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header demo */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">DiagnosticoTIC</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <FlaskConical className="w-3.5 h-3.5" /> Modo demo
          </span>
        </div>
      </header>

      {/* Portada PDF */}
      <CubiertaPDF resultado={resultado} />

      <main className="max-w-6xl mx-auto px-4 py-8" id="resultado-print">

        {/* Banner CTA para registro */}
        <div className="no-print bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div>
            <p className="font-bold text-base">¿Te gustó tu diagnóstico?</p>
            <p className="text-sm text-indigo-100 mt-0.5">
              Crea una cuenta gratis para guardar este resultado, hacer seguimiento y comparar tu evolución.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/registro"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors">
              <UserPlus className="w-4 h-4" />
              Crear cuenta gratis
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 no-print">
          <button onClick={() => router.push('/demo')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Hacer otro diagnóstico
          </button>
          <button onClick={() => window.print()} className="btn-primary text-sm py-2">
            <Printer className="w-4 h-4" /> Exportar PDF
          </button>
        </div>

        {/* Hero score */}
        <div className="rounded-2xl text-white p-6 mb-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colorNivel}dd, ${colorNivel}99)` }}>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 opacity-80" />
                  <p className="text-sm opacity-90 font-medium">{empresa.nombre}</p>
                </div>
                <p className="text-xs opacity-70">
                  {empresa.sector.replace(/_/g, ' ')} · {empresa.tamanio} · {formatFecha(resultado.fecha)}
                </p>
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

        <div className="mb-6">
          <BenchmarkCard resultado={resultado} />
        </div>

        <div className="mb-6">
          <Recomendaciones recomendaciones={resultado.recomendaciones} resultado={resultado} />
        </div>

        <div className="mb-6">
          <Ruta90Dias acciones={resultado.ruta90Dias} />
        </div>

        {/* CTA final */}
        <div className="no-print card bg-indigo-50 border-indigo-100 text-center py-10">
          <UserPlus className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Guarda este diagnóstico</h3>
          <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
            Crea una cuenta gratis para guardar tu historial, comparar diagnósticos y hacer seguimiento de tu progreso.
          </p>
          <Link href="/registro" className="btn-primary">
            Crear cuenta gratis
          </Link>
        </div>

        <div className="text-xs text-gray-400 text-center py-4 border-t border-gray-100 mt-6">
          DiagnosticoTIC · Proyecto académico UPB-SAPIENCIA 2026 · Datos tratados según Ley 1581 de 2012 (Habeas Data)
        </div>
      </main>
    </div>
  );
}
