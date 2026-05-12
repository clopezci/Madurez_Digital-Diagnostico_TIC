'use client';
import { useState, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PREGUNTAS, DIMENSIONES, OPCIONES } from '@/data/preguntas';
import { procesarDiagnostico } from '@/lib/scoring';
import { guardarDiagnostico } from '@/lib/storage';
import type { InformacionEmpresa, RespuestaUsuario } from '@/types';
import EmpresaForm from './EmpresaForm';
import ConsentimientoModal from './ConsentimientoModal';
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Paso =
  | { tipo: 'empresa' }
  | { tipo: 'consentimiento' }
  | { tipo: 'dimension'; dimIndex: number; pregIndex: number }
  | { tipo: 'procesando' };

type Action =
  | { type: 'EMPRESA_OK'; empresa: InformacionEmpresa }
  | { type: 'CONSENTIMIENTO_OK' }
  | { type: 'RESPONDER'; preguntaId: string; valor: number }
  | { type: 'ANTERIOR' }
  | { type: 'SIGUIENTE' };

interface State {
  paso: Paso;
  empresa: InformacionEmpresa | null;
  respuestas: RespuestaUsuario[];
}

const PREGUNTAS_POR_DIM = DIMENSIONES.map(dim =>
  PREGUNTAS.filter(p => p.dimensionId === dim.id)
);
const TOTAL_PREGUNTAS = PREGUNTAS.length;

function reducer(state: State, action: Action): State {
  const { paso } = state;

  switch (action.type) {
    case 'EMPRESA_OK':
      return { ...state, empresa: action.empresa, paso: { tipo: 'consentimiento' } };

    case 'CONSENTIMIENTO_OK':
      return { ...state, paso: { tipo: 'dimension', dimIndex: 0, pregIndex: 0 } };

    case 'RESPONDER': {
      const sin = state.respuestas.filter(r => r.preguntaId !== action.preguntaId);
      return { ...state, respuestas: [...sin, { preguntaId: action.preguntaId, valor: action.valor }] };
    }

    case 'SIGUIENTE': {
      if (paso.tipo !== 'dimension') return state;
      const pregsEnDim = PREGUNTAS_POR_DIM[paso.dimIndex];
      if (paso.pregIndex < pregsEnDim.length - 1) {
        return { ...state, paso: { tipo: 'dimension', dimIndex: paso.dimIndex, pregIndex: paso.pregIndex + 1 } };
      }
      if (paso.dimIndex < DIMENSIONES.length - 1) {
        return { ...state, paso: { tipo: 'dimension', dimIndex: paso.dimIndex + 1, pregIndex: 0 } };
      }
      return { ...state, paso: { tipo: 'procesando' } };
    }

    case 'ANTERIOR': {
      if (paso.tipo !== 'dimension') return state;
      if (paso.pregIndex > 0) {
        return { ...state, paso: { tipo: 'dimension', dimIndex: paso.dimIndex, pregIndex: paso.pregIndex - 1 } };
      }
      if (paso.dimIndex > 0) {
        const dimAnterior = paso.dimIndex - 1;
        return { ...state, paso: { tipo: 'dimension', dimIndex: dimAnterior, pregIndex: PREGUNTAS_POR_DIM[dimAnterior].length - 1 } };
      }
      return { ...state, paso: { tipo: 'empresa' } };
    }

    default:
      return state;
  }
}

function calcularPreguntaGlobal(dimIndex: number, pregIndex: number): number {
  let count = 0;
  for (let i = 0; i < dimIndex; i++) count += PREGUNTAS_POR_DIM[i].length;
  return count + pregIndex;
}

