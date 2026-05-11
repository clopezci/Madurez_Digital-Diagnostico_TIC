import { PREGUNTAS, DIMENSIONES } from '@/data/preguntas';
import { getBenchmark } from '@/data/benchmark';
import { generarRecomendaciones } from '@/data/recomendaciones';
import type {
  RespuestaUsuario,
  ResultadoDimension,
  NivelMadurez,
  DiagnosticoResultado,
  InformacionEmpresa,
  Accion90Dias,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function calcularNivel(puntaje: number): NivelMadurez {
  if (puntaje <= 20) return 'Inicial';
  if (puntaje <= 40) return 'Explorando';
  if (puntaje <= 60) return 'Definido';
  if (puntaje <= 80) return 'Optimizando';
  return 'Transformador';
}

export const NIVEL_COLORES: Record<NivelMadurez, string> = {
  Inicial: '#ef4444',
  Explorando: '#f97316',
  Definido: '#eab308',
  Optimizando: '#22c55e',
  Transformador: '#6366f1',
};

export const NIVEL_DESCRIPCIONES: Record<NivelMadurez, string> = {
  Inicial: 'La empresa apenas comienza su viaje digital. Hay oportunidades significativas de mejora en casi todas las áreas.',
  Explorando: 'Se han dado los primeros pasos digitales, pero de forma irregular. Es el momento de construir bases sólidas.',
  Definido: 'Existe una base digital establecida. El foco debe estar en optimizar lo que ya funciona y cerrar las brechas restantes.',
  Optimizando: 'La empresa tiene una madurez digital sólida. El siguiente paso es la mejora continua y la innovación sistemática.',
  Transformador: 'Excelente madurez digital. La empresa es referente en su sector y puede explorar innovación disruptiva.',
};

function calcularResultadosDimensiones(respuestas: RespuestaUsuario[]): ResultadoDimension[] {
  return DIMENSIONES.map(dim => {
    const preguntasDim = PREGUNTAS.filter(p => p.dimensionId === dim.id);
    const maxPuntaje = preguntasDim.length * 4;
    const puntajeRaw = preguntasDim.reduce((sum, p) => {
      const r = respuestas.find(r => r.preguntaId === p.id);
      return sum + (r?.valor ?? 0);
    }, 0);
    const puntaje = Math.round((puntajeRaw / maxPuntaje) * 100);
    return {
      dimensionId: dim.id,
      nombre: dim.nombre,
      puntaje,
      nivel: calcularNivel(puntaje),
      color: dim.color,
    };
  });
}

function generarRuta90Dias(resultados: ResultadoDimension[]): Accion90Dias[] {
  const ordenadas = [...resultados].sort((a, b) => a.puntaje - b.puntaje);
  const acciones: Accion90Dias[] = [];

  const plantillas: Record<string, { semanas: [number, number]; acciones: string[][] }> = {
    estrategia: {
      semanas: [1, 5],
      acciones: [
        ['Taller de visión digital', 'Reúna a la dirección para definir y documentar 3 objetivos digitales prioritarios para el año.', 'inmediata'],
        ['Definir KPIs digitales', 'Establezca 5–8 indicadores clave y configure un dashboard semanal de seguimiento.', 'corto_plazo'],
        ['Aprobar presupuesto digital', 'Reserve entre 3–8% del presupuesto para iniciativas digitales y cree la línea presupuestal.', 'mediano_plazo'],
      ],
    },
    tecnologia: {
      semanas: [1, 4],
      acciones: [
        ['Migrar a herramientas en la nube', 'Adopte Google Workspace o Microsoft 365 para toda la colaboración del equipo.', 'inmediata'],
        ['Activar 2FA y política de contraseñas', 'Implemente autenticación en dos factores en todos los sistemas críticos.', 'corto_plazo'],
        ['Configurar backups automáticos', 'Establezca respaldos automáticos diarios de todos los datos críticos del negocio.', 'mediano_plazo'],
      ],
    },
    datos: {
      semanas: [2, 6],
      acciones: [
        ['Inventario de fuentes de datos', 'Mapee todas las fuentes de datos actuales e identifique duplicidades y brechas.', 'inmediata'],
        ['Crear dashboard de métricas clave', 'Configure un tablero de control con las 10 métricas más importantes del negocio.', 'corto_plazo'],
        ['Documentar política de datos', 'Redacte y publique la política de gestión de datos cumpliendo la Ley 1581 de 2012.', 'mediano_plazo'],
      ],
    },
    talento: {
      semanas: [1, 3],
      acciones: [
        ['Evaluación de competencias digitales', 'Aplique diagnóstico de habilidades digitales a todo el equipo usando el marco DigComp.', 'inmediata'],
        ['Iniciar plan de capacitación', 'Asigne 4 horas/mes por persona en Google Actívate u otras plataformas gratuitas.', 'corto_plazo'],
        ['Definir roles digitales', 'Actualice las descripciones de cargo con responsabilidades digitales explícitas.', 'mediano_plazo'],
      ],
    },
    cliente: {
      semanas: [1, 2],
      acciones: [
        ['Activar WhatsApp Business y chat web', 'Configure canales digitales de atención inmediata para los clientes.', 'inmediata'],
        ['Implementar encuesta NPS mensual', 'Cree un formulario de satisfacción y envíelo después de cada servicio entregado.', 'corto_plazo'],
        ['Adoptar CRM gratuito', 'Implemente HubSpot CRM o Zoho Free para gestionar el pipeline de ventas.', 'mediano_plazo'],
      ],
    },
  };

  const tiposMap: Record<string, Accion90Dias['tipo']> = {
    inmediata: 'inmediata',
    corto_plazo: 'corto_plazo',
    mediano_plazo: 'mediano_plazo',
  };

  let semanaBase = 1;
  for (const dim of ordenadas.slice(0, 3)) {
    const plantilla = plantillas[dim.dimensionId];
    if (!plantilla) continue;
    const [offset] = plantilla.semanas;
    plantilla.acciones.forEach(([titulo, descripcion, tipo], i) => {
      acciones.push({
        semana: Math.min(semanaBase + offset + i * 2, 12),
        titulo,
        descripcion,
        dimensionId: dim.dimensionId,
        dimensionNombre: dim.nombre,
        tipo: tiposMap[tipo],
      });
    });
    semanaBase += 4;
  }

  return acciones.sort((a, b) => a.semana - b.semana);
}

export function procesarDiagnostico(
  empresa: InformacionEmpresa,
  respuestas: RespuestaUsuario[]
): DiagnosticoResultado {
  const resultados = calcularResultadosDimensiones(respuestas);
  const puntajeGlobal = Math.round(
    DIMENSIONES.reduce((sum, dim) => {
      const r = resultados.find(r => r.dimensionId === dim.id);
      return sum + (r?.puntaje ?? 0) * dim.peso;
    }, 0)
  );

  return {
    id: uuidv4(),
    fecha: new Date().toISOString(),
    empresa,
    respuestas,
    resultados,
    puntajeGlobal,
    nivelGlobal: calcularNivel(puntajeGlobal),
    recomendaciones: generarRecomendaciones(resultados),
    ruta90Dias: generarRuta90Dias(resultados),
    benchmark: getBenchmark(empresa.sector, empresa.tamanio),
  };
}
