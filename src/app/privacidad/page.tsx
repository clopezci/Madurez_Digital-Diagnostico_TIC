import Header from '@/components/layout/Header';
import Link from 'next/link';
import { Shield, Mail, Database, Eye, Trash2, RefreshCw } from 'lucide-react';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">

        {/* Header card */}
        <div className="card shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Política de Privacidad y Habeas Data</h1>
              <p className="text-sm text-gray-500">Ley 1581 de 2012 · Decreto 1377 de 2013 · República de Colombia</p>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-800">
            Última actualización: <strong>mayo de 2026</strong> · Versión 1.1
          </div>
        </div>

        {/* Rights summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Eye,       label: 'Conocer',    desc: 'tus datos' },
            { icon: RefreshCw, label: 'Rectificar', desc: 'información' },
            { icon: Trash2,    label: 'Eliminar',   desc: 'tu historial' },
            { icon: Mail,      label: 'Contactar',  desc: 'al responsable' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card p-4 text-center">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="card shadow-sm">
          <div className="space-y-7 text-sm text-gray-700">

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">1. Responsable del tratamiento</h2>
              <p>
                <strong>DiagnosticoTIC</strong> es un proyecto académico sin fines de lucro desarrollado en el marco
                del programa <strong>UPB-SAPIENCIA 2026</strong>, orientado a evaluar la madurez digital de empresas
                TIC en Antioquia, Colombia. Para ejercer sus derechos o resolver dudas sobre el tratamiento de sus
                datos puede escribir a: <a href="mailto:clpezci@gmail.com"
                  className="text-indigo-600 hover:underline">clpezci@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">2. Datos que recopilamos</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Cuenta de usuario:</strong> nombre completo y correo electrónico (requeridos para autenticación).</li>
                <li><strong>Perfil empresarial:</strong> nombre de la empresa, tamaño, sub-sector TIC, ciudad y cargo del evaluador.</li>
                <li><strong>Respuestas al diagnóstico:</strong> las 30 respuestas del cuestionario de madurez digital (escala 0–4).</li>
                <li><strong>Resultados calculados:</strong> puntajes por dimensión, nivel de madurez, recomendaciones y plan de 90 días generados automáticamente.</li>
              </ul>
              <p className="mt-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <strong>No recopilamos</strong> datos financieros, números de identificación personal (cédula, NIT),
                datos sensibles según el artículo 5 de la Ley 1581, ni información de menores de 18 años.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">3. Finalidad del tratamiento</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Generar y mostrar el diagnóstico personalizado de madurez digital al usuario autenticado.</li>
                <li>Guardar el historial de diagnósticos para seguimiento y comparación en el tiempo.</li>
                <li>Calcular benchmarks anónimos y agregados del sector TIC en Antioquia (mínimo 3 empresas por segmento para publicar un promedio).</li>
                <li>Mostrar recomendaciones de mejora priorizadas por impacto y esfuerzo.</li>
                <li>Generar estadísticas académicas agregadas para el programa UPB-SAPIENCIA 2026.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">4. Almacenamiento y seguridad</h2>
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3">
                <Database className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">
                  Los datos se almacenan en <strong>Supabase</strong> (PostgreSQL administrado por Supabase Inc.),
                  con infraestructura en servidores de <strong>Amazon Web Services (AWS)</strong>.
                  Cada usuario accede únicamente a sus propios datos mediante políticas de seguridad a nivel de fila
                  (<em>Row Level Security</em>).
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Cifrado en tránsito:</strong> toda comunicación usa HTTPS/TLS.</li>
                <li><strong>Cifrado en reposo:</strong> los datos en la base de datos están cifrados por AWS.</li>
                <li><strong>Aislamiento:</strong> ningún usuario puede acceder a datos de otro usuario.</li>
                <li><strong>Benchmark anónimo:</strong> solo se publican promedios de segmentos con 3 o más empresas; jamás datos individuales.</li>
                <li><strong>Contraseñas:</strong> gestionadas por Supabase Auth con hashing bcrypt; el equipo del proyecto no tiene acceso a contraseñas en texto plano.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">5. Transferencia internacional de datos</h2>
              <p>
                Al usar DiagnosticoTIC, sus datos son procesados en servidores de AWS ubicados fuera de Colombia.
                Esta transferencia se realiza con base en el artículo 26 de la Ley 1581 de 2012, dado que
                Supabase Inc. ofrece garantías adecuadas de protección de datos mediante sus políticas de privacidad
                y términos de servicio.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">6. Derechos del titular (Habeas Data)</h2>
              <p className="mb-2">Conforme a la Ley 1581 de 2012, usted tiene derecho a:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Conocer</strong> los datos que hemos recopilado: están visibles en el historial de diagnósticos.</li>
                <li><strong>Actualizar o rectificar</strong> su información de perfil iniciando sesión en la aplicación.</li>
                <li><strong>Eliminar</strong> cualquier diagnóstico individual desde el historial (botón de eliminar).</li>
                <li><strong>Revocar el consentimiento</strong> y solicitar eliminación total de su cuenta y datos escribiendo a <a href="mailto:clpezci@gmail.com" className="text-indigo-600 hover:underline">clpezci@gmail.com</a>. La solicitud será atendida en un plazo máximo de 15 días hábiles.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">7. Conservación de datos</h2>
              <p>
                Los datos se conservan mientras el usuario mantenga una cuenta activa. Al solicitar la eliminación
                de la cuenta, todos los datos personales serán eliminados de forma permanente en un plazo máximo
                de 15 días hábiles. Los datos agregados y anonimizados del benchmark no pueden eliminarse
                individualmente al no estar asociados a ningún usuario.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">8. Menores de edad</h2>
              <p>
                Esta herramienta está dirigida exclusivamente a responsables de empresas o personas mayores de
                18 años. No recopilamos intencionalmente datos de menores. Si detectamos un registro de menor
                de edad, procederemos a eliminarlo.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 text-base mb-2">9. Cambios a esta política</h2>
              <p>
                Cualquier modificación a esta política se publicará en esta página con la fecha de actualización.
                Para cambios sustanciales, notificaremos por correo electrónico a los usuarios registrados.
              </p>
            </section>

            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500">
              <strong>Base legal:</strong> Ley 1581 de 2012 (Protección de Datos Personales), Decreto 1377 de 2013
              (Reglamentación parcial de la Ley 1581) y Decreto 1074 de 2015, República de Colombia.
              Responsable del tratamiento: DiagnosticoTIC – Proyecto académico UPB-SAPIENCIA 2026.
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link href="/" className="text-sm text-indigo-600 hover:underline">← Volver al inicio</Link>
            <Link href="/terminos" className="text-sm text-gray-500 hover:underline">Términos de uso →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
