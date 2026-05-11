import type { RecomendacionItem, ResultadoDimension } from '@/types';

type Regla = Omit<RecomendacionItem, 'id' | 'dimensionNombre'>;

const REGLAS: Record<string, Regla[]> = {
  estrategia: [
    {
      dimensionId: 'estrategia',
      prioridad: 'alta',
      titulo: 'Crear y documentar la estrategia digital de la empresa',
      descripcion: 'Organice un taller de medio día con la alta dirección para definir 3–5 objetivos digitales concretos para los próximos 12 meses. Use el Canvas de Transformación Digital del Ministerio TIC como guía. Documente el resultado y compártalo con todo el equipo en los primeros 30 días.',
      impacto: 'alto', esfuerzo: 'medio',
      recursos: ['Canvas Transformación Digital – MinTIC Colombia', 'Guía MIPYMES Digitales – iNNpulsa', 'Plantilla Roadmap Digital (Notion / Google Sheets)'],
      plazo: 'Semanas 1–4',
    },
    {
      dimensionId: 'estrategia',
      prioridad: 'alta',
      titulo: 'Definir KPIs digitales y tablero de control',
      descripcion: 'Identifique 5–8 indicadores clave (tasa de digitalización de procesos, ingresos digitales, NPS digital, etc.) y configure un dashboard semanal en Google Data Studio o Power BI Free. Revíselo en reuniones quincenales con el equipo directivo.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Google Looker Studio (gratis)', 'Power BI Desktop (gratis)', 'Plantilla KPIs Transformación Digital'],
      plazo: 'Semanas 5–8',
    },
    {
      dimensionId: 'estrategia',
      prioridad: 'media',
      titulo: 'Asignar presupuesto digital específico',
      descripcion: 'Reserve entre el 3% y el 8% del presupuesto operativo anual para iniciativas digitales. Cree una línea presupuestal separada que permita controlar el ROI de cada inversión tecnológica. Evalúe el impacto trimestralmente.',
      impacto: 'alto', esfuerzo: 'medio',
      recursos: ['Guía de Inversión TIC para PYMES – Gartner SMB', 'Herramienta de ROI Digital – McKinsey (free)'],
      plazo: 'Semanas 9–12',
    },
  ],
  tecnologia: [
    {
      dimensionId: 'tecnologia',
      prioridad: 'alta',
      titulo: 'Adoptar herramientas de colaboración en la nube',
      descripcion: 'Migre la comunicación y gestión de proyectos a una suite en la nube. Google Workspace (plan gratuito o $6/usuario/mes) o Microsoft 365 Business Basic ($6/usuario/mes) son las opciones más accesibles. Capacite a todo el equipo en un taller de 2 horas durante la primera semana.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Google Workspace (plan gratuito con correo personalizado)', 'Microsoft 365 Business Basic', 'Trello / Asana (gratis hasta 10 usuarios)'],
      plazo: 'Semanas 1–2',
    },
    {
      dimensionId: 'tecnologia',
      prioridad: 'alta',
      titulo: 'Implementar política básica de ciberseguridad',
      descripcion: 'Adopte las medidas de seguridad básicas: autenticación en dos factores (2FA) para todos los sistemas críticos, política de contraseñas fuertes, y capacitación mensual en phishing. Documente el protocolo y nómibre a un responsable de seguridad digital.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Guía Ciberseguridad para PYMES – INCIBE España', 'Google Workspace Security (incluido)', 'KeePass / Bitwarden (gestores de contraseñas gratuitos)'],
      plazo: 'Semanas 3–6',
    },
    {
      dimensionId: 'tecnologia',
      prioridad: 'media',
      titulo: 'Configurar backups automáticos y plan de recuperación',
      descripcion: 'Implemente la regla 3-2-1: 3 copias de los datos, en 2 formatos diferentes, 1 fuera del sitio. Use Google Drive o OneDrive para respaldos automáticos de documentos críticos. Programe y documente una prueba de recuperación cada trimestre.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Google Drive (15 GB gratis)', 'Backblaze B2 (primer 10 GB gratis)', 'Guía 3-2-1 Backup Strategy'],
      plazo: 'Semanas 4–6',
    },
  ],
  datos: [
    {
      dimensionId: 'datos',
      prioridad: 'alta',
      titulo: 'Centralizar datos operativos en una fuente única',
      descripcion: 'Identifique las 3–5 fuentes de datos más críticas del negocio (ventas, clientes, operaciones) y establezca un proceso de consolidación semanal. Use Google Sheets o Airtable como base inicial antes de invertir en un Data Warehouse. El objetivo es eliminar los silos de información y tener una versión única de la verdad.',
      impacto: 'alto', esfuerzo: 'medio',
      recursos: ['Airtable (plan gratis hasta 1.000 registros)', 'Google Sheets + AppScript', 'Metabase Community (gratis, auto-hospedado)'],
      plazo: 'Semanas 1–4',
    },
    {
      dimensionId: 'datos',
      prioridad: 'alta',
      titulo: 'Crear un dashboard de métricas del negocio',
      descripcion: 'Defina las 8–10 métricas clave del negocio y construya un tablero de control visual en Google Looker Studio o Metabase. Compártalo con el equipo directivo y establezca una revisión semanal de 15 minutos para analizar tendencias y tomar decisiones basadas en datos.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Google Looker Studio (gratis)', 'Metabase (gratis open source)', 'Apache Superset (gratis open source)'],
      plazo: 'Semanas 3–6',
    },
    {
      dimensionId: 'datos',
      prioridad: 'media',
      titulo: 'Documentar política de gestión de datos y privacidad',
      descripcion: 'Cree un documento de política de datos que cubra: qué datos recopila, cómo los protege, cuánto tiempo los conserva, y cómo los procesa. Esta política es obligatoria bajo la Ley 1581 de 2012 (Habeas Data Colombia). Publíquela en su sitio web y capacite al equipo en sus responsabilidades.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Ley 1581 de 2012 – SIC Colombia', 'Modelo de Política de Datos – SIC', 'Plantilla Aviso de Privacidad PYME'],
      plazo: 'Semanas 1–3',
    },
  ],
  talento: [
    {
      dimensionId: 'talento',
      prioridad: 'alta',
      titulo: 'Evaluar y mapear competencias digitales del equipo',
      descripcion: 'Aplique una evaluación de competencias digitales a todos los colaboradores usando el marco DigComp 2.2 de la Unión Europea (adaptado para Colombia). Identifique las brechas más críticas y diseñe un plan de formación personalizado por área. Comparta los resultados con cada persona de forma individual.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Marco DigComp 2.2 (gratis, EU)', 'Test Digital Skills – Google Actívate', 'Evaluación de Competencias Digitales – MinTIC'],
      plazo: 'Semanas 1–2',
    },
    {
      dimensionId: 'talento',
      prioridad: 'alta',
      titulo: 'Implementar plan de capacitación digital continua',
      descripcion: 'Asigne al menos 4 horas mensuales por persona para formación digital, usando plataformas gratuitas. Cree un grupo de aprendizaje interno donde los colaboradores compartan lo aprendido. Reconozca públicamente los logros de certificación dentro del equipo para fomentar la cultura de aprendizaje.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Google Actívate (cursos gratuitos certificados)', 'Coursera for Teams (auditoría gratis)', 'LinkedIn Learning (primeros 30 días gratis)', 'EDX.org (muchos cursos gratuitos)'],
      plazo: 'Semanas 3–8',
    },
    {
      dimensionId: 'talento',
      prioridad: 'media',
      titulo: 'Definir roles digitales y responsabilidades claras',
      descripcion: 'Revise el organigrama y defina responsabilidades digitales explícitas en cada cargo. Considere crear el rol de "Líder de Transformación Digital" (puede ser part-time) para coordinar iniciativas. Documente las responsabilidades en las descripciones de cargo y evalúelas en las revisiones de desempeño.',
      impacto: 'medio', esfuerzo: 'bajo',
      recursos: ['Marco de Roles Digitales – DESI Colombia', 'Plantilla Descripción de Cargos Digitales'],
      plazo: 'Semanas 5–8',
    },
  ],
  cliente: [
    {
      dimensionId: 'cliente',
      prioridad: 'alta',
      titulo: 'Implementar canales digitales de atención al cliente',
      descripcion: 'Active al menos 2 canales digitales de atención: WhatsApp Business (gratuito) para comunicación directa y un chatbot básico con Tidio o Crisp (plan gratis) para su sitio web. Defina horarios de atención y tiempos de respuesta máximos. Mida mensualmente la tasa de resolución en primer contacto.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['WhatsApp Business (gratuito)', 'Tidio – chat en vivo + chatbot (gratis)', 'Crisp.chat (plan gratis)', 'HubSpot CRM (gratis)'],
      plazo: 'Semanas 1–3',
    },
    {
      dimensionId: 'cliente',
      prioridad: 'alta',
      titulo: 'Recopilar y analizar feedback digital del cliente',
      descripcion: 'Implemente encuestas de satisfacción post-servicio usando Google Forms o Typeform (plan gratuito). Mida el NPS (Net Promoter Score) mensualmente con una pregunta simple. Analice los resultados en equipo cada mes y defina al menos una acción de mejora por ciclo.',
      impacto: 'alto', esfuerzo: 'bajo',
      recursos: ['Google Forms (gratis)', 'Typeform (plan gratuito hasta 10 respuestas/mes)', 'SurveyMonkey (plan gratis)', 'Calculadora NPS gratuita – Hotjar'],
      plazo: 'Semanas 2–4',
    },
    {
      dimensionId: 'cliente',
      prioridad: 'media',
      titulo: 'Digitalizar el proceso de ventas y postventa',
      descripcion: 'Adopte un CRM gratuito para gestionar el pipeline de ventas y el historial de clientes. Configure un proceso estandarizado de seguimiento digital que incluya: cotización electrónica, confirmación por email, y encuesta de satisfacción automática post-venta. Esto elimina el seguimiento manual y mejora la tasa de cierre.',
      impacto: 'alto', esfuerzo: 'medio',
      recursos: ['HubSpot CRM (gratis para siempre)', 'Zoho CRM Free (hasta 3 usuarios)', 'Pipedrive (14 días gratis)', 'Notion CRM Template (gratis)'],
      plazo: 'Semanas 5–10',
    },
  ],
};

