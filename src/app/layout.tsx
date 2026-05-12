import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const BASE_URL = 'https://madurez-digital-diagnostico-tic.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'DiagnosticoTIC – Madurez Digital para PYMES TIC',
    template: '%s | DiagnosticoTIC',
  },
  description:
    'Herramienta gratuita de diagnóstico de madurez digital para empresas TIC en Antioquia. Evalúa 5 dimensiones clave, compárate con el sector y obtén un plan de mejora de 90 días.',
  keywords: ['madurez digital', 'PYMES TIC', 'diagnóstico digital', 'transformación digital', 'Antioquia', 'Colombia', 'UPB', 'SAPIENCIA'],
  authors: [{ name: 'Proyecto UPB-SAPIENCIA 2026' }],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'DiagnosticoTIC',
    title: 'DiagnosticoTIC – ¿Qué tan madura es la transformación digital de tu empresa?',
    description: 'Diagnóstico gratuito de madurez digital para PYMES TIC en Antioquia. 30 preguntas, 5 dimensiones, benchmark regional y plan de 90 días.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DiagnosticoTIC – Madurez Digital para PYMES TIC',
    description: 'Diagnóstico gratuito de madurez digital para PYMES TIC en Antioquia.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
