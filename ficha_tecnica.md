# Ficha Técnica – DiagnosticoTIC
## Herramienta de Diagnóstico de Madurez Digital para PYMES TIC en Antioquia

**Proyecto académico UPB-SAPIENCIA 2026**  
**Versión:** MVP 1.1 – Mayo 2026

---

## De dónde viene esta herramienta y por qué la construimos así

Cuando empezamos a diseñar DiagnosticoTIC, lo primero que hicimos fue revisar qué herramientas de diagnóstico digital ya existían. Encontramos varias: la herramienta PYME Digital de Red.es en España, el índice DESI de la Unión Europea, los marcos de Gartner y McKinsey para madurez digital empresarial, y las guías del MinTIC Colombia. Todas son buenas, pero ninguna estaba pensada específicamente para una empresa TIC pequeña en Antioquia que no tiene ni un área de IT formal ni un consultor disponible.

Eso fue lo que nos definió el camino. No queríamos replicar una herramienta que ya existe, sino tomar lo que está probado metodológicamente y adaptarlo a la realidad concreta que describía el reto: empresas de entre 5 y 50 personas, del ecosistema TIC local, que necesitan un diagnóstico rápido y que les diga algo útil sin requerir conocimiento técnico avanzado para interpretarlo.

---

## Análisis comparativo con herramientas existentes

Antes de hablar de lo que hace DiagnosticoTIC, vale la pena ser explícitos sobre el paisaje de herramientas con las que convive. Hay soluciones muy buenas en el mundo, pero al mirarlas de cerca aparecen brechas concretas que justifican por qué construimos algo propio.

### Las herramientas de las grandes firmas globales

**McKinsey Digital Quotient (DQ)** es probablemente la metodología de diagnóstico de madurez digital más citada en la literatura académica y empresarial. Evalúa cuatro dimensiones —estrategia, cultura, organización y capacidades— y tiene respaldo empírico con datos de miles de empresas. El problema es que no existe como herramienta pública: aplicarla requiere contratar a McKinsey, lo que la pone fuera del alcance de cualquier PYME. El costo de un engagement de este tipo oscila entre 50.000 y 500.000 dólares. Tomamos su marco conceptual como referencia, pero la democratizamos.

**Gartner Digital Business Maturity Assessment** ofrece una visión por capas que va desde la eficiencia operativa hasta la transformación del modelo de negocio. Es sólido y muy usado por CIOs de empresas grandes. Requiere suscripción a Gartner, que en su plan básico cuesta alrededor de 30.000 dólares anuales. Está completamente en inglés, orientado a grandes corporaciones, y no tiene ningún componente de contextualización regional o sectorial específica. Tampoco genera un plan de acción: entrega un mapa de posición y deja el resto al consultor.

**Deloitte Digital Maturity Index** es uno de los más completos en términos de dimensiones evaluadas: mide estrategia, cliente, tecnología, operaciones, cultura y ecosistema. Sus informes sectoriales son de acceso público, pero la herramienta de evaluación para empresas individuales es solo para clientes. El proceso implica talleres presenciales, entrevistas y semanas de análisis. Para una PYME de Antioquia, es inaccesible en tiempo y costo.

**Google Digital Maturity Framework (Think with Google)** merece mención especial porque es gratuito y está disponible en español. Sin embargo, su alcance es muy estrecho: mide exclusivamente madurez en marketing digital y uso de datos para publicidad. No evalúa tecnología interna, gestión de talento, estrategia corporativa ni experiencia del cliente más allá del funnel de conversión. Es una herramienta de marketing disfrazada de diagnóstico de madurez.

**IDC Digital Transformation MaturityScape** y **Forrester Digital Business Transformation Assessment** son herramientas de analyst firms que, al igual que Gartner, están detrás de suscripciones costosas y orientadas a planificación estratégica de empresas con cientos de empleados. Sus modelos son muy completos pero no tienen ninguna adaptación para el contexto latinoamericano ni colombiano.

