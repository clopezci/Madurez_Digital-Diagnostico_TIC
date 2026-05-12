'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDiagnosticos, eliminarDiagnostico } from '@/lib/storage';
import { formatFechaCorta, cn } from '@/lib/utils';
import { NIVEL_COLORES } from '@/lib/scoring';
import type { DiagnosticoResultado } from '@/types';
import Header from '@/components/layout/Header';
import {
  Building2, Calendar, ChevronRight, ClipboardList,
  Loader2, Trash2, GitCompareArrows, X, CheckSquare,
} from 'lucide-react';

export default function HistorialPage() {
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoResultado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modoComparar, setModoComparar] = useState(false);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !usuario) { router.replace('/login'); return; }
    if (!loading && usuario) {
      getDiagnosticos().then(data => {
        setDiagnosticos(data);
        setCargando(false);
      });
    }
  }, [loading, usuario, router]);

  const handleEliminar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este diagnóstico? Esta acción no se puede deshacer.')) return;
    await eliminarDiagnostico(id);
    setDiagnosticos(prev => prev.filter(d => d.id !== id));
    setSeleccionados(prev => prev.filter(s => s !== id));
  };

  const toggleSeleccion = (id: string) => {
    setSeleccionados(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const irAComparar = () => {
    if (seleccionados.length === 2) {
      router.push(`/comparar?a=${seleccionados[0]}&b=${seleccionados[1]}`);
    }
  };

  const salirModoComparar = () => {
    setModoComparar(false);
    setSeleccionados([]);
  };

  if (loading || cargando) {
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historial de diagnósticos</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {diagnosticos.length === 0
                ? 'No hay diagnósticos aún'
                : `${diagnosticos.length} diagnóstico${diagnosticos.length !== 1 ? 's' : ''} guardado${diagnosticos.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex gap-2">
            {diagnosticos.length >= 2 && !modoComparar && (
              <button
                onClick={() => setModoComparar(true)}
                className="btn-secondary text-sm py-2"
              >
                <GitCompareArrows className="w-4 h-4" />
                <span className="hidden sm:inline">Comparar</span>
              </button>
            )}
            {modoComparar && (
              <button onClick={salirModoComparar} className="btn-secondary text-sm py-2">
                <X className="w-4 h-4" />
                Cancelar
              </button>
            )}
            {!modoComparar && (
              <button onClick={() => router.push('/diagnostico')} className="btn-primary text-sm py-2">
                <ClipboardList className="w-4 h-4" />
                Nuevo
              </button>
            )}
          </div>
        </div>

        {/* Comparar banner */}
        {modoComparar && (
          <div className={cn(
            'mb-4 px-4 py-3 rounded-xl border text-sm flex items-center justify-between',
            seleccionados.length === 2
              ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          )}>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              {seleccionados.length === 0 && 'Selecciona 2 diagnósticos para comparar'}
              {seleccionados.length === 1 && 'Selecciona 1 más para continuar'}
              {seleccionados.length === 2 && '2 diagnósticos seleccionados — listo para comparar'}
            </div>
            {seleccionados.length === 2 && (
              <button onClick={irAComparar} className="btn-primary text-xs py-1.5 px-3">
                <GitCompareArrows className="w-3.5 h-3.5" />
                Ver comparación
              </button>
            )}
          </div>
        )}

        {diagnosticos.length === 0 ? (
          <div className="card text-center py-16">
            <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h2 className="font-bold text-gray-700 mb-2">Aún no tienes diagnósticos</h2>
            <p className="text-gray-400 text-sm mb-6">Realiza tu primer diagnóstico y obtén tu reporte personalizado.</p>
            <button onClick={() => router.push('/diagnostico')} className="btn-primary">
              Comenzar diagnóstico
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {diagnosticos.map(d => {
              const color = NIVEL_COLORES[d.nivelGlobal];
              const estaSeleccionado = seleccionados.includes(d.id);
              const bloqueado = modoComparar && seleccionados.length === 2 && !estaSeleccionado;

              return (
                <div
                  key={d.id}
                  onClick={() => modoComparar ? toggleSeleccion(d.id) : router.push(`/resultados/${d.id}`)}
                  className={cn(
                    'card cursor-pointer transition-all group flex items-center gap-4',
                    modoComparar && estaSeleccionado
                      ? 'border-indigo-400 bg-indigo-50/50 shadow-md'
                      : modoComparar && bloqueado
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:shadow-md hover:border-indigo-100',
                  )}
                >
                  {/* Checkbox en modo comparar */}
                  {modoComparar && (
                    <div className={cn(
                      'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all',
                      estaSeleccionado
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300'
                    )}>
                      {estaSeleccionado && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}

                  <div
                    className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-lg font-extrabold leading-none">{d.puntajeGlobal}</span>
                    <span className="text-xs opacity-80">/100</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <p className="font-semibold text-gray-900 truncate">{d.empresa.nombre}</p>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {d.nivelGlobal}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{formatFechaCorta(d.fecha)}
                      </span>
                      <span>{d.empresa.sector.replace(/_/g, ' ')}</span>
                      <span>{d.empresa.tamanio}</span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {d.resultados.map(r => (
                        <div key={r.dimensionId} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${r.puntaje}%`, backgroundColor: r.color }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {!modoComparar && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={e => handleEliminar(e, d.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
