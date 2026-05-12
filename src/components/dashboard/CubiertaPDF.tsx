import type { DiagnosticoResultado } from '@/types';
import { NIVEL_COLORES } from '@/lib/scoring';
import { formatFecha } from '@/lib/utils';

interface Props {
  resultado: DiagnosticoResultado;
}

export default function CubiertaPDF({ resultado }: Props) {
  const { empresa, puntajeGlobal, nivelGlobal, resultados, fecha } = resultado;
  const color = NIVEL_COLORES[nivelGlobal];
  const hoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="hidden print:block pdf-portada">
      {/* Franja superior */}
      <div className="pdf-header" style={{ backgroundColor: color }}>
        <div className="pdf-header-inner">
          <div>
            <p className="pdf-brand">DiagnosticoTIC</p>
            <p className="pdf-subtitle">Herramienta de Madurez Digital · Ecosistema TIC Antioquia</p>
          </div>
          <p className="pdf-subtitle" style={{ opacity: 0.8 }}>UPB-SAPIENCIA 2026</p>
        </div>
      </div>

      {/* Cuerpo portada */}
      <div className="pdf-cover-body">
        <p className="pdf-report-label">REPORTE DE DIAGNÓSTICO</p>
        <h1 className="pdf-cover-title">Madurez Digital Empresarial</h1>

        {/* Score badge */}
        <div className="pdf-score-badge" style={{ borderColor: color }}>
          <div className="pdf-score-number" style={{ color }}>{puntajeGlobal}</div>
          <div className="pdf-score-label">/ 100 puntos</div>
          <div className="pdf-score-nivel" style={{ backgroundColor: color + '18', color }}>
            Nivel: {nivelGlobal}
          </div>
        </div>

        {/* Empresa info */}
        <div className="pdf-empresa-box">
          <div className="pdf-empresa-row">
            <span className="pdf-empresa-key">Empresa</span>
            <span className="pdf-empresa-val">{empresa.nombre}</span>
          </div>
          <div className="pdf-empresa-row">
            <span className="pdf-empresa-key">Sector</span>
            <span className="pdf-empresa-val">{empresa.sector.replace(/_/g, ' ')}</span>
          </div>
          <div className="pdf-empresa-row">
            <span className="pdf-empresa-key">Tamaño</span>
            <span className="pdf-empresa-val" style={{ textTransform: 'capitalize' }}>{empresa.tamanio}</span>
          </div>
          {empresa.ciudad && (
            <div className="pdf-empresa-row">
              <span className="pdf-empresa-key">Ciudad</span>
              <span className="pdf-empresa-val">{empresa.ciudad}</span>
            </div>
          )}
          <div className="pdf-empresa-row">
            <span className="pdf-empresa-key">Evaluado por</span>
            <span className="pdf-empresa-val">{empresa.cargo}</span>
          </div>
          <div className="pdf-empresa-row">
            <span className="pdf-empresa-key">Fecha diagnóstico</span>
            <span className="pdf-empresa-val">{formatFecha(fecha)}</span>
          </div>
          <div className="pdf-empresa-row">
            <span className="pdf-empresa-key">Fecha del reporte</span>
            <span className="pdf-empresa-val">{hoy}</span>
          </div>
        </div>

        {/* Minibars por dimensión */}
        <div className="pdf-dims">
          <p className="pdf-dims-title">Puntajes por dimensión</p>
          {resultados.map(r => (
            <div key={r.dimensionId} className="pdf-dim-row">
              <span className="pdf-dim-name">{r.nombre}</span>
              <div className="pdf-dim-bar-bg">
                <div
                  className="pdf-dim-bar-fill"
                  style={{ width: `${r.puntaje}%`, backgroundColor: r.color }}
                />
              </div>
              <span className="pdf-dim-val" style={{ color: r.color }}>{r.puntaje}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie portada */}
      <div className="pdf-footer">
        <p>DiagnosticoTIC · Proyecto académico UPB-SAPIENCIA 2026 · Ley 1581 de 2012 (Habeas Data)</p>
      </div>
    </div>
  );
}
