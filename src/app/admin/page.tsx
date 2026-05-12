'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getAdminStats, getStatsPorSector, getStatsPorTamanio, getTendenciaMensual,
  type AdminStats, type StatsSector, type StatsTamanio, type StatsMes,
} from '@/lib/storage';
import { NIVEL_COLORES } from '@/lib/scoring';
import Header from '@/components/layout/Header';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Loader2, Users, ClipboardList, BarChart3, TrendingUp, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_EMAILS = ['clpezci@gmail.com', 'clopezci@hotmail.com'];

const NIVEL_ORDER = ['Inicial', 'Explorando', 'Definido', 'Optimizando', 'Transformador'];
const DIM_LABELS: Record<string, string> = {
  estrategia: 'Estrategia', tecnologia: 'Tecnología',
  datos: 'Datos', talento: 'Talento', cliente: 'Cliente',
};
const DIM_COLORS: Record<string, string> = {
  estrategia: '#6366f1', tecnologia: '#0ea5e9',
  datos: '#10b981', talento: '#f59e0b', cliente: '#ec4899',
};
const TAMANIO_LABELS: Record<string, string> = {
  micro: 'Micro', pequena: 'Pequeña', mediana: 'Mediana', grande: 'Grande',
};

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats]     = useState<AdminStats | null>(null);
  const [sector, setSector]   = useState<StatsSector[]>([]);
  const [tamanio, setTamanio] = useState<StatsTamanio[]>([]);
  const [tendencia, setTendencia] = useState<StatsMes[]>([]);
  const [cargando, setCargando] = useState(true);
  const [sinSupabase, setSinSupabase] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!usuario) { router.replace('/login'); return; }
    if (!ADMIN_EMAILS.includes(usuario.email)) { router.replace('/'); return; }

    Promise.all([
      getAdminStats(),
      getStatsPorSector(),
      getStatsPorTamanio(),
      getTendenciaMensual(),
    ]).then(([s, sec, tam, ten]) => {
      if (!s) { setSinSupabase(true); } else { setStats(s); }
      setSector(sec);
      setTamanio(tam);
      setTendencia(ten);
      setCargando(false);
    });
  }, [loading, usuario, router]);

  if (loading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (sinSupabase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Supabase no configurado</h1>
          <p className="text-gray-500 text-sm">
            El panel de administración requiere Supabase con las funciones de métricas instaladas.
            Ejecuta <code className="bg-gray-100 px-1 rounded">supabase_admin.sql</code> en el SQL Editor.
          </p>
        </div>
      </div>
    );
  }

  const nivelesData = NIVEL_ORDER.map(n => ({
    name: n,
    value: stats?.niveles[n] ?? 0,
    color: NIVEL_COLORES[n as keyof typeof NIVEL_COLORES],
  }));

  const dimensionesData = Object.entries(stats?.por_dimension ?? {}).map(([key, val]) => ({
    name: DIM_LABELS[key] ?? key,
    puntaje: Number(val),
    color: DIM_COLORS[key] ?? '#6366f1',
  }));

  const sectorData = sector.map(s => ({
    name: s.sector.replace(/_/g, ' ').split(' ').map(w =>
      w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    total: s.total,
    promedio: s.promedio,
  }));

  const tamanioData = tamanio.map(t => ({
    name: TAMANIO_LABELS[t.tamanio] ?? t.tamanio,
    total: t.total,
    promedio: t.promedio,
  }));

  const nivelMasFrecuente = NIVEL_ORDER.reduce((a, b) =>
    (stats?.niveles[a] ?? 0) >= (stats?.niveles[b] ?? 0) ? a : b, 'Inicial');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
            <p className="text-sm text-gray-500">Métricas agregadas del programa UPB-SAPIENCIA 2026</p>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-full">
            Solo admin
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Diagnósticos realizados"
            value={stats?.total_diagnosticos ?? 0}
            sub="total acumulado"
            icon={ClipboardList}
            color="#6366f1"
          />
          <KpiCard
            label="Empresas únicas"
            value={stats?.total_usuarios ?? 0}
            sub="usuarios registrados"
            icon={Users}
            color="#0ea5e9"
          />
          <KpiCard
            label="Puntaje promedio"
            value={`${stats?.promedio_global ?? 0}/100`}
            sub="promedio global"
            icon={BarChart3}
            color="#10b981"
          />
          <KpiCard
            label="Nivel predominante"
            value={nivelMasFrecuente}
            sub={`${stats?.niveles[nivelMasFrecuente] ?? 0} empresas`}
            icon={TrendingUp}
            color={NIVEL_COLORES[nivelMasFrecuente as keyof typeof NIVEL_COLORES]}
          />
        </div>

        {/* Distribución niveles + Dimensiones */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* Distribución de niveles */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-1">Distribución por nivel</h2>
            <p className="text-xs text-gray-500 mb-4">Cantidad de empresas en cada nivel de madurez</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={nivelesData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(v: number) => [v, 'Empresas']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {nivelesData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Promedio por dimensión */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-1">Promedio por dimensión</h2>
            <p className="text-xs text-gray-500 mb-4">Puntaje promedio de todas las empresas</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dimensionesData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => [`${v}/100`, 'Promedio']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="puntaje" radius={[0, 6, 6, 0]}>
                  {dimensionesData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendencia mensual */}
        {tendencia.length > 0 && (
          <div className="card mb-6">
            <h2 className="font-bold text-gray-900 mb-1">Tendencia mensual</h2>
            <p className="text-xs text-gray-500 mb-4">Diagnósticos realizados y puntaje promedio por mes</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={tendencia} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total"
                  name="Diagnósticos"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="promedio"
                  name="Puntaje prom."
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sector + Tamaño */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {sectorData.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-1">Participación por sector</h2>
              <p className="text-xs text-gray-500 mb-4">Número de diagnósticos por sub-sector TIC</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sectorData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={95} />
                  <Tooltip
                    formatter={(v: number, name: string) => [v, name === 'total' ? 'Diagnósticos' : 'Promedio']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="total" name="Diagnósticos" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {tamanioData.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-1">Distribución por tamaño</h2>
              <p className="text-xs text-gray-500 mb-4">Empresas participantes según tamaño</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={tamanioData}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {tamanioData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'][i % 4]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [v, 'Diagnósticos']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center pb-4">
          Datos agregados y anónimos · Sin información personal identificable · Ley 1581 de 2012
        </p>
      </main>
    </div>
  );
}
