import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="card shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Términos de Uso</h1>
          <p className="text-xs text-gray-500 mb-6">Última actualización: mayo 2026</p>
          <div className="text-sm text-gray-700 space-y-4">
            <p>DiagnosticoTIC es una herramienta académica, gratuita y sin fines de lucro, desarrollada en el marco del programa UPB-SAPIENCIA 2026.</p>
            <p><strong>Uso permitido:</strong> Esta herramienta está diseñada para que empresas TIC de Antioquia realicen un autodiagnóstico de su madurez digital con fines de mejora interna.</p>
            <p><strong>Limitación de responsabilidad:</strong> Los resultados del diagnóstico son orientativos y se basan en las respuestas del usuario. No constituyen consultoría profesional. El equipo no garantiza resultados específicos derivados de las recomendaciones.</p>
            <p><strong>Propiedad intelectual:</strong> Los contenidos, metodología y código fuente son propiedad del equipo desarrollador del proyecto académico.</p>
            <p><strong>Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos con previo aviso.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/" className="text-sm text-indigo-600 hover:underline">← Volver al inicio</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
