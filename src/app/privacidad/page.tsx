import Header from '@/components/layout/Header';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="card shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Política de Privacidad y Habeas Data</h1>
              <p className="text-xs text-gray-500">Última actualización: mayo 2026</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-5">
            <section>
              <h2 className="font-bold text-gray-900 mb-2">1. Responsable del tratamiento</h2>
              <p>DiagnosticoTIC es un proyecto académico del programa UPB-SAPIENCIA 2026 desarrollado para la evaluación de madurez digital de empresas TIC en Antioquia, Colombia.</p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">2. Datos que recopilamos</h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>Nombre y correo electrónico del usuario (para autenticación)</li>
                <li>Información básica de la empresa: nombre, tamaño, sub-sector, ciudad, cargo del evaluador</li>
                <li>Respuestas al cuestionario de diagnóstico de madurez digital</li>
              </ul>
              <p className="mt-2"><strong>No recopilamos</strong> datos financieros, datos sensibles personales, números de identificación, ni información de menores de edad.</p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">3. Finalidad del tratamiento</h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>Generar el diagnóstico personalizado de madurez digital</li>
                <li>Calcular benchmarks anónimos y agregados del sector TIC en Antioquia</li>
                <li>Mostrar recomendaciones de mejora personalizadas</li>
                <li>Guardar el historial de diagnósticos del usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">4. Almacenamiento y seguridad</h2>
              <p>En la versión MVP, todos los datos se almacenan <strong>localmente en el dispositivo del usuario</strong> (localStorage del navegador). No se envían a servidores externos. Los datos anonimizados y agregados pueden usarse para el benchmark regional sin identificar empresas individuales.</p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">5. Derechos del titular (Habeas Data)</h2>
              <p>Conforme a la Ley 1581 de 2012, usted tiene derecho a:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Conocer</strong> los datos que hemos recopilado sobre usted</li>
                <li><strong>Actualizar</strong> o rectificar su información</li>
                <li><strong>Eliminar</strong> sus datos desde el historial de diagnósticos</li>
                <li><strong>Revocar</strong> el consentimiento para el tratamiento</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">6. Base legal</h2>
              <p>El tratamiento de datos se realiza con base en el consentimiento informado del titular, según lo establecido en la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.</p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">7. Menores de edad</h2>
              <p>Esta herramienta está dirigida exclusivamente a responsables de empresas o personas mayores de 18 años. No recopilamos intencionalmente datos de menores.</p>
            </section>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/" className="text-sm text-indigo-600 hover:underline">← Volver al inicio</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
