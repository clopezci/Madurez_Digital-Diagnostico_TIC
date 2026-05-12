import Link from 'next/link';
import Header from '@/components/layout/Header';
import { BarChart3, CheckCircle, Clock, Target, TrendingUp, Users, Shield } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-indigo-600" />,
      title: '5 Dimensiones Clave',
      desc: 'Evalúa Estrategia Digital, Tecnología, Datos, Talento y Experiencia del Cliente con 30 preguntas diseñadas para PYMES TIC.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
      title: 'Dashboard Visual',
      desc: 'Obtén un gráfico de radar, comparativas por dimensión y tu posición frente al benchmark del ecosistema TIC de Antioquia.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      title: 'Ruta de 90 Días',
      desc: 'Recibe un plan de mejora personalizado, priorizado por impacto y esfuerzo, con acciones concretas para las próximas 12 semanas.',
    },
    {
      icon: <Users className="w-6 h-6 text-sky-600" />,
      title: 'Benchmark Regional',
      desc: 'Compárate con empresas similares por tamaño y sub-sector del ecosistema TIC en Antioquia para contextualizar tu posición.',
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: '15 Minutos',
      desc: 'El diagnóstico completo toma entre 10 y 15 minutos. Guarda tu historial y compara tu evolución en el tiempo.',
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-600" />,
      title: 'Privacidad y Habeas Data',
      desc: 'Cumplimos con la Ley 1581 de 2012. Tus datos empresariales son anonimizados para el benchmark y nunca se comparten sin consentimiento.',
    },
  ];

  const pasos = [
    { n: '01', titulo: 'Registra tu empresa', desc: 'Crea una cuenta gratuita con tu correo y datos básicos de la empresa.' },
    { n: '02', titulo: 'Responde el diagnóstico', desc: 'Evalúa 30 preguntas en 5 dimensiones clave de madurez digital.' },
    { n: '03', titulo: 'Obtén tu reporte', desc: 'Visualiza tu nivel, benchmark y recomendaciones priorizadas al instante.' },
    { n: '04', titulo: 'Ejecuta el plan', desc: 'Sigue la ruta de 90 días y vuelve a evaluar para medir tu progreso.' },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-sky-50 pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Herramienta gratuita · Ecosistema TIC Antioquia
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            ¿Qué tan madura es la{' '}
            <span className="text-indigo-600">transformación digital</span>{' '}
            de tu empresa?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Diagnostica tu nivel en 5 dimensiones clave, compárate con el benchmark regional y
            obtén una ruta de mejora de 90 días con acciones concretas y priorizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="btn-primary text-base px-8 py-4">
              Comenzar diagnóstico gratis
            </Link>
            <Link href="/login" className="btn-secondary text-base px-8 py-4">
              Ya tengo cuenta
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Sin tarjeta de crédito · 100% gratuito · Datos protegidos bajo Ley 1581/2012
          </p>
          <p className="mt-2">
            <Link href="/demo" className="text-sm text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">
              ¿Quieres ver cómo funciona? → Probar sin crear cuenta
            </Link>
          </p>
        </div>

        {/* Score preview card */}
        <div className="max-w-sm mx-auto mt-14 card shadow-lg border-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">PUNTAJE GLOBAL</p>
              <p className="text-4xl font-extrabold text-indigo-600">68</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
                Optimizando
              </span>
              <p className="text-xs text-gray-500 mt-1">vs 53 promedio sector</p>
            </div>
          </div>
          {[
            { label: 'Estrategia Digital', val: 62, color: 'bg-indigo-500' },
            { label: 'Tecnología', val: 75, color: 'bg-sky-500' },
            { label: 'Datos y Analítica', val: 55, color: 'bg-emerald-500' },
            { label: 'Talento Digital', val: 70, color: 'bg-amber-500' },
            { label: 'Exp. Cliente', val: 58, color: 'bg-rose-500' },
          ].map(d => (
            <div key={d.label} className="mb-2.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{d.label}</span>
                <span className="font-semibold text-gray-800">{d.val}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Todo lo que necesitas para mejorar</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Un diagnóstico completo, accionable y gratuito diseñado para la realidad de las PYMES TIC en Colombia.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Cómo funciona?</h2>
            <p className="text-gray-500 text-lg">Un proceso simple y guiado en 4 pasos.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((p, i) => (
              <div key={p.n} className="relative">
                {i < pasos.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-indigo-100 z-0" />
                )}
                <div className="card text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {p.n}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{p.titulo}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para conocer tu nivel de madurez digital?</h2>
          <p className="text-indigo-100 text-lg mb-8">
            Únete a las empresas TIC de Antioquia que ya están midiendo y mejorando su transformación digital.
          </p>
          <Link href="/registro" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
            <CheckCircle className="w-5 h-5" />
            Comenzar diagnóstico gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">DiagnosticoTIC</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Proyecto académico UPB-SAPIENCIA 2026 · Datos protegidos bajo Ley 1581 de 2012 (Habeas Data)
          </p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="text-xs text-gray-400 hover:text-gray-600">Privacidad</Link>
            <Link href="/terminos" className="text-xs text-gray-400 hover:text-gray-600">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
