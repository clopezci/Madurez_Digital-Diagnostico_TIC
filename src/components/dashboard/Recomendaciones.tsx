'use client';
import { useState } from 'react';
import type { RecomendacionItem } from '@/types';
import { ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  recomendaciones: RecomendacionItem[];
}

const PRIORIDAD_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  alta: { bg: 'bg-red-50', text: 'text-red-700', label: '🔴 Alta prioridad' },
  media: { bg: 'bg-amber-50', text: 'text-amber-700', label: '🟡 Media prioridad' },
  baja: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '🟢 Baja prioridad' },
};

const IMPACTO_STYLES: Record<string, string> = {
  alto: 'bg-indigo-100 text-indigo-700',
  medio: 'bg-sky-100 text-sky-700',
  bajo: 'bg-gray-100 text-gray-600',
};

const ESFUERZO_STYLES: Record<string, string> = {
  alto: 'bg-rose-100 text-rose-700',
  medio: 'bg-amber-100 text-amber-700',
  bajo: 'bg-emerald-100 text-emerald-700',
};

function RecomendacionCard({ rec }: { rec: RecomendacionItem }) {
  const [open, setOpen] = useState(false);
  const p = PRIORIDAD_STYLES[rec.prioridad];

  return (
    <div className={cn('rounded-xl border overflow-hidden transition-all', p.bg, 'border-transparent')}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60', p.text)}>
              {p.label}
            </span>
            <span className="text-xs text-gray-500">{rec.dimensionNombre}</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{rec.titulo}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">{rec.descripcion}</p>

          <div className="flex flex-wrap gap-2">
            <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', IMPACTO_STYLES[rec.impacto])}>
              ⚡ Impacto {rec.impacto}
            </span>
            <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', ESFUERZO_STYLES[rec.esfuerzo])}>
              🔧 Esfuerzo {rec.esfuerzo}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700">
              📅 {rec.plazo}
            </span>
          </div>

          {rec.recursos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Recursos recomendados (gratuitos)
              </p>
              <ul className="space-y-1">
                {rec.recursos.map(r => (
                  <li key={r} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Recomendaciones({ recomendaciones }: Props) {
  const [filtro, setFiltro] = useState<'todas' | 'alta' | 'media' | 'baja'>('todas');
  const filtradas = filtro === 'todas' ? recomendaciones : recomendaciones.filter(r => r.prioridad === filtro);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-gray-900">Recomendaciones Priorizadas</h3>
          <p className="text-xs text-gray-500">{recomendaciones.length} acciones identificadas para tu empresa</p>
        </div>
        <div className="flex gap-1.5">
          {(['todas', 'alta', 'media', 'baja'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                filtro === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f === 'todas' ? 'Todas' : f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filtradas.map(rec => (
          <RecomendacionCard key={rec.id} rec={rec} />
        ))}
        {filtradas.length === 0 && (
          <p className="text-center text-gray-400 py-6 text-sm">No hay recomendaciones en esta categoría.</p>
        )}
      </div>
    </div>
  );
}