### Las herramientas de referencia en español

**PYME Digital de Red.es (España)** es la referencia más cercana en idioma y enfoque. Es gratuita, está en español y está pensada para pequeñas empresas. La usamos como fuente de inspiración en el diseño de algunas preguntas. Sus limitaciones son claras: está desarrollada para el contexto regulatorio y de mercado español, no genera un plan de acción estructurado, no tiene benchmark comparativo dentro de la propia herramienta, no guarda historial de diagnósticos y no tiene ningún componente de inteligencia artificial. Tampoco está adaptada al ecosistema TIC colombiano ni cumple con la Ley 1581 de 2012.

**Las herramientas del MinTIC Colombia** (Sello de Excelencia, Guía de Transformación Digital para MIPYMES) son documentos de orientación más que herramientas de diagnóstico interactivo. Son valiosas como marco de política pública, pero no permiten a una empresa autoevaluarse, obtener un resultado comparativo ni generar un plan de acción inmediato. Son el punto de partida que nosotros intentamos convertir en experiencia de usuario.

**DESI (Digital Economy and Society Index)** de la Unión Europea mide madurez a nivel de países y regiones, no de empresas individuales. Es útil para contexto macro pero no responde la pregunta que le interesa a una empresa: "¿Cómo estoy yo respecto a mi competencia directa?".

### La brecha que encontramos

Al revisar todas estas herramientas, el patrón fue consistente: o son para grandes empresas con presupuesto, o son documentos estáticos sin experiencia digital, o están pensadas para otros mercados. Ninguna combina en un solo lugar los cinco elementos que identificamos como esenciales para una PYME TIC colombiana:

1. Diagnóstico interactivo y guiado, sin necesidad de consultor
2. Benchmark real contra empresas del mismo sector y tamaño en la región
3. Plan de acción concreto y priorizado, no solo un score
4. Seguimiento histórico para medir evolución
5. Cumplimiento legal con la normativa colombiana de datos

Esa combinación es lo que construimos.

### Tabla comparativa

| Característica | DiagnosticoTIC | McKinsey DQ | Gartner Maturity | PYME Digital (Red.es) | Google DMF |
|---|:---:|:---:|:---:|:---:|:---:|
| **Gratuita** | ✅ | ❌ | ❌ | ✅ | ✅ |
| **En español** | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Para PYMES** | ✅ | ❌ | ❌ | ✅ | Parcial |
| **Contexto Colombia/Antioquia** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Cumple Ley 1581** | ✅ | N/A | N/A | ❌ | ❌ |
| **Dashboard visual interactivo** | ✅ | ❌ | ❌ | Parcial | Parcial |
| **Benchmark sectorial** | ✅ | Interno | Suscripción | ❌ | ❌ |
| **Plan de acción 90 días** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Historial y comparador** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Análisis ejecutivo con IA** | ✅ | Con consultor | ❌ | ❌ | ❌ |
| **Sin registro para probar** | ✅ | ❌ | ❌ | Parcial | ✅ |
| **Exportar PDF con portada** | ✅ | Con consultor | ❌ | ❌ | ❌ |
| **5 dimensiones adaptadas** | ✅ | 4 dims | 5 dims | 6 dims | 1 dim |
| **Costo por empresa** | $0 | $50K–$500K USD | $30K USD/año | $0 | $0 |

---

## Las cinco dimensiones: por qué estas y no otras

La decisión de trabajar con cinco dimensiones no fue arbitraria. Al comparar los marcos de referencia más usados en diagnósticos de madurez digital, encontramos que casi todos coinciden en los mismos ejes, aunque les pongan nombres distintos.

**Estrategia Digital** aparece en el McKinsey Digital Maturity Assessment y en el modelo de Gartner como la columna vertebral de cualquier transformación real. Sin dirección estratégica, los demás avances son iniciativas aisladas que no se sostienen. Le dimos un peso del 25% porque, en la práctica, la diferencia entre una empresa que avanza digitalmente y una que no suele estar en si la dirección lo respalda o no.

