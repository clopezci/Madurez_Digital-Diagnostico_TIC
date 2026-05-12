'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDiagnosticoPorToken } from '@/lib/storage';
import { NIVEL_COLORES, NIVEL_DESCRIPCIONES } from '@/lib/scoring';
import { formatFecha } from '@/lib/utils';
import type { DiagnosticoResultado } from '@/types';
import Link from 'next/link';
import RadarMadurez from '@/components/dashboard/RadarMadurez';
import BarraDimensiones from '@/components/dashboard/BarraDimensiones';
import { Loader2, BarChart3, Building2, ExternalLink } from 'lucide-react';

export default function ResultadoPublicoPage() {
  const { token } = useParams<{ token: string }>();
  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getDiagnosticoPorToken(token).then(r => {
      setResultado(r);
      setCargando(false);
    });
  }, [token]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Resultado no disponible</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          Este enlace no existe, ha expirado o el propietario ha desactivado el acceso público.
        </p>
        <Link href="/" className="btn-primary text-sm">
          Ir a DiagnosticoTIC
        </Link>
      </div>
    );
  }

  const { nivelGlobal, puntajeGlobal, empresa, resultados } = resultado;
  const colorNivel = NIVEL_COLORES[nivelGlobal];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal public header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">DiagnosticoTIC</span>
          </Link>
          <Link
            href="/registro"
            className="btn-primary text-xs py-1.5 px-3"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Hacer mi diagnóstico gratis
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Public badge */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-6 text-xs text-amber-800 font-medium text-center">
          Resultado compartido públicamente por {empresa.nombre}
        </div>

        {/* Hero score */}
        <div
          className="rounded-2xl text-white p-6 mb-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colorNivel}dd, ${colorNivel}99)` }}
        >
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

        {/* Dimension summary */}
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

        {/* CTA */}
        <div className="card text-center bg-indigo-50 border border-indigo-100">
          <h3 className="font-bold text-gray-900 mb-2">¿Quieres conocer el nivel de madurez de tu empresa?</h3>
          <p className="text-sm text-gray-500 mb-4">
            El diagnóstico es gratuito, toma 15 minutos y obtienes un plan de mejora personalizado de 90 días.
          </p>
          <Link href="/registro" className="btn-primary">
            Comenzar diagnóstico gratis
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          DiagnosticoTIC · Proyecto académico UPB-SAPIENCIA 2026 · Datos tratados según Ley 1581 de 2012
        </p>
      </main>
    </div>
  );
}
