'use client';
import { Shield, X } from 'lucide-react';

interface Props {
  onAceptar: () => void;
  onCancelar: () => void;
}

export default function ConsentimientoModal({ onAceptar, onCancelar }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Aviso de Privacidad y Habeas Data</h2>
                <p className="text-xs text-gray-500">Ley 1581 de 2012 – República de Colombia</p>
              </div>
            </div>
            <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-gray-600 space-y-3 mb-6">
            <p>
              <strong className="text-gray-800">¿Qué datos recopilamos?</strong> Información básica de tu empresa (nombre, tamaño, sector, cargo) y las respuestas del diagnóstico de madurez digital.
            </p>
            <p>
              <strong className="text-gray-800">¿Para qué los usamos?</strong> Únicamente para generar tu diagnóstico personalizado, calcular benchmarks anónimos del sector TIC en Antioquia y mostrarte recomendaciones de mejora.
            </p>
            <p>
              <strong className="text-gray-800">¿Compartimos tus datos?</strong> Los datos individuales de tu empresa <strong>nunca se comparten</strong> con terceros. Los benchmarks usan únicamente datos anonimizados y agregados.
            </p>
            <p>
              <strong className="text-gray-800">¿Dónde se almacenan?</strong> En esta versión MVP, los datos se almacenan localmente en tu dispositivo (localStorage). No se envían a servidores externos.
            </p>
            <p>
              <strong className="text-gray-800">Tus derechos (Habeas Data):</strong> Puedes conocer, actualizar, rectificar o eliminar tu información en cualquier momento desde el historial de diagnósticos.
            </p>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-500">
              <strong>Base legal:</strong> Ley 1581 de 2012 y Decreto 1377 de 2013. Responsable del tratamiento: DiagnosticoTIC – Proyecto académico UPB-SAPIENCIA 2026.
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onCancelar} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button onClick={onAceptar} className="btn-primary flex-1">
              Acepto y continúo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
