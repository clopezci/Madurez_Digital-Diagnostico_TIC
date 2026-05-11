import type { BenchmarkDatos } from '@/types';

// Datos simulados de benchmark para empresas TIC en Antioquia
// Basados en estudios regionales del ecosistema TIC y Cámara de Comercio de Medellín
const DATOS: BenchmarkDatos[] = [
  {
    sector: 'desarrollo_software', tamanio: 'micro',
    promedioPorDimension: { estrategia: 38, tecnologia: 55, datos: 32, talento: 47, cliente: 44 },
    promedioGlobal: 43, nEmpresas: 28,
    etiqueta: 'Empresas de Software Micro (Antioquia)',
  },
  {
    sector: 'desarrollo_software', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 57, tecnologia: 70, datos: 50, talento: 63, cliente: 58 },
    promedioGlobal: 60, nEmpresas: 45,
    etiqueta: 'Empresas de Software Pequeñas (Antioquia)',
  },
  {
    sector: 'desarrollo_software', tamanio: 'mediana',
    promedioPorDimension: { estrategia: 68, tecnologia: 78, datos: 65, talento: 72, cliente: 68 },
    promedioGlobal: 71, nEmpresas: 18,
    etiqueta: 'Empresas de Software Medianas (Antioquia)',
  },
  {
    sector: 'consultoria_ti', tamanio: 'micro',
    promedioPorDimension: { estrategia: 45, tecnologia: 50, datos: 36, talento: 52, cliente: 40 },
    promedioGlobal: 45, nEmpresas: 32,
    etiqueta: 'Consultoras TI Micro (Antioquia)',
  },
  {
    sector: 'consultoria_ti', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 60, tecnologia: 64, datos: 55, talento: 68, cliente: 57 },
    promedioGlobal: 61, nEmpresas: 38,
    etiqueta: 'Consultoras TI Pequeñas (Antioquia)',
  },
  {
    sector: 'marketing_digital', tamanio: 'micro',
    promedioPorDimension: { estrategia: 50, tecnologia: 55, datos: 52, talento: 55, cliente: 68 },
    promedioGlobal: 56, nEmpresas: 25,
    etiqueta: 'Agencias Marketing Digital Micro (Antioquia)',
  },
  {
    sector: 'marketing_digital', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 65, tecnologia: 62, datos: 64, talento: 68, cliente: 78 },
    promedioGlobal: 67, nEmpresas: 20,
    etiqueta: 'Agencias Marketing Digital Pequeñas (Antioquia)',
  },
  {
    sector: 'infraestructura_redes', tamanio: 'micro',
    promedioPorDimension: { estrategia: 35, tecnologia: 68, datos: 30, talento: 45, cliente: 35 },
    promedioGlobal: 43, nEmpresas: 15,
    etiqueta: 'Empresas Infraestructura/Redes Micro (Antioquia)',
  },
  {
    sector: 'infraestructura_redes', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 52, tecnologia: 76, datos: 45, talento: 58, cliente: 48 },
    promedioGlobal: 57, nEmpresas: 20,
    etiqueta: 'Empresas Infraestructura/Redes Pequeñas (Antioquia)',
  },
  {
    sector: 'ecommerce', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 62, tecnologia: 66, datos: 65, talento: 58, cliente: 75 },
    promedioGlobal: 65, nEmpresas: 18,
    etiqueta: 'Empresas E-commerce Pequeñas (Antioquia)',
  },
  {
    sector: 'fintech', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 68, tecnologia: 74, datos: 70, talento: 65, cliente: 68 },
    promedioGlobal: 69, nEmpresas: 12,
    etiqueta: 'Fintech Pequeñas (Antioquia)',
  },
  // Fallback genérico
  {
    sector: 'otro', tamanio: 'micro',
    promedioPorDimension: { estrategia: 36, tecnologia: 46, datos: 30, talento: 43, cliente: 38 },
    promedioGlobal: 39, nEmpresas: 55,
    etiqueta: 'Promedio PYMES TIC Micro (Antioquia)',
  },
  {
    sector: 'otro', tamanio: 'pequena',
    promedioPorDimension: { estrategia: 52, tecnologia: 60, datos: 46, talento: 56, cliente: 52 },
    promedioGlobal: 53, nEmpresas: 65,
    etiqueta: 'Promedio PYMES TIC Pequeñas (Antioquia)',
  },
  {
    sector: 'otro', tamanio: 'mediana',
    promedioPorDimension: { estrategia: 64, tecnologia: 70, datos: 60, talento: 67, cliente: 63 },
    promedioGlobal: 65, nEmpresas: 30,
    etiqueta: 'Promedio Empresas TIC Medianas (Antioquia)',
  },
];

export function getBenchmark(sector: string, tamanio: string): BenchmarkDatos {
  const exacto = DATOS.find(b => b.sector === sector && b.tamanio === tamanio);
  if (exacto) return exacto;

  const porSector = DATOS.find(b => b.sector === sector);
  if (porSector) return porSector;

  const generico = DATOS.find(b => b.sector === 'otro' && b.tamanio === tamanio);
  return generico ?? DATOS[DATOS.length - 1];
}
