# Ficha Técnica – DiagnosticoTIC
## Herramienta de Diagnóstico de Madurez Digital para PYMES TIC en Antioquia

**Proyecto académico UPB-SAPIENCIA 2026**  
**Versión:** MVP 1.0 – Mayo 2026

---

## De dónde viene esta herramienta y por qué la construimos así

Cuando empezamos a diseñar DiagnosticoTIC, lo primero que hicimos fue revisar qué herramientas de diagnóstico digital ya existían. Encontramos varias: la herramienta PYME Digital de Red.es en España, el índice DESI de la Unión Europea, los marcos de Gartner y McKinsey para madurez digital empresarial, y las guías del MinTIC Colombia. Todas son buenas, pero ninguna estaba pensada específicamente para una empresa TIC pequeña en Antioquia que no tiene ni un área de IT formal ni un consultor disponible.

Eso fue lo que nos definió el camino. No queríamos replicar una herramienta que ya existe, sino tomar lo que está probado metodológicamente y adaptarlo a la realidad concreta que describía el reto: empresas de entre 5 y 50 personas, del ecosistema TIC local, que necesitan un diagnóstico rápido y que les diga algo útil sin requerir conocimiento técnico avanzado para interpretarlo.

---

## Las cinco dimensiones: por qué estas y no otras

La decisión de trabajar con cinco dimensiones no fue arbitraria. Al comparar los marcos de referencia más usados en diagnósticos de madurez digital, encontramos que casi todos coinciden en los mismos ejes, aunque les pongan nombres distintos.

**Estrategia Digital** aparece en el McKinsey Digital Maturity Assessment y en el modelo de Gartner como la columna vertebral de cualquier transformación real. Sin dirección estratégica, los demás avances son iniciativas aisladas que no se sostienen. Le dimos un peso del 25% porque, en la práctica, la diferencia entre una empresa que avanza digitalmente y una que no suele estar en si la dirección lo respalda o no.

**Tecnología e Infraestructura** la tomamos del marco CMMI (Capability Maturity Model Integration) y del ITIL Digital. Es la más tangible de las cinco: aquí hablamos de si la empresa usa herramientas en la nube, si tiene backups, si sus sistemas se hablan entre sí. Es la más fácil de medir y la que más rápidamente puede mejorar con inversiones pequeñas.

**Datos y Analítica** la sustentamos en el DAMA-DMBOK (el estándar internacional de gestión de datos) y en la visión de Gartner sobre data-driven organizations. Decidimos incluirla como dimensión independiente porque en el ecosistema TIC de Antioquia, según lo que describe la ficha del reto, muchas empresas recopilan datos pero pocos los usan para tomar decisiones. Esa brecha nos pareció importante medir.

**Talento y Cultura Digital** viene del marco DigComp 2.2 de la Unión Europea, que es el estándar de referencia para competencias digitales y que el MinTIC Colombia ha adoptado parcialmente en sus programas de formación. También tiene respaldo en investigaciones del MIT Sloan sobre transformación digital, que muestran que el 70% de los fracasos en transformación son de cultura, no de tecnología.

**Experiencia del Cliente Digital** la incluimos porque en una empresa TIC el cliente es parte del producto. Aquí nos apoyamos en los estándares de medición de NPS y CSAT, y en la literatura de HBR sobre experiencia digital del cliente. Es la dimensión con menor peso (15%) porque en etapas tempranas de madurez suele ser consecuencia de las otras cuatro, no un punto de partida.

Los pesos que asignamos (25/20/20/20/15%) son una estimación razonada, no un resultado estadístico. Para una versión posterior sería ideal ajustarlos usando una encuesta Delphi con expertos del sector TIC en Antioquia.

---

## Las preguntas: qué las respalda y qué no

Hay que ser honestos aquí. Las 30 preguntas (6 por dimensión) las diseñamos para este contexto específico. No las copiamos de ningún instrumento validado, pero tampoco las inventamos de la nada. Cada una tiene un respaldo conceptual en los marcos que mencionamos arriba y responde a los dolores concretos que identificamos en los documentos del reto y en el mapa de empatía del usuario.

Por ejemplo, la pregunta sobre si la alta dirección lidera activamente las iniciativas digitales viene directamente de la literatura de McKinsey, que identifica el patrocinio ejecutivo como el predictor más fuerte de éxito en transformación digital. La pregunta sobre backups y recuperación ante desastres viene de las guías CMMI y de INCIBE España. Las preguntas sobre datos y dashboards vienen de los principios del DAMA-DMBOK.

Lo que estas preguntas no tienen todavía es validación estadística con empresas reales. Para que el instrumento sea robusto desde el punto de vista metodológico, el siguiente paso natural sería aplicarlo a un grupo de 20 o 30 empresas TIC de Antioquia, calcular el alfa de Cronbach por dimensión (una medida de consistencia interna), y ajustar las preguntas que no discriminen bien. Eso sería la fase de validación del instrumento, que va más allá del alcance de este MVP pero está prevista en el roadmap.

La escala de respuesta que usamos (de 0 a 4, desde "Nunca / No existe" hasta "Siempre / Optimizado y medido") es una escala Likert estándar, ampliamente usada en evaluaciones de madurez como el CMMI, los autodiagnósticos del MinTIC y la norma ISO/IEC 33000 de evaluación de procesos.

---

## El benchmark: lo que es real y lo que no