**Tecnología e Infraestructura** la tomamos del marco CMMI (Capability Maturity Model Integration) y del ITIL Digital. Es la más tangible de las cinco: aquí hablamos de si la empresa usa herramientas en la nube, si tiene backups, si sus sistemas se hablan entre sí. Es la más fácil de medir y la que más rápidamente puede mejorar con inversiones pequeñas.

**Datos y Analítica** la sustentamos en el DAMA-DMBOK (el estándar internacional de gestión de datos) y en la visión de Gartner sobre data-driven organizations. Decidimos incluirla como dimensión independiente porque en el ecosistema TIC de Antioquia muchas empresas recopilan datos pero pocos los usan para tomar decisiones. Esa brecha nos pareció importante medir.

**Talento y Cultura Digital** viene del marco DigComp 2.2 de la Unión Europea, que es el estándar de referencia para competencias digitales y que el MinTIC Colombia ha adoptado parcialmente en sus programas de formación. También tiene respaldo en investigaciones del MIT Sloan sobre transformación digital, que muestran que el 70% de los fracasos en transformación son de cultura, no de tecnología.

**Experiencia del Cliente Digital** la incluimos porque en una empresa TIC el cliente es parte del producto. Aquí nos apoyamos en los estándares de medición de NPS y CSAT, y en la literatura de HBR sobre experiencia digital del cliente. Es la dimensión con menor peso (15%) porque en etapas tempranas de madurez suele ser consecuencia de las otras cuatro, no un punto de partida.

Los pesos que asignamos (25/20/20/20/15%) son una estimación razonada, no un resultado estadístico. Para una versión posterior sería ideal ajustarlos usando una encuesta Delphi con expertos del sector TIC en Antioquia.

---

## Las preguntas: qué las respalda y qué no

Hay que ser honestos aquí. Las 30 preguntas (6 por dimensión) las diseñamos para este contexto específico. No las copiamos de ningún instrumento validado, pero tampoco las inventamos de la nada. Cada una tiene un respaldo conceptual en los marcos que mencionamos arriba y responde a los dolores concretos que identificamos en los documentos del reto y en el mapa de empatía del usuario.

Por ejemplo, la pregunta sobre si la alta dirección lidera activamente las iniciativas digitales viene directamente de la literatura de McKinsey, que identifica el patrocinio ejecutivo como el predictor más fuerte de éxito en transformación digital. La pregunta sobre backups y recuperación ante desastres viene de las guías CMMI y de INCIBE España. Las preguntas sobre datos y dashboards vienen de los principios del DAMA-DMBOK.

Lo que estas preguntas no tienen todavía es validación estadística con empresas reales. Para que el instrumento sea robusto desde el punto de vista metodológico, el siguiente paso natural sería aplicarlo a un grupo de 20 o 30 empresas TIC de Antioquia, calcular el alfa de Cronbach por dimensión, y ajustar las preguntas que no discriminen bien. Eso sería la fase de validación del instrumento, prevista en el roadmap pero fuera del alcance de este MVP.

La escala de respuesta que usamos (de 0 a 4, desde "Nunca / No existe" hasta "Siempre / Optimizado y medido") es una escala Likert estándar, ampliamente usada en evaluaciones de madurez como el CMMI, los autodiagnósticos del MinTIC y la norma ISO/IEC 33000 de evaluación de procesos.

---

## El benchmark: lo que es real y lo que no

El benchmark es el componente más sensible de la herramienta y donde más transparentes queremos ser.

En la versión inicial, los datos de comparación que aparecen en el dashboard son datos simulados construidos a partir de rangos plausibles, apoyados en estudios generales sobre madurez digital de PYMES latinoamericanas (entre ellos el informe de digitalización de PYMES de la CEPAL de 2022 y el estudio de transformación digital del BID de 2023) y en la descripción del ecosistema que contiene la Ficha_Reto_07 del programa.

