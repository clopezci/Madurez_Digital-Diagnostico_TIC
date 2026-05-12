'use client';
import { useRef, useState } from 'react';
import { Download, Share2, Loader2 } from 'lucide-react';
import { NIVEL_COLORES } from '@/lib/scoring';
import type { DiagnosticoResultado } from '@/types';

interface Props {
  resultado: DiagnosticoResultado;
}

const NIVEL_LABELS: Record<string, string> = {
  Inicial: 'Nivel Inicial',
  Explorando: 'Explorando',
  Definido: 'Definido',
  Optimizando: 'Optimizando',
  Transformador: 'Transformador Digital',
};

export default function BadgeCompartible({ resultado }: Props) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [descargando, setDescargando] = useState(false);
  const color = NIVEL_COLORES[resultado.nivelGlobal] ?? '#6366f1';
  const anio = new Date(resultado.fecha).getFullYear();

  const descargar = async () => {
    if (!badgeRef.current) return;
    setDescargando(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(badgeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `badge-madurez-digital-${resultado.empresa.nombre.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Badge para LinkedIn</h3>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Descarga tu insignia y compártela en LinkedIn para mostrar el nivel de madurez digital de tu empresa.
      </p>

      {/* Badge preview — this is what gets captured */}
      <div className="flex justify-center mb-5">
        <div
          ref={badgeRef}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          className="w-80 rounded-2xl overflow-hidden shadow-lg select-none"
        >
          {/* Header con color de nivel */}
          <div style={{ backgroundColor: color }} className="px-6 pt-6 pb-8 relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <span className="text-white font-bold text-sm">DiagnosticoTIC</span>
            </div>
            {/* Score */}
            <div className="text-center">
              <div className="inline-flex items-end gap-1 mb-1">
                <span className="text-7xl font-black text-white leading-none">{resultado.puntajeGlobal}</span>
                <span className="text-2xl text-white/70 font-semibold mb-2">/100</span>
              </div>
              <p className="text-white/90 text-sm font-medium">Puntaje de madurez digital</p>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4">
            <div
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {NIVEL_LABELS[resultado.nivelGlobal] ?? resultado.nivelGlobal}
            </div>
            <h4 className="font-bold text-gray-900 text-base truncate mb-0.5">{resultado.empresa.nombre}</h4>
            <p className="text-gray-500 text-xs mb-4">{resultado.empresa.sector.replace(/_/g, ' ')} · {resultado.empresa.tamanio} · {anio}</p>

            {/* Mini dimension bars */}
            <div className="space-y-1.5">
              {resultado.resultados.map(r => (
                <div key={r.dimensionId} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-28 truncate">{r.nombre}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.puntaje}%`, backgroundColor: r.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-6 text-right">{r.puntaje}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              madurez-digital-diagnostico-tic.vercel.app
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={descargar}
        disabled={descargando}
        className="btn-primary w-full"
      >
        {descargando ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generando imagen...</>
        ) : (
          <><Download className="w-4 h-4" /> Descargar badge PNG</>
        )}
      </button>
    </div>
  );
}
