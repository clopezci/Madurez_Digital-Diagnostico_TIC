'use client';
import { useState, useEffect } from 'react';
import { Target, ChevronRight, TrendingUp } from 'lucide-react';
import { NIVEL_COLORES } from '@/lib/scoring';
import type { DiagnosticoResultado, NivelMadurez } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  resultado: DiagnosticoResultado;
}

const NIVELES: NivelMadurez[] = ['Inicial', 'Explorando', 'Definido', 'Optimizando', 'Transformador'];

const NIVEL_MIN_SCORE: Record<NivelMadurez, number> = {
  Inicial: 0,
  Explorando: 21,
  Definido: 41,
  Optimizando: 61,
  Transformador: 81,
};

const NIVEL_MAX_SCORE: Record<NivelMadurez, number> = {
  Inicial: 20,
  Explorando: 40,
  Definido: 60,
  Optimizando: 80,
  Transformador: 100,
};

export default function NivelObjetivo({ resultado }: Props) {
  const [objetivo, setObjetivo] = useState<NivelMadurez | null>(null);
  const storageKey = `objetivo_nivel_${resultado.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setObjetivo(saved as NivelMadurez);
  }, [storageKey]);

  const seleccionarObjetivo = (nivel: NivelMadurez) => {
    setObjetivo(nivel);
    localStorage.setItem(storageKey, nivel);
  };

  const nivelesDisponibles = NIVELES.filter(n => NIVEL_MIN_SCORE[n] > resultado.puntajeGlobal);
  const colorActual = NIVEL_COLORES[resultado.nivelGlobal];

  const brechas = objetivo
    ? resultado.resultados
        .map(r => ({
          ...r,
          brecha: Math.max(0, NIVEL_MIN_SCORE[objetivo] - r.puntaje),
        }))
        .filter(r => r.brecha > 0)
        .sort((a, b) => b.brecha - a.brecha)
    : [];

  const puntosNecesarios = objetivo
    ? Math.max(0, NIVEL_MIN_SCORE[objetivo] - resultado.puntajeGlobal)
    : 0;

  if (nivelesDisponibles.length === 0) {
    return (
      <div className="card border border-indigo-100 bg-indigo-50/40">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Nivel objetivo</h3>
        </div>
        <p className="text-sm text-gray-600">
          Ya alcanzaste el nivel más alto: <strong>Transformador Digital</strong>. Sigue siendo referente del sector.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Nivel objetivo</h3>
        {objetivo && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${NIVEL_COLORES[objetivo]}18`, color: NIVEL_COLORES[objetivo] }}
          >
            {objetivo}
          </span>
        )}
      </div>

      {/* Current → Target selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: colorActual }}
        >
          {resultado.nivelGlobal}
          <span className="opacity-80">({resultado.puntajeGlobal})</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex gap-1.5 flex-wrap">
          {nivelesDisponibles.map(nivel => (
            <button
              key={nivel}
              onClick={() => seleccionarObjetivo(nivel)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                objetivo === nivel
                  ? 'text-white border-transparent'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
              style={objetivo === nivel ? { backgroundColor: NIVEL_COLORES[nivel] } : {}}
            >
              {nivel}
            </button>
          ))}
        </div>
      </div>

      {objetivo && (
        <>
          {/* Gap summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">Puntaje necesario</span>
              <span className="text-sm font-bold" style={{ color: NIVEL_COLORES[objetivo] }}>
                +{puntosNecesarios} puntos para llegar a {NIVEL_MIN_SCORE[objetivo]}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(resultado.puntajeGlobal / NIVEL_MAX_SCORE[objetivo]) * 100}%`,
                  backgroundColor: colorActual,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{resultado.puntajeGlobal} actual</span>
              <span>{NIVEL_MIN_SCORE[objetivo]} mínimo para {objetivo}</span>
            </div>
          </div>

          {/* Dimensiones con mayor brecha */}
          {brechas.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-semibold text-gray-700">
                  Dimensiones a fortalecer para alcanzar {objetivo}
                </p>
              </div>
              <div className="space-y-2.5">
                {brechas.map(r => (
                  <div key={r.dimensionId}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{r.nombre}</span>
                      <span className="font-semibold text-gray-800">
                        {r.puntaje} → <span style={{ color: NIVEL_COLORES[objetivo] }}>+{r.brecha} pts</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      {/* Current */}
                      <div
                        className="h-full rounded-full absolute left-0 top-0"
                        style={{ width: `${r.puntaje}%`, backgroundColor: r.color }}
                      />
                      {/* Target marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 opacity-60"
                        style={{
                          left: `${NIVEL_MIN_SCORE[objetivo]}%`,
                          backgroundColor: NIVEL_COLORES[objetivo],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                La línea vertical marca el puntaje mínimo requerido en cada dimensión para el nivel {objetivo}.
              </p>
            </div>
          )}

          {brechas.length === 0 && (
            <p className="text-sm text-emerald-600 font-medium">
              ¡Todas tus dimensiones ya superan el umbral de {objetivo}! Solo necesitas subir el promedio global.
            </p>
          )}
        </>
      )}

      {!objetivo && (
        <p className="text-sm text-gray-400">Selecciona un nivel objetivo para ver qué necesitas mejorar.</p>
      )}
    </div>
  );
}
