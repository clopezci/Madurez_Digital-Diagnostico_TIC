'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import type { DiagnosticoResultado } from '@/types';
import { NIVEL_COLORES } from '@/lib/scoring';

interface Props {
  resultado: DiagnosticoResultado;
}

export default function BarraDimensiones({ resultado }: Props) {
  const data = resultado.resultados.map(r => ({
    nombre: r.nombre.replace('Experiencia del Cliente Digital', 'Exp. Cliente').replace(' e Infraestructura', ''),
    empresa: r.puntaje,
    benchmark: resultado.benchmark.promedioPorDimension[r.dimensionId] ?? 0,
    color: r.color,
    nivel: r.nivel,
  }));

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 mb-1">Puntaje por Dimensión</h3>
      <p className="text-xs text-gray-500 mb-4">Comparación con el benchmark del sector</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip
            formatter={(val: number, name: string) => [`${val}/100`, name === 'empresa' ? 'Mi empresa' : 'Benchmark']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <ReferenceLine y={50} stroke="#e2e8f0" strokeDasharray="4 2" />
          <Bar dataKey="empresa" name="empresa" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
          <Bar dataKey="benchmark" name="benchmark" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-500" /><span>Mi empresa</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gray-200" /><span>Benchmark sector</span></div>
      </div>
    </div>
  );
}
