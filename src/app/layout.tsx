import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'DiagnosticoTIC – Madurez Digital para PYMES',
  description:
    'Herramienta gratuita de diagnóstico de madurez digital para empresas TIC en Antioquia. Evalúa 5 dimensiones clave y obtén recomendaciones accionables.',
  keywords: 'madurez digital, PYMES, TIC, diagnóstico, transformación digital, Antioquia, Colombia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