export function generarRecomendaciones(resultados: ResultadoDimension[]): RecomendacionItem[] {
  const recomendaciones: RecomendacionItem[] = [];
  let idCounter = 1;

  // Sort dimensions by score (worst first for priority)
  const ordenadas = [...resultados].sort((a, b) => a.puntaje - b.puntaje);

  for (const dim of ordenadas) {
    const reglasDim = REGLAS[dim.dimensionId] ?? [];

    // Select recommendations based on score level
    let reglasSeleccionadas: Regla[];
    if (dim.puntaje <= 40) {
      reglasSeleccionadas = reglasDim; // all 3
    } else if (dim.puntaje <= 65) {
      reglasSeleccionadas = reglasDim.slice(1); // medium + advanced
    } else {
      reglasSeleccionadas = reglasDim.slice(2); // only advanced
    }

    for (const regla of reglasSeleccionadas) {
      // Adjust priority: lowest-scoring dimensions get 'alta' priority
      const prioridad = dim.puntaje <= 30 ? 'alta' : dim.puntaje <= 55 ? 'media' : 'baja';
      recomendaciones.push({
        ...regla,
        id: `rec_${idCounter++}`,
        dimensionNombre: dim.nombre,
        prioridad,
      });
    }
  }

  return recomendaciones;
}
