'use client';
import { useState } from 'react';
import { Link2, Copy, Check, Loader2, Globe, EyeOff } from 'lucide-react';
import { generarLinkPublico, revocarLinkPublico } from '@/lib/storage';
import type { DiagnosticoResultado } from '@/types';

interface Props {
  resultado: DiagnosticoResultado;
}

export default function CompartirLink({ resultado }: Props) {
  const [tokenPublico, setTokenPublico] = useState<string | undefined>(resultado.tokenPublico);
  const [compartido, setCompartido] = useState<boolean>(resultado.compartidoPublicamente ?? false);
  const [copiado, setCopiado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const url = tokenPublico
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://madurez-digital-diagnostico-tic.vercel.app'}/r/${tokenPublico}`
    : '';

  const activar = async () => {
    setCargando(true);
    const token = await generarLinkPublico(resultado.id);
    if (token) {
      setTokenPublico(token);
      setCompartido(true);
    }
    setCargando(false);
  };

  const revocar = async () => {
    if (!confirm('¿Desactivar el enlace público? Quien tenga el link ya no podrá ver el resultado.')) return;
    setCargando(true);
    await revocarLinkPublico(resultado.id);
    setTokenPublico(undefined);
    setCompartido(false);
    setCargando(false);
  };

  const copiar = async () => {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Enlace público</h3>
        {compartido && (
          <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
            Activo
          </span>
        )}
      </div>

      {!compartido ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Genera un enlace para compartir este resultado sin que el destinatario necesite crear una cuenta.
            Ideal para mostrar a clientes, socios o en LinkedIn.
          </p>
          <button onClick={activar} disabled={cargando} className="btn-primary text-sm">
            {cargando
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
              : <><Link2 className="w-4 h-4" /> Generar enlace público</>
            }
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            Cualquier persona con este enlace puede ver el resultado (sin datos de contacto ni respuestas).
          </p>
          <div className="flex gap-2 mb-3">
            <input
              readOnly
              value={url}
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 font-mono truncate"
            />
            <button
              onClick={copiar}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <button
            onClick={revocar}
            disabled={cargando}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            {cargando
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <EyeOff className="w-3.5 h-3.5" />
            }
            Desactivar enlace público
          </button>
        </>
      )}
    </div>
  );
}