A medida que las empresas usan la herramienta, sus resultados anonimizados se acumulan en la base de datos y alimentan el benchmark real. La plataforma ya está preparada para este cambio: cuando un segmento sector-tamaño acumula tres o más diagnósticos, el sistema sustituye automáticamente los datos simulados por el promedio real y muestra un indicador visual que lo diferencia. El benchmark se vuelve más preciso con el uso, lo que crea un incentivo concreto para que más empresas participen.

Este modelo de benchmark colaborativo y anónimo, donde cada empresa que participa mejora el punto de comparación para todas las demás, no existe en ninguna de las herramientas gratuitas que revisamos. Es uno de los diferenciadores más sólidos de la plataforma a largo plazo.

---

## Las recomendaciones: motor de reglas e inteligencia artificial

El motor de recomendaciones opera en dos capas que se complementan.

La primera es un sistema de reglas deterministas: según el puntaje de cada dimensión, se activan recomendaciones específicas con recursos concretos, prioridad y plazo. Elegimos este enfoque porque es auditable —cualquier miembro del equipo puede revisar qué regla generó qué recomendación y por qué— y porque no depende de servicios externos, garantizando que funcione incluso sin conexión a la API de IA. Los contenidos los construimos revisando las guías del MinTIC Colombia para MIPYMES, las buenas prácticas de INCIBE España adaptadas al contexto colombiano, y los recursos gratuitos verificados disponibles para empresas sin presupuesto grande.

La segunda capa es un análisis ejecutivo generado con inteligencia artificial. Usando el modelo Mistral-7B a través de la API de HuggingFace, la herramienta produce un párrafo ejecutivo personalizado que contextualiza el diagnóstico en función del sector, tamaño y brechas específicas de cada empresa. Este párrafo no reemplaza las recomendaciones estructuradas sino que las enmarca: explica el significado del resultado en lenguaje natural, sin tablas ni listas.

Este componente de IA es, hasta donde hemos podido verificar, único entre las herramientas gratuitas de diagnóstico de madurez digital en español para el mercado latinoamericano. Las herramientas de las grandes firmas ofrecen análisis narrativo, pero producido por consultores humanos que cobran por ello.

La priorización por impacto y esfuerzo sigue la lógica de la matriz de Eisenhower aplicada a proyectos de transformación digital. Las dimensiones con menor puntaje reciben automáticamente mayor prioridad, lo que responde al hallazgo central de que los usuarios buscan saber qué mejorar primero, no solo dónde están.

---

## Seguimiento en el tiempo: el comparador histórico

Una de las limitaciones más importantes de prácticamente todas las herramientas de diagnóstico gratuitas es que producen una fotografía, no una película. Una empresa puede hacer el diagnóstico hoy, implementar mejoras durante seis meses, y cuando quiera saber cuánto avanzó no tiene forma de compararlo con el punto de partida más allá de recordar el número.

DiagnosticoTIC guarda el historial completo de todos los diagnósticos de cada empresa y permite seleccionar dos de ellos para una comparación directa: radar superpuesto de ambos momentos, delta por dimensión, y resumen automático de qué mejoró y qué retrocedió. Esta funcionalidad convierte la herramienta de un test puntual en un sistema de seguimiento de transformación digital, que es exactamente lo que necesita una empresa que quiere gestionar su evolución con datos propios.

---

## Lo que cumple con la Ley 1581 de 2012

Desde el diseño inicial incluimos los requisitos de Habeas Data que exige la regulación colombiana. El aviso de privacidad que aparece antes de completar el diagnóstico explica qué datos se recopilan, para qué se usan, dónde se almacenan y cómo el titular puede ejercer sus derechos. Los datos de cada usuario se almacenan en Supabase (PostgreSQL sobre AWS) con cifrado en tránsito (HTTPS/TLS) y en reposo, con políticas de seguridad a nivel de fila que garantizan que ningún usuario pueda acceder a los datos de otro.

