'use client';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import type { DiagnosticoResultado } from '@/types';

interface Props {
  resultado: DiagnosticoResultado;
}

export default function RadarMadurez({ resultado }: Props) {
  const data = resultado.resultados.map(r => ({
    dimension: r.nombre.split(' ')[0] + (r.nombre.split(' ')[1] ? ' ' + r.nombre.split(' ')[1] : ''),
    empresa: r.puntaje,
    benchmark: resultado.benchmark.promedioPorDimension[r.dimensionId] ?? 0,
  }));

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 mb-1">Perfil de Madurez Digital</h3>
      <p className="text-xs text-gray-500 mb-4">Tu empresa vs. benchmark del sector</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#f1f5f9" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#64748b' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
          <Radar
            name="Mi empresa"
            dataKey="empresa"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Radar
            name={resultado.benchmark.etiqueta.split('(')[0].trim()}
            dataKey="benchmark"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.1}
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Tooltip
            formatter={(val: number, name: string) => [`${val}/100`, name]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
