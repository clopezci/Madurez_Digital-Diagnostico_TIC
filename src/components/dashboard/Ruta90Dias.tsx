'use client';
import type { Accion90Dias } from '@/types';
import { cn } from '@/lib/utils';
import { DIMENSIONES } from '@/data/preguntas';
import { Flag, Zap, TrendingUp } from 'lucide-react';

const TIPO_CONFIG = {
  inmediata: { label: 'Acción inmediata', icon: <Zap className="w-3.5 h-3.5" />, style: 'bg-red-100 text-red-700' },
  corto_plazo: { label: 'Corto plazo', icon: <TrendingUp className="w-3.5 h-3.5" />, style: 'bg-amber-100 text-amber-700' },
  mediano_plazo: { label: 'Mediano plazo', icon: <Flag className="w-3.5 h-3.5" />, style: 'bg-sky-100 text-sky-700' },
};

interface Props {
  acciones: Accion90Dias[];
}

export default function Ruta90Dias({ acciones }: Props) {
  const semanas = [
    { inicio: 1, fin: 4, label: 'Semanas 1–4', sub: 'Fundamentos' },
    { inicio: 5, fin: 8, label: 'Semanas 5–8', sub: 'Consolidación' },
    { inicio: 9, fin: 12, label: 'Semanas 9–12', sub: 'Optimización' },
  ];

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 mb-1">Ruta de Mejora – 90 Días</h3>
      <p className="text-xs text-gray-500 mb-5">Plan personalizado basado en tus dimensiones con menor puntaje</p>

      <div className="space-y-6">
        {semanas.map(bloque => {
          const accionesFase = acciones.filter(
            a => a.semana >= bloque.inicio && a.semana <= bloque.fin
          );
          if (accionesFase.length === 0) return null;

          return (
            <div key={bloque.label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                  {bloque.label}
                </div>
                <span className="text-xs text-gray-400 font-medium">{bloque.sub}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="space-y-2.5 pl-2">
                {accionesFase.map((accion, i) => {
                  const dim = DIMENSIONES.find(d => d.id === accion.dimensionId);
                  const tipo = TIPO_CONFIG[accion.tipo];
                  return (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
                      <div
                        className="w-1.5 rounded-full flex-shrink-0 self-stretch"
                        style={{ backgroundColor: dim?.color ?? '#6366f1' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', tipo.style)}
                          >
                            {tipo.icon}
                            {tipo.label}
                          </span>
                          <span className="text-xs text-gray-400">{accion.dimensionNombre}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{accion.titulo}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{accion.descripcion}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