export default function CuestionarioWizard() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    paso: { tipo: 'empresa' },
    empresa: null,
    respuestas: [],
  });
  const [showConsent, setShowConsent] = useState(false);

  // Handle 'procesando' step via effect to avoid setState-in-render
  useEffect(() => {
    if (state.paso.tipo !== 'procesando') return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const resultado = procesarDiagnostico(state.empresa!, state.respuestas);
      await guardarDiagnostico(resultado);
      if (!cancelled) router.push(`/resultados/${resultado.id}`);
    }, 1500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [state.paso.tipo, state.empresa, state.respuestas, router]);

  if (state.paso.tipo === 'empresa') {
    return (
      <div>
        {showConsent && (
          <ConsentimientoModal
            onAceptar={() => setShowConsent(false)}
            onCancelar={() => setShowConsent(false)}
          />
        )}
        <EmpresaForm onSubmit={empresa => dispatch({ type: 'EMPRESA_OK', empresa })} />
        <p className="text-center mt-4 text-xs text-gray-400">
          Al continuar aceptas nuestra{' '}
          <button onClick={() => setShowConsent(true)} className="text-indigo-500 hover:underline">
            política de privacidad y Habeas Data
          </button>
        </p>
      </div>
    );
  }

  if (state.paso.tipo === 'consentimiento') {
    return (
      <ConsentimientoModal
        onAceptar={() => dispatch({ type: 'CONSENTIMIENTO_OK' })}
        onCancelar={() => dispatch({ type: 'ANTERIOR' })}
      />
    );
  }

  if (state.paso.tipo === 'procesando') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <h2 className="text-xl font-bold text-gray-900">Analizando tu diagnóstico...</h2>
        <p className="text-gray-500 text-sm">Calculando puntajes, benchmark y recomendaciones personalizadas.</p>
      </div>
    );
  }

  // Dimension step
  const { dimIndex, pregIndex } = state.paso;
  const dim = DIMENSIONES[dimIndex];
  const pregsEnDim = PREGUNTAS_POR_DIM[dimIndex];
  const pregunta = pregsEnDim[pregIndex];
  const pregGlobal = calcularPreguntaGlobal(dimIndex, pregIndex);
  const respuestaActual = state.respuestas.find(r => r.preguntaId === pregunta.id);
  const progresoPct = Math.round((pregGlobal / TOTAL_PREGUNTAS) * 100);
  const esUltima = dimIndex === DIMENSIONES.length - 1 && pregIndex === pregsEnDim.length - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar global */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Pregunta {pregGlobal + 1} de {TOTAL_PREGUNTAS}</span>
          <span>{progresoPct}% completado</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progresoPct}%`, backgroundColor: dim.color }}
          />
        </div>
      </div>

      {/* Dimension tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DIMENSIONES.map((d, i) => {
          const pregsDim = PREGUNTAS_POR_DIM[i];
          const respsDim = state.respuestas.filter(r => pregsDim.some(p => p.id === r.preguntaId));
          const completada = respsDim.length === pregsDim.length;
          const activa = i === dimIndex;
          return (
            <div
              key={d.id}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                activa
                  ? 'text-white'
                  : completada
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              )}
              style={activa ? { backgroundColor: d.color } : {}}
            >
              {completada && !activa && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{d.icono} {d.nombre}</span>
            </div>
          );
        })}
      </div>

      {/* Question card */}
      <div className="card mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{dim.icono}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: dim.color }}>
              {dim.nombre}
            </p>
            <p className="text-xs text-gray-400">Pregunta {pregIndex + 1} de {pregsEnDim.length}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-6 leading-snug">
          {pregunta.texto}
        </h2>

        <div className="space-y-2.5">
          {OPCIONES.map(opcion => (
            <button
              key={opcion.valor}
              onClick={() => dispatch({ type: 'RESPONDER', preguntaId: pregunta.id, valor: opcion.valor })}
              className={cn(
                'w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3',
                respuestaActual?.valor === opcion.valor
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/40'
              )}
            >
              <span
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all',
                  respuestaActual?.valor === opcion.valor
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-gray-300 text-gray-400'
                )}
              >
                {opcion.valor}
              </span>
              {opcion.texto}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={() => dispatch({ type: 'ANTERIOR' })} className="btn-secondary">
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>
        <button
          onClick={() => dispatch({ type: 'SIGUIENTE' })}
          disabled={respuestaActual === undefined}
          className="btn-primary flex-1"
        >
          {esUltima ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Ver mi diagnóstico
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
