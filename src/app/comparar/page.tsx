'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDiagnosticoPorId } from '@/lib/storage';
import { NIVEL_COLORES } from '@/lib/scoring';
import { formatFechaCorta, cn } from '@/lib/utils';
import type { DiagnosticoResultado } from '@/types';
import Header from '@/components/layout/Header';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Loader2, Building2, Calendar } from 'lucide-react';

function Delta({ val }: { val: number }) {
  if (val > 0) return (
    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold text-sm">
      <TrendingUp className="w-3.5 h-3.5" />+{val}
    </span>
  );
  if (val < 0) return (
    <span className="inline-flex items-center gap-0.5 text-red-500 font-semibold text-sm">
      <TrendingDown className="w-3.5 h-3.5" />{val}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-gray-400 font-semibold text-sm">
      <Minus className="w-3.5 h-3.5" />0
    </span>
  );
}

function ComparadorContenido() {
  const params = useSearchParams();
  const router = useRouter();
  const { usuario, loading } = useAuth();
  const [a, setA] = useState<DiagnosticoResultado | null>(null);
  const [b, setB] = useState<DiagnosticoResultado | null>(null);
  const [cargando, setCargando] = useState(true);

  const idA = params.get('a') ?? '';
  const idB = params.get('b') ?? '';

  useEffect(() => {
    if (!loading && !usuario) { router.replace('/login'); return; }
    if (!loading && usuario && idA && idB) {
      Promise.all([getDiagnosticoPorId(idA), getDiagnosticoPorId(idB)]).then(([ra, rb]) => {
        // Ordenar cronológicamente: a = más antiguo, b = más reciente
        if (ra && rb) {
          const [anterior, posterior] = new Date(ra.fecha) <= new Date(rb.fecha)
            ? [ra, rb] : [rb, ra];
          setA(anterior);
          setB(posterior);
        }
        setCargando(false);
      });
    }
  }, [loading, usuario, idA, idB, router]);

  if (loading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!a || !b) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 mb-4">No se encontraron los diagnósticos.</p>
          <button onClick={() => router.push('/historial')} className="btn-primary">
            Volver al historial
          </button>
        </div>
      </div>
    );
  }

  const deltaGlobal = b.puntajeGlobal - a.puntajeGlobal;
  const colorA = NIVEL_COLORES[a.nivelGlobal];
  const colorB = NIVEL_COLORES[b.nivelGlobal];

  const radarData = a.resultados.map(r => {
    const rb = b.resultados.find(x => x.dimensionId === r.dimensionId);
    return {
      dimension: r.nombre.split(' ').slice(0, 2).join(' '),
      Anterior: r.puntaje,
      Posterior: rb?.puntaje ?? 0,
    };
  });

  const dimComparacion = a.resultados.map(r => {
    const rb = b.resultados.find(x => x.dimensionId === r.dimensionId)!;
    return { ...r, puntajeB: rb.puntaje, delta: rb.puntaje - r.puntaje, colorB: rb.color };
  }).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));

  const mejoras = dimComparacion.filter(d => d.delta > 0);
  const retrocesos = dimComparacion.filter(d => d.delta < 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Toolbar */}
        <button
          onClick={() => router.push('/historial')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al historial
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Comparador de diagnósticos</h1>
        <p className="text-sm text-gray-500 mb-6">Evolución entre dos momentos de medición</p>

        {/* Score hero */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {/* Anterior */}
          <div className="card border-2" style={{ borderColor: colorA + '40' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: colorA }}>
              Diagnóstico anterior
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <p className="font-semibold text-gray-800 text-sm truncate">{a.empresa.nombre}</p>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-500">{formatFechaCorta(a.fecha)}</p>
            </div>
            <div className="text-5xl font-extrabold" style={{ color: colorA }}>{a.puntajeGlobal}</div>
            <p className="text-xs text-gray-500 mt-1">/ 100 · {a.nivelGlobal}</p>
          </div>

          {/* Delta */}
          <div className="card flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-500 mb-2">Variación global</p>
            <div className={cn(
              'text-5xl font-extrabold',
              deltaGlobal > 0 ? 'text-emerald-500' : deltaGlobal < 0 ? 'text-red-500' : 'text-gray-400'
            )}>
              {deltaGlobal > 0 ? '+' : ''}{deltaGlobal}
            </div>
            <p className="text-sm text-gray-500 mt-1">puntos</p>
            {deltaGlobal > 0 && <p className="text-xs text-emerald-600 mt-2 font-medium">Mejora registrada</p>}
            {deltaGlobal < 0 && <p className="text-xs text-red-500 mt-2 font-medium">Retroceso registrado</p>}
            {deltaGlobal === 0 && <p className="text-xs text-gray-400 mt-2">Sin cambios</p>}
          </div>

          {/* Posterior */}
          <div className="card border-2" style={{ borderColor: colorB + '40' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: colorB }}>
              Diagnóstico reciente
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <p className="font-semibold text-gray-800 text-sm truncate">{b.empresa.nombre}</p>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-500">{formatFechaCorta(b.fecha)}</p>
            </div>
            <div className="text-5xl font-extrabold" style={{ color: colorB }}>{b.puntajeGlobal}</div>
            <p className="text-xs text-gray-500 mt-1">/ 100 · {b.nivelGlobal}</p>
          </div>
        </div>

        {/* Radar comparativo */}
        <div className="card mb-6">
          <h2 className="font-bold text-gray-900 mb-1">Perfil comparativo por dimensión</h2>
          <p className="text-xs text-gray-500 mb-4">Superposición de ambos diagnósticos</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Radar
                name={formatFechaCorta(a.fecha)}
                dataKey="Anterior"
                stroke={colorA}
                fill={colorA}
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="4 2"
              />
              <Radar
                name={formatFechaCorta(b.fecha)}
                dataKey="Posterior"
                stroke={colorB}
                fill={colorB}
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Tooltip
                formatter={(val: number, name: string) => [`${val}/100`, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de dimensiones */}
        <div className="card mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Detalle por dimensión</h2>
          <div className="space-y-3">
            {dimComparacion.map(d => (
              <div key={d.dimensionId} className="flex items-center gap-3">
                <div className="w-28 text-xs text-gray-600 font-medium truncate flex-shrink-0">
                  {d.nombre.split(' ').slice(0, 2).join(' ')}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  {/* Barra anterior */}
                  <div className="w-16 text-right text-sm font-bold" style={{ color: colorA }}>{d.puntaje}</div>
                  <div className="flex-1 relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full opacity-40"
                      style={{ width: `${d.puntaje}%`, backgroundColor: colorA }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ width: `${d.puntajeB}%`, backgroundColor: colorB, opacity: 0.8 }}
                    />
                  </div>
                  <div className="w-16 text-sm font-bold" style={{ color: colorB }}>{d.puntajeB}</div>
                </div>
                <div className="w-14 text-right flex-shrink-0">
                  <Delta val={d.delta} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: colorA }} />
              Anterior ({formatFechaCorta(a.fecha)})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorB }} />
              Reciente ({formatFechaCorta(b.fecha)})
            </span>
          </div>
        </div>

        {/* Resumen de cambios */}
        {(mejoras.length > 0 || retrocesos.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {mejoras.length > 0 && (
              <div className="card border border-emerald-100 bg-emerald-50/50">
                <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Dimensiones que mejoraron
                </h3>
                <ul className="space-y-2">
                  {mejoras.map(d => (
                    <li key={d.dimensionId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{d.nombre}</span>
                      <Delta val={d.delta} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {retrocesos.length > 0 && (
              <div className="card border border-red-100 bg-red-50/50">
                <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Dimensiones que bajaron
                </h3>
                <ul className="space-y-2">
                  {retrocesos.map(d => (
                    <li key={d.dimensionId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{d.nombre}</span>
                      <Delta val={d.delta} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default function ComparadorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    }>
      <ComparadorContenido />
    </Suspense>
  );
}
