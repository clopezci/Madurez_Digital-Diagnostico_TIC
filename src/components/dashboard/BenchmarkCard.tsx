'use client';
import { useEffect, useState } from 'react';
import type { DiagnosticoResultado, BenchmarkDatos } from '@/types';
import { DIMENSIONES } from '@/data/preguntas';
import { getBenchmarkReal } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Database, FlaskConical } from 'lucide-react';

interface Props {
  resultado: DiagnosticoResultado;
}

export default function BenchmarkCard({ resultado }: Props) {
  const { benchmark: benchmarkSimulado, resultados, puntajeGlobal, empresa } = resultado;
  const [benchmark, setBenchmark] = useState<BenchmarkDatos>(benchmarkSimulado);
  const [esReal, setEsReal] = useState(false);

  useEffect(() => {
    getBenchmarkReal(empresa.sector, empresa.tamanio).then(real => {
      if (real && real.nEmpresas >= 3) {
        setBenchmark(real);
        setEsReal(true);
      }
    });
  }, [empresa.sector, empresa.tamanio]);

  const difGlobal = puntajeGlobal - benchmark.promedioGlobal;

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-gray-900">Benchmark Sectorial</h3>
          <p className="text-xs text-gray-500">{benchmark.etiqueta}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
            esReal
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          )}>
            {esReal
              ? <><Database className="w-3 h-3" /> Datos reales · n={benchmark.nEmpresas}</>
              : <><FlaskConical className="w-3 h-3" /> Datos simulados · n={benchmark.nEmpresas}</>
            }
          </span>
        </div>
      </div>

      {/* Global comparison */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Mi empresa</p>
          <p className="text-3xl font-extrabold text-indigo-600">{puntajeGlobal}</p>
        </div>
        <div className="text-center">
          <div className={cn(
            'flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full',
            difGlobal > 0 ? 'bg-emerald-100 text-emerald-700'
              : difGlobal < 0 ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600'
          )}>
            {difGlobal > 0
              ? <><TrendingUp className="w-4 h-4" />+{difGlobal} pts</>
              : difGlobal < 0
              ? <><TrendingDown className="w-4 h-4" />{difGlobal} pts</>
              : <><Minus className="w-4 h-4" />En la media</>
            }
          </div>
          <p className="text-xs text-gray-400 mt-1">vs promedio {benchmark.promedioGlobal}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Promedio sector</p>
          <p className="text-3xl font-extrabold text-gray-300">{benchmark.promedioGlobal}</p>
        </div>
      </div>

      {/* Per dimension */}
      <div className="space-y-2.5">
        {resultados.map(r => {
          const bench = benchmark.promedioPorDimension[r.dimensionId] ?? 0;
          const dif = r.puntaje - bench;
          const dim = DIMENSIONES.find(d => d.id === r.dimensionId);
          return (
            <div key={r.dimensionId} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-32 truncate">
                {r.nombre.split(' ').slice(0, 2).join(' ')}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${r.puntaje}%`, backgroundColor: dim?.color ?? '#6366f1' }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                  style={{ left: `${bench}%` }}
                  title={`Benchmark: ${bench}`}
                />
              </div>
              <div className="flex items-center gap-1.5 w-24 justify-end">
                <span className="text-xs font-bold text-gray-800">{r.puntaje}</span>
                <span className={cn(
                  'text-xs font-medium',
                  dif > 0 ? 'text-emerald-600' : dif < 0 ? 'text-red-500' : 'text-gray-400'
                )}>
                  ({dif > 0 ? '+' : ''}{dif})
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">| = promedio del sector</p>
    </div>
  );
}
