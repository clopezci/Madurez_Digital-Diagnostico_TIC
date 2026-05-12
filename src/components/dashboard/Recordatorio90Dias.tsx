'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { DiagnosticoResultado } from '@/types';

interface Props {
  resultado: DiagnosticoResultado;
}

export default function Recordatorio90Dias({ resultado }: Props) {
  const { usuario } = useAuth();
  const [suscrito, setSuscrito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storageKey = `recordatorio_${resultado.id}`;

  useEffect(() => {
    setSuscrito(localStorage.getItem(storageKey) === '1');
  }, [storageKey]);

  if (!usuario) return null;

  const fechaRecordatorio = new Date(
    new Date(resultado.fecha).getTime() + 90 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  const suscribirse = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/reminder/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          diagnosticoId: resultado.id,
          puntajeGlobal: resultado.puntajeGlobal,
          nivelGlobal: resultado.nivelGlobal,
          fecha: resultado.fecha,
        }),
      });
      if (!res.ok) throw new Error('No se pudo registrar el recordatorio.');
      setSuscrito(true);
      localStorage.setItem(storageKey, '1');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card border border-indigo-100 bg-indigo-50/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          {suscrito ? <Bell className="w-5 h-5 text-indigo-600" /> : <Mail className="w-5 h-5 text-indigo-600" />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">
            {suscrito ? 'Recordatorio activo' : 'Seguimiento a 90 días'}
          </h3>

          {suscrito ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Te enviaremos un recordatorio el <strong>{fechaRecordatorio}</strong> para que midas tu progreso con un nuevo diagnóstico.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Recibe un email el <strong>{fechaRecordatorio}</strong> (90 días después) para recordarte hacer un nuevo diagnóstico y medir tu progreso.
              </p>
              {error && (
                <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
                  <BellOff className="w-3.5 h-3.5" /> {error}
                </p>
              )}
              <button
                onClick={suscribirse}
                disabled={cargando}
                className="btn-primary text-sm py-2"
              >
                {cargando
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>
                  : <><Bell className="w-4 h-4" /> Activar recordatorio</>
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
