# DiagnosticoTIC – Herramienta de Madurez Digital para PYMES TIC

**Proyecto académico UPB-SAPIENCIA 2026** | Ecosistema TIC Antioquia

---

## ¿Qué es esto?

Una aplicación web gratuita que permite a empresas TIC en Antioquia diagnosticar su nivel de madurez digital en 5 dimensiones clave, compararse con un benchmark regional y obtener un plan de mejora de 90 días con recomendaciones priorizadas.

**Stack elegido: Next.js 14** (vs. Vite+Flask separado) porque:
- Full-stack en un solo proyecto → menos configuración, más velocidad de desarrollo
- API routes nativas → no se necesita servidor Python separado para el MVP
- SSR/SSG listo para producción → mejor SEO y performance
- Escalable: misma base para cuando se integre Supabase o IA generativa

---

## Stack Técnico

| Capa | Tecnología | Costo |
|------|-----------|-------|
| Frontend | Next.js 14 + React 18 + TypeScript | Gratis |
| Estilos | Tailwind CSS | Gratis |
| Gráficas | Recharts (RadarChart, BarChart) | Gratis |
| Íconos | Lucide React | Gratis |
| Estado | React useReducer (sin librería extra) | Gratis |
| Persistencia MVP | localStorage del navegador | Gratis |
| Auth MVP | localStorage con hash base64 | Gratis |
| PDF Export | window.print() + print CSS | Gratis |
| **Opcional** | Supabase (DB + Auth en la nube) | Gratis tier |
| **Opcional** | Hugging Face Inference API (IA generativa) | Gratis tier |

---

## Inicio rápido