El benchmark es el componente más sensible de la herramienta y donde más transparentes queremos ser.

Los datos de comparación que aparecen en el dashboard no vienen de encuestas reales a empresas TIC de Antioquia. Son datos simulados que construimos a partir de rangos plausibles, apoyados en estudios generales sobre madurez digital de PYMES latinoamericanas (entre ellos el informe de digitalización de PYMES de la CEPAL de 2022 y el estudio de transformación digital del BID de 2023) y en la descripción del ecosistema que contiene la Ficha_Reto_07 del programa.

Decidimos incluirlo de todas formas porque el benchmarking es uno de los tres diferenciadores más importantes que identificamos en el análisis de necesidades del usuario, y porque para un prototipo funcional los datos simulados permiten demostrar la funcionalidad sin necesidad de tener una base de datos real. Lo que sí dejamos muy claro en la interfaz es que se trata de datos de referencia basados en estimaciones del sector.

Para que el benchmark sea real y útil, la herramienta necesita que un grupo de empresas lo use, y esos resultados anonimizados se conviertan en el benchmark de la siguiente versión. Es un modelo de mejora continua: cuanto más se use, más preciso se vuelve el punto de comparación.

---

## Las recomendaciones: cómo se generan

El motor de recomendaciones no usa inteligencia artificial generativa. Es un sistema de reglas deterministas: según el puntaje de cada dimensión, se activan unas recomendaciones específicas con sus respectivos recursos.

Elegimos este enfoque por tres razones. Primero, porque es auditable: cualquier miembro del equipo puede revisar qué regla generó qué recomendación y por qué. Segundo, porque no depende de servicios de pago ni de conexión a APIs externas, lo que garantiza que funcione siempre. Tercero, porque para el contexto académico de este reto, una recomendación que puede respaldarse con una fuente concreta vale más que un texto generado automáticamente que suena bien pero no tiene raíz clara.

Los contenidos de cada recomendación los construimos revisando las guías de transformación digital del MinTIC Colombia para MIPYMES, las buenas prácticas de INCIBE España adaptadas al contexto colombiano, y los recursos gratuitos disponibles para empresas sin presupuesto grande: Google Workspace, HubSpot CRM, Google Looker Studio, Metabase, entre otros. Todos los recursos que aparecen en la herramienta son reales, gratuitos y verificamos que estuvieran activos al momento de incluirlos.

La priorización por impacto y esfuerzo (alta/media/baja) sigue la lógica de la matriz de Eisenhower aplicada a proyectos de transformación digital, y las dimensiones con menor puntaje reciben automáticamente mayor prioridad, lo que responde directamente al hallazgo de que los usuarios buscan saber qué mejorar primero, no solo dónde están.

---

## Lo que cumple con la Ley 1581 de 2012

Desde el diseño inicial incluimos los requisitos de Habeas Data que exige la regulación colombiana. El aviso de privacidad que aparece antes de que el usuario complete el diagnóstico explica qué datos se recopilan, para qué se usan, dónde se almacenan y cómo el titular puede ejercer sus derechos. En la versión actual, todos los datos se quedan en el dispositivo del usuario (localStorage del navegador), lo que minimiza el riesgo de manejo indebido. Para versiones futuras con almacenamiento en la nube, se requerirá una política de privacidad actualizada y el registro ante la Superintendencia de Industria y Comercio si se alcanzan los umbrales establecidos en la ley.

---

## Limitaciones que reconocemos

No queremos presentar este trabajo como algo que no es. DiagnosticoTIC en su versión actual es un prototipo funcional con soporte metodológico razonado, no un instrumento clínicamente validado. Las principales limitaciones son:

El instrumento no ha pasado por validación estadística con una muestra real de empresas TIC en Antioquia. Los pesos de las dimensiones son estimados, no calculados empíricamente. El benchmark usa datos simulados. Las recomendaciones son buenas prácticas generales adaptadas al contexto, pero no reemplazan una consultoría especializada.

Lo que sí tenemos es una herramienta que funciona, que está basada en marcos reconocidos, que cumple con los requisitos legales básicos, y que está diseñada para evolucionar con el uso. Para el alcance de este reto y esta fase del programa, eso es exactamente lo que se propuso construir.

---

## Referencias principales

- McKinsey Global Institute (2018). *Digital Strategy in a Time of Crisis*
- Gartner (2022). *Digital Business Maturity Model*
- CMMI Institute (2018). *CMMI for Development, Version 2.0*
- DAMA International (2017). *DAMA-DMBOK: Data Management Body of Knowledge*, 2.ª edición
- Unión Europea / JRC (2022). *DigComp 2.2: The Digital Competence Framework for Citizens*
- CEPAL (2022). *Digitalización de las MIPYMES en América Latina*
- BID (2023). *Transformación Digital de las Empresas en América Latina*
- MinTIC Colombia (2021). *Guía de Transformación Digital para MIPYMES colombianas*
- Red.es / ONTSI (2021). *Herramienta de Autodiagnóstico PYME Digital* (España)
- INCIBE (2022). *Guía de Ciberseguridad para PYMES*
- ISO/IEC 33000:2015. *Information technology — Process assessment*
- Ley 1581 de 2012 y Decreto 1377 de 2013. República de Colombia

---

*Este documento forma parte de los entregables técnicos del Reto de Madurez Digital TIC – Programa UPB-SAPIENCIA 2026.*
