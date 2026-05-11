import type { DimensionInfo, Pregunta } from '@/types';

export const DIMENSIONES: DimensionInfo[] = [
  {
    id: 'estrategia',
    nombre: 'Estrategia Digital',
    descripcion: 'Visión, liderazgo y planificación para la transformación digital',
    color: '#6366f1',
    peso: 0.25,
    icono: '🎯',
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología e Infraestructura',
    descripcion: 'Adopción, integración y seguridad de herramientas tecnológicas',
    color: '#0ea5e9',
    peso: 0.20,
    icono: '⚙️',
  },
  {
    id: 'datos',
    nombre: 'Datos y Analítica',
    descripcion: 'Recopilación, gobernanza y uso de datos para la toma de decisiones',
    color: '#10b981',
    peso: 0.20,
    icono: '📊',
  },
  {
    id: 'talento',
    nombre: 'Talento y Cultura Digital',
    descripcion: 'Competencias, formación y cultura organizacional orientada a lo digital',
    color: '#f59e0b',
    peso: 0.20,
    icono: '👥',
  },
  {
    id: 'cliente',
    nombre: 'Experiencia del Cliente Digital',
    descripcion: 'Canales digitales, personalización y satisfacción del cliente',
    color: '#ef4444',
    peso: 0.15,
    icono: '💡',
  },
];

export const OPCIONES = [
  { valor: 0, texto: 'Nunca / No existe' },
  { valor: 1, texto: 'Ocasionalmente / En etapa inicial' },
  { valor: 2, texto: 'A veces / Parcialmente implementado' },
  { valor: 3, texto: 'Frecuentemente / Bien implementado' },
  { valor: 4, texto: 'Siempre / Optimizado y medido' },
];

