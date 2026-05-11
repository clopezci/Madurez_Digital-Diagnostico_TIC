'use client';
import { useState } from 'react';
import type { InformacionEmpresa } from '@/types';
import { SECTORES, TAMANIOS } from '@/data/preguntas';
import { Building2 } from 'lucide-react';

interface Props {
  onSubmit: (empresa: InformacionEmpresa) => void;
}

export default function EmpresaForm({ onSubmit }: Props) {
  const [form, setForm] = useState<InformacionEmpresa>({
    nombre: '',
    tamanio: 'micro',
    sector: 'desarrollo_software',
    cargo: '',
    ciudad: 'Medellín',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nombre.trim().length < 2) return setError('Ingresa el nombre de la empresa.');
    if (form.cargo.trim().length < 2) return setError('Ingresa tu cargo en la empresa.');
    setError('');
    onSubmit(form);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de tu empresa</h2>
        <p className="text-gray-500 text-sm">
          Estos datos nos ayudan a personalizar tu diagnóstico y compararte con empresas similares.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nombre de la empresa *</label>
          <input
            className="input-field"
            type="text"
            placeholder="Ej: TechSolutions SAS"
            value={form.nombre}
            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="label">Sub-sector TIC *</label>
          <select
            className="input-field"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
          >
            {SECTORES.map(s => (
              <option key={s.valor} value={s.valor}>{s.etiqueta}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Tamaño de la empresa *</label>
          <select
            className="input-field"
            value={form.tamanio}
            onChange={e => setForm(f => ({ ...f, tamanio: e.target.value as InformacionEmpresa['tamanio'] }))}
          >
            {TAMANIOS.map(t => (
              <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Tu cargo *</label>
            <input
              className="input-field"
              type="text"
              placeholder="Ej: Gerente General"
              value={form.cargo}
              onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Ciudad</label>
            <input
              className="input-field"
              type="text"
              placeholder="Medellín"
              value={form.ciudad ?? ''}
              onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-indigo-50 text-indigo-700 text-xs px-4 py-3 rounded-xl">
          <strong>Nota:</strong> Esta información se usa únicamente para personalizar tu diagnóstico. Los datos anonimizados se usan para el benchmark regional del sector TIC en Antioquia.
        </div>

        <button type="submit" className="btn-primary w-full py-3 mt-2">
          Continuar con el diagnóstico →
        </button>
      </form>
    </div>
  );
}