### Requisitos previos
- Node.js 18+ ([descargar](https://nodejs.org))
- npm o yarn

### Instalación

```bash
# 1. Ir al directorio del proyecto
cd madurez-digital

# 2. Instalar dependencias
npm install

# 3. Arrancar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm start
```

---

## Estructura del proyecto

```
madurez-digital/
├── src/
│   ├── app/                      # Páginas (Next.js App Router)
│   │   ├── page.tsx              # Landing page
│   │   ├── login/page.tsx        # Inicio de sesión
│   │   ├── registro/page.tsx     # Registro de usuario
│   │   ├── diagnostico/page.tsx  # Cuestionario wizard
│   │   ├── resultados/[id]/      # Dashboard de resultados
│   │   ├── historial/page.tsx    # Lista de diagnósticos
│   │   ├── privacidad/page.tsx   # Política de privacidad (Ley 1581)
│   │   └── terminos/page.tsx     # Términos de uso
│   ├── components/
│   │   ├── cuestionario/         # Wizard de preguntas, formulario empresa, Habeas Data
│   │   ├── dashboard/            # Radar, barras, benchmark, recomendaciones, ruta 90 días
│   │   └── layout/               # Header, navegación
│   ├── context/
│   │   └── AuthContext.tsx       # Autenticación global (localStorage)
│   ├── data/
│   │   ├── preguntas.ts          # 30 preguntas en 5 dimensiones
│   │   ├── benchmark.ts          # Datos de benchmark sectorial simulados
│   │   └── recomendaciones.ts    # Motor de recomendaciones (reglas de negocio)
│   ├── lib/
│   │   ├── scoring.ts            # Motor de scoring y generación de diagnóstico
│   │   ├── storage.ts            # CRUD en localStorage (auth + diagnósticos)
│   │   └── utils.ts              # Utilidades: cn(), fechas
│   └── types/
│       └── index.ts              # Tipos TypeScript del dominio
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## Modelo de Madurez Digital (5 Dimensiones)

| # | Dimensión | Peso | Preguntas |
|---|-----------|------|-----------|
| 1 | 🎯 Estrategia Digital | 25% | 6 |
| 2 | ⚙️ Tecnología e Infraestructura | 20% | 6 |
| 3 | 📊 Datos y Analítica | 20% | 6 |
| 4 | 👥 Talento y Cultura Digital | 20% | 6 |
| 5 | 💡 Experiencia del Cliente Digital | 15% | 6 |

### Niveles de madurez

| Puntaje | Nivel | Descripción |
|---------|-------|-------------|
| 0–20 | Inicial | Apenas comienza el viaje digital |
| 21–40 | Explorando | Primeros pasos, base irregular |
| 41–60 | Definido | Base establecida, optimizar y cerrar brechas |
| 61–80 | Optimizando | Madurez sólida, mejora continua |
| 81–100 | Transformador | Referente del sector, innovación disruptiva |

---

## Funcionalidades del MVP

- [x] Landing page profesional con CTA
- [x] Registro e inicio de sesión (localStorage)
- [x] Modal de consentimiento Habeas Data (Ley 1581/2012)
- [x] Formulario de perfil de empresa (sector, tamaño, cargo)
- [x] Cuestionario wizard paso a paso (5 dimensiones, 30 preguntas)
- [x] Motor de scoring ponderado por dimensión
- [x] Dashboard de resultados con puntaje global y nivel
- [x] Gráfico de radar (empresa vs benchmark)
- [x] Gráfico de barras por dimensión
- [x] Benchmark sectorial segmentado (simulado)
- [x] Recomendaciones priorizadas por impacto/esfuerzo con recursos gratuitos
- [x] Ruta de mejora de 90 días personalizada
- [x] Historial de diagnósticos con mini-visualización
- [x] Exportar a PDF (via window.print())
- [x] Política de privacidad y términos de uso
- [x] Diseño responsive (móvil + escritorio)

---

## Migración a Supabase (Opcional)

Para persistencia en la nube (multi-dispositivo, historial colaborativo):

1. Crea un proyecto gratis en [supabase.com](https://supabase.com)
2. Copia `.env.local.example` a `.env.local` y llena las variables
3. Ejecuta el siguiente SQL en Supabase:

```sql
-- Tabla de diagnósticos
create table diagnosticos (
  id uuid primary key,
  user_id uuid references auth.users,
  fecha timestamptz default now(),
  empresa jsonb,
  respuestas jsonb,
  resultados jsonb,
  puntaje_global int,
  nivel_global text,
  recomendaciones jsonb,
  ruta_90_dias jsonb,
  benchmark jsonb
);

-- Política de seguridad por fila
alter table diagnosticos enable row level security;
create policy "Users see own diagnostics"
  on diagnosticos for all
  using (auth.uid() = user_id);
```

4. Reemplaza las funciones en `src/lib/storage.ts` por llamadas al cliente Supabase.

---

## Integración IA Generativa (Opcional)

Para recomendaciones en lenguaje natural usando Hugging Face (gratis):

```bash
npm install @huggingface/inference
```

Agrega en `.env.local`:
```
HF_API_TOKEN=hf_xxxxxxxxxxxx
```

Crea `src/app/api/recomendaciones/route.ts` con la llamada al modelo `mistralai/Mistral-7B-Instruct-v0.3` o `microsoft/Phi-3-mini-4k-instruct` (ambos gratuitos en HF).

---

## Roadmap

### Fase 2 (próximas 4 semanas)
- [ ] Integrar Supabase para persistencia real
- [ ] Auth con Google (via Supabase Auth)
- [ ] Comparación histórica de diagnósticos (línea de tiempo)
- [ ] Exportación PDF con html2canvas (mejor formato)

### Fase 3 (1–3 meses)
- [ ] Recomendaciones con IA generativa (Hugging Face)
- [ ] Módulo de seguimiento de mejoras
- [ ] Panel de administración para gremios
- [ ] Multilenguaje (inglés)
- [ ] Deploy en Vercel (gratis para proyectos de hobby)

---

## Cumplimiento Legal (Colombia)

- **Ley 1581 de 2012** (Habeas Data): Modal de consentimiento informado antes del diagnóstico
- **Decreto 1377 de 2013**: Política de privacidad publicada en `/privacidad`
- **Anonimización**: Los benchmarks usan únicamente datos agregados
- **MVP local**: En esta versión, los datos NO salen del dispositivo del usuario

---

## Equipo

Proyecto académico UPB-SAPIENCIA 2026 – Reto Madurez Digital TIC Antioquia

---

*Construido con herramientas 100% gratuitas para el ecosistema TIC de Antioquia.*