Para el benchmark, solo se publican promedios de segmentos con tres o más empresas. Nunca datos individuales. El usuario puede eliminar cualquier diagnóstico individual desde el historial, y puede solicitar la eliminación completa de su cuenta y todos sus datos a través de un enlace de contacto directo en la página de perfil, con respuesta garantizada en máximo 15 días hábiles.

Esta implementación supera el estándar de cumplimiento de la mayoría de herramientas internacionales, que no contemplan la legislación colombiana y tampoco ofrecen mecanismos de eliminación de datos accesibles directamente desde la interfaz.

---

## Panel de administración y métricas del programa

La herramienta incluye un panel de administración de acceso restringido que agrega métricas de uso del programa: número total de diagnósticos realizados, empresas únicas participantes, distribución por nivel de madurez, promedio por dimensión, participación por sector y tamaño, y tendencia mensual. Todos estos datos son anónimos y agregados; el administrador no puede ver los resultados individuales de ninguna empresa.

Este panel es especialmente relevante para el programa UPB-SAPIENCIA porque permite hacer seguimiento al impacto del reto con datos en tiempo real, sin depender de encuestas posteriores ni de que las empresas reporten sus resultados manualmente.

---

## Limitaciones que reconocemos

No queremos presentar este trabajo como algo que no es. DiagnosticoTIC en su versión actual es un prototipo funcional con soporte metodológico razonado, no un instrumento clínicamente validado. Las principales limitaciones son:

El instrumento no ha pasado por validación estadística con una muestra real de empresas TIC en Antioquia. Los pesos de las dimensiones son estimados, no calculados empíricamente. El benchmark inicial usa datos simulados hasta que la base de usuarios sea suficiente. Las recomendaciones son buenas prácticas generales adaptadas al contexto, pero no reemplazan una consultoría especializada. El análisis de IA depende de la disponibilidad de la API de HuggingFace y puede tener variabilidad en la calidad del texto generado.

Lo que sí tenemos es una herramienta que funciona, que está basada en marcos reconocidos, que cumple con los requisitos legales colombianos, que incluye componentes que herramientas de costo muy superior no tienen, y que está diseñada para evolucionar con el uso. Para el alcance de este reto y esta fase del programa, eso es exactamente lo que se propuso construir.

---

## Referencias principales

- McKinsey Global Institute (2018). *Digital Strategy in a Time of Crisis*
- McKinsey & Company (2022). *The Digital Quotient: What separates digital leaders*
- Gartner (2022). *Digital Business Maturity Model*
- Deloitte Insights (2023). *Digital Maturity Index: Global Report*
- CMMI Institute (2018). *CMMI for Development, Version 2.0*
- DAMA International (2017). *DAMA-DMBOK: Data Management Body of Knowledge*, 2.ª edición
- Unión Europea / JRC (2022). *DigComp 2.2: The Digital Competence Framework for Citizens*
- CEPAL (2022). *Digitalización de las MIPYMES en América Latina*
- BID (2023). *Transformación Digital de las Empresas en América Latina*
- MinTIC Colombia (2021). *Guía de Transformación Digital para MIPYMES colombianas*
- Red.es / ONTSI (2021). *Herramienta de Autodiagnóstico PYME Digital* (España)
- INCIBE (2022). *Guía de Ciberseguridad para PYMES*
- Google (2022). *Digital Maturity Framework: Think with Google*
- IDC (2023). *Digital Transformation MaturityScape*
- ISO/IEC 33000:2015. *Information technology — Process assessment*
- Ley 1581 de 2012 y Decreto 1377 de 2013. República de Colombia

---

*Este documento forma parte de los entregables técnicos del Reto de Madurez Digital TIC – Programa UPB-SAPIENCIA 2026.*
