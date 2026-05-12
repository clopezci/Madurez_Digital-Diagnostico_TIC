export type NivelMadurez = 'Inicial' | 'Explorando' | 'Definido' | 'Optimizando' | 'Transformador';
export type Prioridad = 'alta' | 'media' | 'baja';
export type NivelImpacto = 'alto' | 'medio' | 'bajo';

export interface DimensionInfo {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  peso: number;
  icono: string;
}

export interface Pregunta {
  id: string;
  dimensionId: string;
  texto: string;
}

export interface RespuestaUsuario {
  preguntaId: string;
  valor: number; // 0–4
}

export interface InformacionEmpresa {
  nombre: string;
  tamanio: 'micro' | 'pequena' | 'mediana' | 'grande';
  sector: string;
  cargo: string;
  ciudad?: string;
}

export interface ResultadoDimension {
  dimensionId: string;
  nombre: string;
  puntaje: number; // 0–100
  nivel: NivelMadurez;
  color: string;
}

export interface RecomendacionItem {
  id: string;
  dimensionId: string;
  dimensionNombre: string;
  prioridad: Prioridad;
  titulo: string;
  descripcion: string;
  impacto: NivelImpacto;
  esfuerzo: NivelImpacto;
  recursos: string[];
  plazo: string;
}

export interface Accion90Dias {
  semana: number;
  titulo: string;
  descripcion: string;
  dimensionId: string;
  dimensionNombre: string;
  tipo: 'inmediata' | 'corto_plazo' | 'mediano_plazo';
}

export interface BenchmarkDatos {
  sector: string;
  tamanio: string;
  promedioPorDimension: Record<string, number>;
  promedioGlobal: number;
  nEmpresas: number;
  etiqueta: string;
}

export interface DiagnosticoResultado {
  id: string;
  fecha: string;
  empresa: InformacionEmpresa;
  respuestas: RespuestaUsuario[];
  resultados: ResultadoDimension[];
  puntajeGlobal: number;
  nivelGlobal: NivelMadurez;
  recomendaciones: RecomendacionItem[];
  ruta90Dias: Accion90Dias[];
  benchmark: BenchmarkDatos;
  tokenPublico?: string;
  compartidoPublicamente?: boolean;
}

// Usuario: ya no guarda passwordHash (Supabase Auth lo maneja)
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  createdAt: string;
}