export const PREGUNTAS: Pregunta[] = [
  // ESTRATEGIA DIGITAL
  { id: 'e1', dimensionId: 'estrategia', texto: '¿La empresa cuenta con una estrategia digital documentada y comunicada a todos los niveles?' },
  { id: 'e2', dimensionId: 'estrategia', texto: '¿La alta dirección lidera y patrocina activamente las iniciativas de transformación digital?' },
  { id: 'e3', dimensionId: 'estrategia', texto: '¿Existen KPIs definidos para medir el avance y éxito de la estrategia digital?' },
  { id: 'e4', dimensionId: 'estrategia', texto: '¿Se destina un presupuesto específico y planificado para iniciativas de transformación digital?' },
  { id: 'e5', dimensionId: 'estrategia', texto: '¿La empresa monitorea activamente las tendencias tecnológicas y digitales de su sector?' },
  { id: 'e6', dimensionId: 'estrategia', texto: '¿Existe un roadmap de transformación digital con metas a 1–3 años vigente?' },

  // TECNOLOGÍA E INFRAESTRUCTURA
  { id: 't1', dimensionId: 'tecnologia', texto: '¿La empresa utiliza herramientas colaborativas en la nube (Google Workspace, Microsoft 365, etc.)?' },
  { id: 't2', dimensionId: 'tecnologia', texto: '¿Los sistemas internos (ERP, CRM, etc.) están integrados entre sí de forma automatizada?' },
  { id: 't3', dimensionId: 'tecnologia', texto: '¿Existe una política de ciberseguridad activa con protocolos y controles definidos?' },
  { id: 't4', dimensionId: 'tecnologia', texto: '¿Se realizan backups automáticos y se tiene un plan de recuperación ante desastres probado?' },
  { id: 't5', dimensionId: 'tecnologia', texto: '¿La infraestructura tecnológica es escalable y puede adaptarse al crecimiento del negocio?' },
  { id: 't6', dimensionId: 'tecnologia', texto: '¿Se utilizan APIs para conectar sistemas internos con servicios y socios externos?' },

  // DATOS Y ANALÍTICA
  { id: 'd1', dimensionId: 'datos', texto: '¿La empresa recopila sistemáticamente datos de operaciones, clientes y mercado?' },
  { id: 'd2', dimensionId: 'datos', texto: '¿Se utilizan dashboards o reportes visuales actualizados para apoyar la toma de decisiones?' },
  { id: 'd3', dimensionId: 'datos', texto: '¿Existe una política o proceso formal de gestión, calidad y gobernanza de datos?' },
  { id: 'd4', dimensionId: 'datos', texto: '¿Se aplican análisis estadísticos, predictivos o modelos de IA en la operación del negocio?' },
  { id: 'd5', dimensionId: 'datos', texto: '¿Los datos están centralizados en una fuente única y confiable (Data Warehouse o similar)?' },
  { id: 'd6', dimensionId: 'datos', texto: '¿Se realizan experimentos basados en datos (A/B testing, pruebas de hipótesis) para mejorar procesos?' },

  // TALENTO Y CULTURA DIGITAL
  { id: 'ta1', dimensionId: 'talento', texto: '¿El equipo de trabajo cuenta con las competencias digitales básicas necesarias para su rol?' },
  { id: 'ta2', dimensionId: 'talento', texto: '¿Existe un programa formal de formación continua en habilidades digitales para todos los niveles?' },
  { id: 'ta3', dimensionId: 'talento', texto: '¿La cultura organizacional promueve y adopta abiertamente el cambio y la experimentación digital?' },
  { id: 'ta4', dimensionId: 'talento', texto: '¿Se fomenta activamente la innovación interna y se reconoce el aprendizaje del error?' },
  { id: 'ta5', dimensionId: 'talento', texto: '¿La empresa tiene roles digitales claramente definidos (analistas, desarrolladores, CDO/CTO)?' },
  { id: 'ta6', dimensionId: 'talento', texto: '¿Se mide y gestiona la adopción digital de herramientas y procesos por parte del equipo?' },

  // EXPERIENCIA DEL CLIENTE DIGITAL
  { id: 'c1', dimensionId: 'cliente', texto: '¿La empresa ofrece canales digitales de atención al cliente (chat, app, correo, redes sociales)?' },
  { id: 'c2', dimensionId: 'cliente', texto: '¿Existe una presencia digital activa y estratégica en plataformas relevantes para el negocio?' },
  { id: 'c3', dimensionId: 'cliente', texto: '¿Se recopila y analiza el feedback digital de los clientes de manera sistemática?' },
  { id: 'c4', dimensionId: 'cliente', texto: '¿Los procesos de venta, postventa o prestación de servicios están totalmente digitalizados?' },
  { id: 'c5', dimensionId: 'cliente', texto: '¿La empresa personaliza la experiencia digital del cliente usando datos de comportamiento?' },
  { id: 'c6', dimensionId: 'cliente', texto: '¿Se mide regularmente la satisfacción digital del cliente (NPS, CSAT, tasa de resolución)?' },
];

export const SECTORES = [
  { valor: 'desarrollo_software', etiqueta: 'Desarrollo de Software' },
  { valor: 'consultoria_ti', etiqueta: 'Consultoría TI' },
  { valor: 'infraestructura_redes', etiqueta: 'Infraestructura y Redes' },
  { valor: 'marketing_digital', etiqueta: 'Marketing Digital' },
  { valor: 'ecommerce', etiqueta: 'E-commerce / Comercio Digital' },
  { valor: 'fintech', etiqueta: 'Fintech / Servicios Financieros Digitales' },
  { valor: 'edtech', etiqueta: 'Edtech / Educación Digital' },
  { valor: 'otro', etiqueta: 'Otro sector TIC' },
];

export const TAMANIOS = [
  { valor: 'micro', etiqueta: 'Microempresa (1–10 empleados)' },
  { valor: 'pequena', etiqueta: 'Pequeña empresa (11–50 empleados)' },
  { valor: 'mediana', etiqueta: 'Mediana empresa (51–200 empleados)' },
  { valor: 'grande', etiqueta: 'Grande (más de 200 empleados)' },
];
