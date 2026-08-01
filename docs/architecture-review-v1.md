# BREY Architecture Review v1.0

**Tipo de documento:** revisión técnica crítica — NO es un handbook, no añade especificación, no propone funcionalidad nueva.
**Objeto de revisión:** los seis documentos existentes, tratados como una única especificación:
Architecture Handbook · Motor BPS Handbook · Progression Engine Handbook · Body Composition System Handbook · BCS Design System Handbook · Engineering Handbook.
**Postura:** comité de revisión técnica intentando romper la especificación antes de aprobar el inicio del desarrollo — no intentando mejorarla.

---

## Resumen ejecutivo

Se encontraron **32 hallazgos**: 4 🔴 Crítico, 10 🟠 Alto, 12 🟡 Medio, 6 🟢 Bajo. Los dos más graves (AR-001, AR-005) son contradicciones verificables con cita exacta, no interpretaciones: el DTO "Veredicto de Recovery" tiene dos formas incompatibles especificadas por dos handbooks distintos, y la matriz de dependencias del Engineering Handbook contiene un ciclo que ninguno de los dos handbooks de dominio que resume realmente tiene. Ambos son consecuencia de la misma causa raíz: **Recovery Engine es una dependencia estructural de dos motores ya especificados en profundidad, pero no tiene handbook propio** — su contrato fue inventado dos veces, de forma independiente, por sus propios consumidores.

También se documentan explícitamente las áreas donde **no se encontraron problemas**, con su justificación — por instrucción directa de este encargo.

---

## 1. Consistencia del dominio

### AR-001 — 🔴 Crítico — Forma del DTO "Veredicto de Recovery" contradictoria entre dos handbooks
**Módulos afectados:** Motor BPS Handbook (02, 03, 05) · Progression Engine Handbook (03, 04)
**Descripción:** Motor BPS Handbook especifica el veredicto como `{si, tipo?: programada|reactiva, razon?}` (campo `si`, boolean; `tipo` opcional describe *cómo* se disparó la descarga). Progression Engine Handbook especifica el mismo concepto como `{procede: boolean, tipo: "normal"|"descarga", razon: string}` (campo `procede`, no `si`; `tipo` obligatorio y describe *si* hay descarga, un eje semántico distinto; `razon` obligatoria, no opcional).
**Evidencia exacta:**
- `motor-bps/modules/03-entradas/index.html:54` — `{si, tipo?: programada|reactiva, razon?}`
- `motor-bps/modules/05-maquina-estados/index.html:75` — uso real: `exigeDescarga.si`
- `progression-engine/modules/04-contrato-entradas/index.html:57` — `{procede: boolean, tipo: "normal"|"descarga", razon: string}`
**Consecuencia:** si se implementa literalmente, Motor BPS produce un objeto que Progression Engine no puede leer sin traducción — ni el nombre del campo booleano, ni los valores del enum `tipo`, ni la obligatoriedad de los campos coinciden.
**Probabilidad:** alta — ambas formas ya están "congeladas" en sus respectivos handbooks, citadas en ejemplos concretos, listas para que un implementador las copie literalmente.
**Impacto:** bloquea la integración entre los dos únicos motores especificados en profundidad hasta ahora.
**Posibles alternativas (sin decidir):** (a) unificar en la forma de Progression Engine Handbook, por ser la más reciente y explícita en tipado; (b) unificar en la de Motor BPS Handbook, por ser el handbook "orquestador" que en teoría define el contrato que sus consumidores deben seguir; (c) crear el Recovery Engine Handbook ahora y que ese documento, como dueño real del contrato, decida la forma canónica, dejando que los otros dos se actualicen para citarlo en vez de redefinirlo.

### AR-002 — 🟡 Medio — Terminología y color de las etiquetas de evidencia física divergen entre handbooks
**Módulos afectados:** Architecture Handbook (CSS + módulo 05 shallow de Progression Engine) · Progression Engine Handbook (CSS, todo el documento)
**Descripción:** ambos handbooks clasifican afirmaciones fisiológicas en 4 niveles, pero con nombres y colores distintos para el mismo concepto: "sólida" (Architecture, verde) vs. "fuerte" (PE, verde — coincide) es el único par consistente; "moderada" es **azul** en Architecture y **amarillo** en PE; "hipótesis" es **violeta** en Architecture y **rojo** en PE.
**Evidencia exacta:** `handbook/assets/css/main.css:470-473` vs. `progression-engine/assets/css/main.css:602-605`.
**Consecuencia:** un lector que aprende el código de color en un handbook lo aplicará mal en el otro — "rojo" en PE podría confundirse con su propio significado de error/destructivo en el mismo sistema de diseño.
**Probabilidad:** media — solo afecta a quien lea ambos documentos y confíe en el color sin releer la leyenda.
**Impacto:** confusión de lectura, no bloquea implementación (el texto de la etiqueta siempre acompaña al color en ambos documentos).
**Posibles alternativas:** (a) unificar el mapa de color en un único documento de tokens compartido entre todos los handbooks; (b) aceptar la divergencia y añadir una nota cruzada explícita en ambos documentos.

### AR-003 — 🟡 Medio — Ambigüedad del término "dependencia" entre BCS Handbook y BCS Design System Handbook
**Módulos afectados:** BCS Handbook (00, 01) · BCS Design System Handbook (03)
**Descripción:** BCS Handbook afirma "el BCS no depende de ningún otro handbook de BREY para funcionar — es deliberadamente standalone en v1.0" (dominio/datos). BCS Design System Handbook, en cambio, especifica que "el BCS vive dentro del App Shell privado ya construido (`AppShell.tsx`)" y hereda su contenedor, sidebar y tokens de marca — una dependencia técnica/de presentación real.
**Evidencia exacta:** `bcs/modules/00-introduccion/index.html` (sección "Relación con el resto de BREY") vs. `bcs-design/modules/03-sistema-layout/index.html` (callout "Heredado").
**Consecuencia:** ninguna funcional — ambas afirmaciones son ciertas en su propio eje (datos vs. presentación) — pero el término "sin dependencia" sin calificar puede leerse como una garantía más amplia de la que realmente es.
**Probabilidad:** baja de causar un bug; media de causar una mala decisión de alcance si alguien asume que el BCS puede desplegarse sin el Core Product.
**Impacto:** bajo.
**Posibles alternativas:** (a) calificar explícitamente "sin dependencia de datos/dominio" en el BCS Handbook; (b) dejarlo como está y confiar en que el lector infiera la distinción del contexto.

### AR-004 — 🟢 Bajo — Cuatro sistemas de etiquetas distintos sin un documento que los unifique
**Módulos afectados:** los seis handbooks (cada uno introdujo su propio sistema: `.ev--*` evidencia física, `.eb--*` evidencia física v2, `.prov--*` procedencia de dato, `.tag--*` estado de implementación)
**Descripción:** cada handbook resolvió el mismo problema general (clasificar una afirmación en 3-5 niveles con color) de forma independiente, sin reutilizar el sistema de un handbook anterior aunque el problema fuera conceptualmente el mismo.
**Consecuencia:** ninguna funcional — cada sistema es internamente consistente y mide algo distinto (evidencia científica vs. procedencia de dato vs. estado de implementación) — es una observación de deuda de diseño documental, no un error.
**Probabilidad / Impacto:** bajo en ambos ejes.
**Posibles alternativas:** (a) aceptar la fragmentación como reflejo honesto de que cada handbook mide un eje distinto; (b) crear un "Documentation Design System" que unifique los cuatro en un vocabulario visual común para todos los handbooks futuros.

**✅ Verificado sin problema:** la distinción `profiles.nivel_actual` (asignado por Diagnóstico/Motor BPS, acoplado a un Sistema) vs. `profiles.nivel_experiencia` (autorreportado, sin uso algorítmico) se mantiene idéntica y correctamente citada en los seis documentos, siempre con referencia a ADR-003 del Architecture Handbook. Es el concepto con mayor riesgo de confusión de todo el ecosistema y es, precisamente, el que está mejor blindado.

---

## 2. Dependencias

### AR-005 — 🔴 Crítico — Ciclo de dependencia falso entre Motor BPS y Progression Engine
**Módulos afectados:** Engineering Handbook (02) — contradice a Motor BPS Handbook y Progression Engine Handbook, que SÍ son consistentes entre sí.
**Descripción:** la "Matriz Módulo → Dependencias" del Engineering Handbook declara simultáneamente "Motor BPS depende de: ... Progression Engine ..." y "Progression Engine depende de: Motor BPS (orquestación) ...". Es un ciclo A→B→A. Verificado contra los dos handbooks de dominio originales: **ambos son consistentes entre sí** en que la relación es unidireccional — Motor BPS invoca a Progression Engine como una función pura ("El Progression Engine como función pura invocada por el Motor BPS"; PE nunca inicia una llamada hacia MB). El error es haber conflado "A depende del contrato de B" (cierto: MB depende de la Decisión que PE produce) con "A es invocado por B" (cierto en la dirección opuesta: PE es invocado por MB) en la misma matriz.
**Evidencia exacta:**
- `engineering/modules/02-arquitectura-general/index.html:71-72` — el ciclo
- `progression-engine/modules/02-arquitectura/index.html:23` — "El Progression Engine como función pura invocada por el Motor BPS"
- `motor-bps/modules/00-introduccion/index.html:80` — `MB -->|"2º consulta"| PE`
**Consecuencia:** un lector que solo consulte el Engineering Handbook (el documento pensado como resumen transversal) se lleva un modelo mental incorrecto de la arquitectura — viola directamente FT-13 (Separación de responsabilidades / "una capa, una decisión") que el propio Engineering Handbook declara como principio de prioridad 2.
**Probabilidad:** alta — es la matriz que cualquier desarrollador nuevo consultaría primero para entender el grafo de dependencias.
**Impacto:** alto en comprensión arquitectónica, bajo en bloqueo de implementación (los handbooks de dominio, correctos, seguirían gobernando si se consultan directamente).
**Posibles alternativas:** (a) corregir la fila de Progression Engine a "es invocado por Motor BPS" en vez de "depende de"; (b) separar la matriz en dos columnas distintas ("depende de" vs. "es invocado por") para no perder la distinción en ningún módulo futuro.

### AR-006 — 🔴 Crítico — Recovery Engine es una dependencia estructural sin handbook propio
**Módulos afectados:** Motor BPS Handbook (03, 08) · Progression Engine Handbook (00, 02, 03, 04, 10) · Engineering Handbook (00, 02, 07)
**Descripción:** dos handbooks de motor ya completamente especificados dependen de un tercer motor (Recovery Engine) para su entrada más crítica en la escalera de precedencia (nivel 1, "seguridad antes que progreso" en ambos documentos) — pero Recovery Engine no tiene su propio handbook. Su contrato fue definido, de forma independiente y divergente, por cada uno de sus dos consumidores (ver AR-001, consecuencia directa de este hallazgo).
**Evidencia exacta:** `find docs -maxdepth 1 -iname "*recovery*"` no devuelve ningún directorio; ambos handbooks de motor citan "Recovery Engine Handbook (pendiente)" en sus propios diagramas de relación (`progression-engine/modules/00-introduccion/index.html:90`).
**Consecuencia:** la inversión de propiedad de contrato (el consumidor define el contrato del productor) es la causa raíz de AR-001 y se repetirá con cualquier tercer motor futuro que también consuma el veredicto de Recovery si no se resuelve antes.
**Probabilidad:** certeza — ya ocurrió una vez (AR-001).
**Impacto:** alto — bloquea la implementación coherente de cualquier motor que dependa de Recovery.
**Posibles alternativas:** (a) escribir el Recovery Engine Handbook antes de tocar código de Motor BPS o Progression Engine, dejando que ese documento fije la forma canónica del veredicto y actualizando los otros dos para citarlo; (b) fijar la forma del veredicto como un ADR transversal en el Engineering Handbook mientras no exista el handbook completo, como parche temporal.

### AR-007 — 🟡 Medio — Acoplamiento no declarado entre BCS y el sistema de diseño de marca real
**Módulos afectados:** BCS Design System Handbook (00, 03, 05, 06) — no reflejado en ninguna matriz de dependencias formal del Engineering Handbook (02)
**Descripción:** el BCS Design System Handbook depende explícitamente de 18 componentes reales de `src/components/brand/` y de tokens de `globals.css` — una dependencia técnica real y fuerte — pero la matriz "Módulo → Dependencias" del Engineering Handbook (02) no incluye "BCS Design System" como fila, y por tanto esta dependencia no aparece en el grafo formal de dependencias del ecosistema.
**Evidencia exacta:** `engineering/modules/02-arquitectura-general/index.html` (la matriz solo lista Core Product, Diagnóstico BPS, Motor BPS, Progression Engine, BCS — no BCS Design System) vs. `bcs-design/modules/00-introduccion/index.html` (hallazgo de partida, cita expresa de los 18 componentes).
**Consecuencia:** un cambio futuro en `src/components/brand/` no aparece como "riesgo de impacto" en ninguna matriz formal del Engineering Handbook.
**Probabilidad:** media. **Impacto:** medio.
**Posibles alternativas:** (a) añadir una fila para BCS Design System en la matriz de 02; (b) tratar los handbooks de diseño como una categoría aparte del grafo de dependencias de dominio, documentada en su propia matriz.
**Nota de corrección (Sprint 0):** verificado contra el archivo real — la fila "BCS Design System" ya existe en `engineering/modules/02-arquitectura-general/index.html` (línea 74 al momento de esta nota). La evidencia citada arriba no coincide con el estado actual del archivo; no hay forma de determinar si el archivo se corrigió después de escrita esta revisión o si la evidencia fue inexacta desde el origen. El hallazgo se marca **resuelto en la práctica** — no se reescribe el análisis original para preservar el registro histórico de la revisión.

**✅ Verificado sin problema:** no se detectaron ciclos dentro del grafo interno de ningún handbook individual (los tres agregados del BCS, el catálogo de 39 reglas de PE, las 15 transiciones de Motor BPS) — cada uno fue auditado por herramienta en su propia construcción sin hallar dependencias circulares internas.

---

## 3. Reglas

### AR-008 — 🟠 Alto — PE-012 usa un criterio de desempate ("menor magnitud de cambio") sin definición operacional entre unidades heterogéneas
**Módulos afectados:** Progression Engine Handbook (05, 07, 19)
**Descripción:** cuando compiten PE-001 (sube carga, en kg) y PE-002 (sube repeticiones, en unidades), la regla dice que gana "la de menor magnitud" — pero 1 repetición y 2.5 kg no son comparables en la misma escala. El propio handbook ya lo reconoce como pregunta abierta (19) — pero PE-012 se cita en ejemplos como si estuviera resuelta (07, ejemplo válido: "PE-002 gana por menor magnitud" sin explicar cómo se comparó la magnitud).
**Evidencia exacta:** `progression-engine/modules/07-reglas-negocio/index.html` (PE-012, ejemplo válido) vs. `progression-engine/modules/19-preguntas/index.html` (pregunta abierta sobre "más conservador").
**Consecuencia:** dos implementaciones independientes de PE-012 pueden desempatar distinto ante el mismo caso, produciendo decisiones no deterministas entre versiones — viola FT-03 (Determinismo) del Engineering Handbook a nivel de implementación, aunque el diseño en sí sea determinista en intención.
**Probabilidad:** alta si se implementa sin resolver la pregunta abierta primero.
**Impacto:** alto — PE-012 es el árbitro de conflictos de todo el subsistema de microprogresión.
**Posibles alternativas:** (a) definir "conservador" como el incremento porcentual relativo a la escala habitual de cada variable; (b) definir un orden de prioridad fijo por variable (ej. reps siempre antes que carga) en vez de comparar magnitudes.

### AR-009 — 🟠 Alto — PE-016 asume un mecanismo de aplicación en Motor BPS que no está formalizado (ver AR-014)
**Módulos afectados:** Progression Engine Handbook (07) · Motor BPS Handbook (04, 05)
Ver evidencia completa en AR-014 (categoría Estados) — se referencia aquí porque el origen del problema es una regla (PE-016) cuya postcondición depende de una pieza no especificada en el handbook consumidor.

### AR-010 — 🟢 Bajo — PE-018 es una regla sin productor ni consumidor funcional
**Módulos afectados:** Progression Engine Handbook (07)
**Descripción:** PE-018 ("Exclusión explícita de Track y Sistema") declara explícitamente "Entradas: N/A", "Salida: Ninguna — ausencia deliberada de salida". Es una regla válida como documentación de frontera, pero no encaja en el mismo molde funcional (con entrada→salida→consumidor) que las otras 38 reglas del catálogo, y las matrices Input→Regla/Regla→Salida (07) no tienen una fila real para ella más allá de la nota textual.
**Consecuencia:** ninguna funcional — es una observación de categorización.
**Probabilidad / Impacto:** bajos.
**Posibles alternativas:** (a) mover este tipo de reglas-frontera a una sección de "invariantes negativas" separada del catálogo numerado; (b) dejarla como está, documentando explícitamente que el catálogo incluye tanto reglas activas como invariantes de exclusión.

---

## 4. Eventos

### AR-011 — 🟠 Alto — `origen = 'coach'` existe en el CHECK sin ningún tipo de evento asociado
**Módulos afectados:** Engineering Handbook (07)
**Descripción:** la columna `origen` de `progression_events` incluye `coach` en su CHECK, pero ningún tipo de evento (`tipo`) tiene a `coach` como productor — es una extensión especulativa para un módulo (Coach IA) que ni siquiera tiene handbook de dominio todavía.
**Evidencia exacta:** `engineering/modules/07-domain-events/index.html:54,90`.
**Consecuencia:** contradice directamente el propio principio que el mismo Engineering Handbook establece (FT-10/FT-11, ENG-ADR-01 — "no se construye una capa sin un caso de uso real que la necesite") — el documento se auto-contradice en su propia sección de eventos.
**Probabilidad:** certeza (ya está en el documento). **Impacto:** bajo funcionalmente, pero es un ejemplo concreto y citable de inconsistencia entre principio y práctica dentro del mismo handbook.
**Posibles alternativas:** (a) remover `coach` del CHECK hasta que exista al menos un tipo de evento real que lo use; (b) dejarlo y añadir una nota explícita reconociendo la excepción al principio, con su razón.

### AR-012 — 🟠 Alto — No existe un evento que registre si una recomendación de Progression Engine fue aceptada o rechazada por Motor BPS
**Módulos afectados:** Progression Engine Handbook (07) · Motor BPS Handbook · Engineering Handbook (07)
**Descripción:** `escalon_avanzado`/`escalon_retrocedido` (origen `progression_engine`) representan una *recomendación*; `transicion_estado` (origen `motor_bps`) representa una transición ya *aplicada*. No hay ningún campo ni evento que vincule explícitamente ambos — un observador del timeline no puede determinar con certeza si una recomendación fue seguida, ignorada, o aplicada más tarde de lo esperado.
**Evidencia exacta:** `engineering/modules/07-domain-events/index.html` (matriz Evento → Productor/Consumidor, sección "matriz-evento-consumidor").
**Consecuencia:** rompe la trazabilidad completa que FT-06 (Explicabilidad) exige — se puede saber *qué* se recomendó y *qué* se aplicó, pero no *que uno causó al otro* sin inferencia manual por proximidad temporal, que es frágil.
**Probabilidad:** alta si se implementa tal cual está especificado hoy.
**Impacto:** alto para auditoría y debugging de producción.
**Posibles alternativas:** (a) añadir un campo `evento_origen_id` (FK opcional a otro evento) a `progression_events`; (b) fusionar recomendación y aplicación en un único evento con un campo de estado (`propuesto`/`aplicado`/`rechazado`).

### AR-013 — 🟡 Medio — El payload `contexto` no tiene esquema definido por tipo de evento
**Módulos afectados:** Engineering Handbook (07) · Motor BPS Handbook (05, IN-5) · Progression Engine Handbook (14)
**Descripción:** `contexto` (jsonb) es la pieza que garantiza el replay determinista, pero ningún documento define su forma exacta por cada uno de los 25 tipos de evento — queda como "las métricas usadas", una descripción de intención, no un contrato.
**Consecuencia:** dos implementaciones del mismo tipo de evento pueden serializar `contexto` de forma distinta, rompiendo la comparabilidad entre registros históricos y la reconstrucción de decisiones pasadas.
**Probabilidad:** alta. **Impacto:** alto para observabilidad, medio para funcionalidad core.
**Posibles alternativas:** (a) definir un esquema jsonb mínimo por categoría de evento (micro/macro/estancamiento/deload) en el Progression Engine Handbook; (b) versionar `contexto` con un campo `schema_version` desde el primer día.

**✅ Ya identificado y correctamente tratado como hallazgo insignia:** la brecha de 25 valores del CHECK de `tipo` (14 originales + 11 añadidos por Motor BPS/Progression Engine sin consolidar) ya fue encontrada y documentada por el propio Engineering Handbook (07) durante su construcción — se reafirma aquí como 🔴 Crítico, sin repetir el detalle ya expuesto en ese documento.

---

## 5. Estados

### AR-014 — 🟠 Alto — La FSM de Motor BPS no tiene transición formal para la aplicación de una recomendación de Nivel de Progression Engine
**Módulos afectados:** Motor BPS Handbook (04, 05) · Progression Engine Handbook (07, PE-016)
**Descripción:** el módulo 04 (Salidas) de Motor BPS Handbook declara que `nivel_actual` puede escribirse por "aplicación de decisión de Progression con alcance de Nivel" — pero el módulo 05 (Máquina de Estados), la tabla canónica de transiciones (T1–T15), no incluye ninguna transición para este caso. Las únicas transiciones relacionadas con nivel son T3/T4/T5 (activación inicial desde el Diagnóstico) y T14 (fin de estructura del Sistema, un disparador de agotamiento de contenido, no de recomendación de Progression). Progression Engine Handbook (PE-016), escrito después, asume que este mecanismo de aplicación ya existe.
**Evidencia exacta:**
- `motor-bps/modules/04-salidas/index.html:27`
- `motor-bps/modules/05-maquina-estados/index.html:44-82` (lista completa T1–T15, sin transición de este tipo)
**Consecuencia:** es una contradicción *interna* del propio Motor BPS Handbook (un módulo afirma una capacidad que otro módulo del mismo documento no formaliza), agravada por el hecho de que un handbook externo (PE) ya construyó una regla completa (PE-016) sobre esa capacidad no formalizada.
**Probabilidad:** alta — es el tipo de gap que solo se descubre al intentar implementar la FSM literalmente.
**Impacto:** alto — bloquea la implementación completa del ciclo de vida de avance de Nivel.
**Posibles alternativas:** (a) añadir una T16 explícita ("activo → activo, nivel_actual actualizado, recomendación de Progression aceptada") al Motor BPS Handbook; (b) tratar el avance de Nivel como una actualización de puntero sin transición de FSM formal, documentando esa decisión explícitamente como excepción.

### AR-015 — 🟡 Medio — Comportamiento no especificado si el eslabón post-retroceso vuelve a estancarse inmediatamente
**Módulos afectados:** Progression Engine Handbook (11)
**Descripción:** la máquina de estados de Estancamiento termina en "Escalón3 → Normal: retrocedió eslabón, reinicia evaluación" — pero no especifica si, en caso de que el nuevo eslabón también se estanque de inmediato, el ciclo reinicia desde "Candidato" (potencialmente entrando en un loop de retrocesos sucesivos sin límite) o si existe un techo no numerado.
**Evidencia exacta:** `progression-engine/modules/11-estancamiento/index.html` (diagrama de estados, transición Escalon3→Normal).
**Consecuencia:** riesgo de un usuario retrocediendo eslabones indefinidamente sin un mecanismo de "salida de emergencia" (ej. escalar a revisión humana) explícitamente definido.
**Probabilidad:** baja en frecuencia, pero el caso límite no está cubierto.
**Impacto:** medio — afecta a la experiencia de un usuario en el peor caso, no a la integridad de datos.
**Posibles alternativas:** (a) añadir un límite explícito de retrocesos consecutivos antes de escalar a revisión humana; (b) documentar explícitamente que no hay límite y que es una decisión de producto aceptada.

**✅ Verificado sin problema:** ni la FSM completa de Motor BPS (8 estados, 15 transiciones) ni las tres FSM del BCS Handbook (Cliente, Medición, EnlacePúblico) muestran estados muertos, transiciones imposibles ni estados inalcanzables — cada una fue auditada por herramienta durante su propia construcción y no se encontraron nuevas anomalías al revisarlas de nuevo aquí.

---

## 6. Base de datos

### AR-016 — 🔴 Crítico — El 100% de la lógica de dominio de Motor BPS, Progression Engine y BCS carece de tabla real
**Módulos afectados:** Database Handbook / Engineering Handbook (05) — consecuencia acumulada de Motor BPS Handbook, Progression Engine Handbook y BCS Handbook completos
**Descripción:** de las tablas que la especificación completa requeriría, solo 5 existen (`systems`, `profiles`, `diagnoses`, `workouts`, `workout_logs`) — todas del Core Product. `progression_events` (requerida por Architecture Handbook desde antes de que existieran Motor BPS/PE Handbook) y las tres tablas del BCS (Cliente, Medición, EnlacePúblico) no existen.
**Consecuencia:** ninguna decisión de Motor BPS o Progression Engine, ni ningún dato del BCS, puede persistirse hoy — el desarrollo de cualquiera de esos tres dominios está bloqueado en la capa de datos antes de tocar una sola línea de lógica de aplicación.
**Probabilidad:** certeza (estado actual verificado). **Impacto:** crítico, bloqueante total.
**Posibles alternativas:** no aplica una alternativa de diseño — es un hallazgo de estado, no de decisión. La alternativa es de secuenciación de trabajo: priorizar qué tabla se construye primero.

### AR-017 — 🟡 Medio — Ningún documento ensambla las 25 variables del BCS Handbook en una lista de columnas única
**Módulos afectados:** BCS Handbook (03) · Engineering Handbook (05)
**Descripción:** el catálogo de 25 variables está documentado como 25 fichas `.bcsvar` individuales con nombre en español/prosa (ej. "Circunferencia de cintura"), pero ningún documento las traduce a un nombre de columna `snake_case` con sufijo de unidad, siguiendo la convención que el propio Engineering Handbook (05) exige (`peso_kg`, no `peso`). Un implementador debe hacer esa traducción por su cuenta para las 25 variables.
**Evidencia exacta:** `bcs/modules/03-modelo-datos/index.html` (25 fichas en prosa) vs. `engineering/modules/05-database-handbook/index.html` (regla de naming, sin lista de columnas del BCS).
**Consecuencia:** riesgo real de que dos desarrolladores nombren la misma variable de forma distinta (`peso_kg` vs. `bcs_peso_kg` vs. `peso`), rompiendo FT-01 (SSoT) antes de escribir la primera migración.
**Probabilidad:** media-alta. **Impacto:** medio (corregible con una migración de rename, pero costoso si ya hay datos).
**Posibles alternativas:** (a) añadir una tabla de mapeo variable→columna en el BCS Handbook o el Engineering Handbook antes de implementar; (b) dejar que la primera implementación real fije el nombre y se documente retroactivamente (mayor riesgo).

### AR-018 — 🟠 Alto — RLS de `workouts`/`workout_logs` permite DELETE, contradiciendo la inmutabilidad exigida
**Módulos afectados:** Architecture Handbook (10) · Engineering Handbook (05, 08, 15)
**Descripción:** ya señalado por el propio Architecture Handbook como "migración de endurecimiento requerida" y nunca aplicada — las políticas reales "CRUD propio" permiten que un usuario borre su propio historial de entrenamientos, violando FT-09 (Inmutabilidad) que el Engineering Handbook declara como principio de prioridad 4.
**Evidencia exacta:** `handbook/modules/10-arquitectura-datos/index.html` (callout "Migración de endurecimiento requerida") — verificado también contra `supabase/schema.sql` real (política `"workouts: CRUD propio" ... for all`).
**Consecuencia:** un usuario puede destruir evidencia de su propio progreso, y cualquier motor futuro que dependa de un historial completo (Progression Engine, que exige mínimo 4 apariciones) puede recibir una ventana artificialmente vacía.
**Probabilidad:** certeza — es el estado real y verificado del RLS hoy.
**Impacto:** alto, ya clasificado como tal en el propio Roadmap del Engineering Handbook (15) — se reafirma aquí como prioridad de corrección antes de construir Progression Engine sobre datos reales.
**Posibles alternativas:** ya especificadas por el propio Architecture Handbook (10): restringir a select+insert en `workout_logs`, select+insert+update(estado) en `workouts`, sin delete en ninguna.

**✅ Verificado sin problema:** naming de tablas/columnas (snake_case, plural, sufijo de unidad explícito) es 100% consistente en las 5 tablas reales — ninguna excepción encontrada.

---

## 7. Seguridad

### AR-019 — 🟠 Alto — La regla de naming de secretos no tiene ningún guardrail técnico
**Módulos afectados:** Engineering Handbook (08, 12)
**Descripción:** la regla "ningún secreto de servidor con prefijo `NEXT_PUBLIC_`" existe únicamente como texto normativo — no hay CI (0 pipelines confirmado en 12), ni lint rule, ni secret-scanning que la haga cumplir automáticamente.
**Consecuencia:** la única defensa contra una fuga de `SUPABASE_SERVICE_ROLE_KEY` (el día que se active) es la disciplina manual de quien escribe el código.
**Probabilidad:** baja mientras la clave siga sin usarse (confirmado); alta en el momento en que se active sin haber resuelto primero AR de CI.
**Impacto:** crítico si ocurre, pero condicionado a una activación futura que hoy no existe.
**Posibles alternativas:** (a) añadir un paso de CI que falle el build si detecta `SUPABASE_SERVICE_ROLE_KEY` en cualquier archivo bajo `src/app` o cualquier componente Client; (b) usar un linter de secretos genérico (gitleaks, etc.) antes de activar la clave, no después.

### AR-020 — 🟢 Bajo (nota de corrección, no riesgo nuevo) — La ausencia de rate limiting es menos crítica de lo que su etiqueta "futuro" sugiere aislada
**Módulos afectados:** BCS Handbook (10) · Engineering Handbook (08)
**Descripción:** el token de enlace público tiene ~125 bits de entropía (21 caracteres alfanuméricos mixtos) — computacionalmente inviable de fuerza bruta incluso sin rate limiting. Ambos documentos etiquetan correctamente "rate limiting: futuro", pero presentado sin este cálculo de entropía, un lector podría sobreestimar la urgencia de esa pieza específica frente a otros riesgos de esta misma lista con impacto real más alto (AR-001, AR-016, AR-018).
**Consecuencia:** ninguna — es una recalibración de prioridad relativa, no un hallazgo de riesgo nuevo.
**Posibles alternativas:** ninguna requerida — se documenta para evitar sobre-priorizar esta pieza frente a otras más urgentes.

**✅ Verificado sin problema:** CSRF (mitigado por el modelo nativo de Server Actions), open redirect en el proxy (destino fijo, nunca desde un parámetro), y la advertencia de RLS-desactivado-por-accidente (ya explícita en `schema.sql`) están correctamente mitigados o señalados en la documentación existente.

---

## 8. Performance

### AR-021 — 🟡 Medio — Recomputación creciente del Reporte del BCS sin estrategia de cache
**Módulos afectados:** BCS Handbook (04, IN-D3; 12) · Engineering Handbook (09)
**Descripción:** el Reporte se computa siempre on-demand sobre el historial completo (decisión deliberada, para garantizar frescura — BCS-ADR-05 implícito en IN-D3), pero el propio BCS Handbook (12) proyecta "cientos de Mediciones" por cliente, y el Engineering Handbook (09) confirma cero estrategia de cache en todo el proyecto hoy.
**Consecuencia:** el costo de renderizar un Reporte crece linealmente (al menos) con el historial del cliente, sin mitigación definida más allá de "cachear sería una optimización de infraestructura" (mencionado pero no resuelto).
**Probabilidad:** media — depende del ritmo real de adopción del BCS. **Impacto:** medio, degradación gradual no catastrófica.
**Posibles alternativas:** (a) cachear el cálculo del Reporte con invalidación al registrar una nueva Medición; (b) paginar el cálculo de tendencias por rango de fechas en vez de todo el historial siempre.

**✅ Verificado sin problema:** no se detectó ningún patrón N+1 en los repositorios reales (`profile/repository.ts`, `workouts/repository.ts`) — cada función hace exactamente una consulta por invocación.

---

## 9. Escalabilidad

### AR-022 — 🟠 Alto — Riesgo compuesto: multi-tenant futuro del BCS + proyecto único de Supabase para todos los entornos
**Módulos afectados:** BCS Handbook (BCS-ADR-04) · Engineering Handbook (12)
**Descripción:** el BCS está diseñado para activar multi-tenant sin rediseño (BCS-ADR-04) — pero el Engineering Handbook (12) ya señala como riesgo real que Preview/Local probablemente comparten el mismo proyecto de Supabase que Producción. Si ambos riesgos coinciden en el tiempo, probar el aislamiento entre dos entrenadores (tenants) en Preview arriesgaría exponer o corromper datos de producción.
**Consecuencia:** no se puede validar con seguridad la funcionalidad más delicada del BCS (aislamiento de datos entre entrenadores) sin resolver primero la separación de entornos.
**Probabilidad:** condicionada a la activación de multi-tenant, hoy no planeada a corto plazo.
**Impacto:** alto si ambos coinciden.
**Posibles alternativas:** (a) separar el proyecto de Supabase de Preview del de Producción antes de activar multi-tenant; (b) usar un esquema de datos separado (no solo RLS) para pruebas de aislamiento multi-tenant.

### AR-023 — 🟡 Medio — Ausencia de índices más allá de PK es el cuello de botella más probable del primer escalón de crecimiento
**Módulos afectados:** Engineering Handbook (05, 09, 15) — ya documentado como deuda técnica, se reafirma con impacto cuantificado.
**Descripción:** cero índices explícitos en las 5 tablas reales hoy; el propio Architecture Handbook ya especifica los índices requeridos pero no aplicados (`(user_id, fecha_planificada)`, etc.).
**Consecuencia:** con volumen de usuarios bajo, invisible; es el primer límite real que un aumento de usuarios activos expondría, antes que cualquier límite de código.
**Posibles alternativas:** ya especificadas por Architecture Handbook — aplicar los índices ya diseñados es trabajo pendiente, no una decisión de diseño abierta.

---

## 10. Testing

### AR-024 — 🔴 Crítico — Cobertura de pruebas = 0% en la totalidad del ecosistema especificado
**Módulos afectados:** Engineering Handbook (10) — consecuencia acumulada de los seis handbooks
**Descripción:** ninguna de las reglas de negocio (39 de PE, 25 de Motor BPS), transiciones de estado (15 de Motor BPS, 9 de BCS), o eventos (25 tipos consolidados) especificados en casi 3.000 líneas de handbooks de dominio ha sido verificada ejecutable — porque nada de esa lógica está implementada todavía, y no existe test runner en el proyecto.
**Consecuencia:** cualquier afirmación de "esto ya funciona" para los tres motores especificados es, por construcción, no verificada.
**Probabilidad:** certeza (estado actual). **Impacto:** crítico a medida que se implemente sin esta red de seguridad.
**Posibles alternativas:** ya especificadas por el propio Testing Handbook (10) del Engineering Handbook — introducir el test runner junto con la primera implementación real de un motor, aprovechando que los motores ya están diseñados como funciones puras.

### AR-025 — 🟠 Alto — Cualquier mock del Veredicto de Recovery heredará la ambigüedad de AR-001
**Módulos afectados:** Testing Handbook (Engineering, 10) · Motor BPS Handbook · Progression Engine Handbook
**Descripción:** un test futuro de cualquiera de los dos motores necesitará mockear el Veredicto de Recovery — pero como su forma es ambigua entre handbooks (AR-001), el mock que se escriba hoy probablemente no coincidirá con la forma que el Recovery Engine real termine teniendo el día que se implemente.
**Consecuencia:** trabajo de test a rehacer cuando Recovery Engine exista realmente, si no se resuelve AR-001 primero.
**Posibles alternativas:** resolver AR-001/AR-006 antes de escribir el primer test que dependa de este contrato.

---

## 11. Observabilidad

### AR-026 — 🟠 Alto — Sin esquema de `contexto`, el replay determinista no es verificable (ver AR-013)
Referencia cruzada — mismo hallazgo, ángulo de observabilidad: sin un esquema fijo, no hay forma de escribir una prueba o una alerta que detecte cuándo un evento se guardó con un `contexto` insuficiente para reconstruir la decisión.

### AR-027 — 🟡 Medio — No hay instrumentación para el rechazo de un `INSERT` de evento por CHECK inválido
**Módulos afectados:** Engineering Handbook (07, 11)
**Descripción:** si un motor futuro intenta insertar un `tipo` fuera del CHECK (ej. antes de que se aplique la consolidación de 25 valores, AR ya documentado), Postgres rechaza el `INSERT` — pero ningún log, warning ni evento de observabilidad está definido específicamente para capturar y alertar sobre ese rechazo.
**Consecuencia:** un motor mal desplegado podría fallar silenciosamente (a nivel de negocio, no de excepción no capturada) en producción sin que nadie lo note hasta que un usuario reporte datos faltantes.
**Posibles alternativas:** (a) especificar que todo `INSERT` fallido a `progression_events` se loguea con `console.error` siguiendo la convención `[contexto]` ya establecida (11); (b) tratarlo como parte del catálogo de errores del API Handbook (06).

---

## 12. UX

### AR-028 — 🟢 Bajo — Sin flujo de autoservicio si un enlace público del BCS expira o se revoca
**Módulos afectados:** BCS Handbook (09, 10)
**Descripción:** el cliente es completamente pasivo — si su enlace deja de funcionar, no hay ningún mecanismo dentro del propio sistema para solicitar uno nuevo; depende enteramente de contactar al entrenador por un canal externo.
**Consecuencia:** fricción menor, coherente con el modelo de producto (el entrenador es el único administrador) — no es un error, es una consecuencia aceptada del diseño.
**Posibles alternativas:** (a) dejarlo así, es coherente con el modelo; (b) añadir un botón "Solicitar nuevo enlace" que notifique al entrenador (cambiaría el alcance del BCS Handbook, candidato de v2, no de esta revisión).

### AR-029 — 🟢 Bajo — Sin atajo directo Dashboard → Comparación en el BCS Design System Handbook
**Módulos afectados:** BCS Design System Handbook (02)
**Descripción:** el mapa de recorrido (02) solo permite llegar a Comparación pasando por Historial — un paso de navegación adicional para una acción que probablemente sea frecuente para un entrenador con muchos clientes.
**Posibles alternativas:** (a) añadir un atajo directo desde la Ficha de Cliente; (b) dejarlo como está si la frecuencia de uso real no lo justifica (no hay datos de uso todavía para decidir).

---

## 13. Documentación

### AR-030 — 🟡 Medio — Varias matrices exigidas son resúmenes por categoría, no exhaustivas por ítem
**Módulos afectados:** Progression Engine Handbook (06, matriz Regla→Pipeline: 5 filas para 39 reglas) · Engineering Handbook (04, matriz Servicio→Repositorio: 4 filas)
**Descripción:** ambas matrices son honestas sobre su propio nivel de agregación (incluyen una nota aclaratoria), pero un lector que espere trazabilidad exhaustiva por ítem individual (como el encargo de esta misma revisión parece asumir posible) podría sobreestimar la cobertura real.
**Consecuencia:** ninguna funcional — es una expectativa de completitud a calibrar.
**Posibles alternativas:** (a) expandir a nivel de ítem individual las matrices más consultadas (empezando por Regla→Pipeline, la de mayor volumen); (b) mantener el resumen por categoría y reforzar la nota aclaratoria.

### AR-031 — 🟡 Medio — Cobertura no verificada al 100% de citas cruzadas de número de módulo entre los seis handbooks
**Módulos afectados:** los seis handbooks
**Descripción:** cada handbook numera sus módulos de forma independiente (ej. "módulo 04" significa algo distinto en cada uno). Esta revisión verificó por muestreo dirigido las citas cruzadas relevantes a los hallazgos AR-001 a AR-029 (sin error encontrado en la muestra), pero no ejecutó una verificación exhaustiva de las ~120 páginas totales del ecosistema — sería el equivalente a repetir la autoauditoría completa de los seis documentos, fuera del alcance práctico de esta revisión.
**Consecuencia:** no se puede afirmar con certeza absoluta que no exista ninguna otra cita cruzada incorrecta fuera de la muestra revisada.
**Posibles alternativas:** (a) un script de verificación automática que extraiga cada referencia "(NN)" de cada handbook y confirme que el módulo NN de ese mismo handbook existe (detecta errores de auto-referencia, no cross-handbook); (b) aceptar el muestreo dirigido como suficiente dado que los hallazgos de mayor severidad ya fueron verificados con cita exacta.

**✅ Verificado sin problema:** dentro de cada handbook individual, la ausencia de ADRs huérfanos, enlaces internos rotos y anclas inválidas ya fue verificada por herramienta durante la construcción de cada documento (0 encontrados tras corrección, en los seis casos). Esta revisión no repite esa verificación exhaustiva — la hereda como válida porque fue hecha con grep/scripts reproducibles, no por inspección visual.

---

## Matriz consolidada

| ID | Problema (resumen) | Documento(s) | Impacto | ¿Bloquea implementación? | ¿Necesita ADR? | ¿Puede posponerse? |
|---|---|---|---|---|---|---|
| AR-001 | Forma del Veredicto de Recovery contradictoria | Motor BPS ↔ Progression Engine | Crítico | **Sí** | Sí | No |
| AR-005 | Ciclo de dependencia falso MB↔PE | Engineering | Crítico (comprensión) | No (dominio correcto) | No — es corrección de matriz | Sí, pero de bajo costo corregir ya |
| AR-006 | Recovery Engine sin handbook propio | Motor BPS, PE, Engineering | Crítico | **Sí** (para cualquier 3er consumidor) | Sí (handbook completo) | No |
| AR-016 | Cero tablas reales para MB/PE/BCS | Engineering (05) | Crítico | **Sí** | No — es trabajo de implementación | No |
| AR-024 | Cobertura de pruebas 0% | Engineering (10) | Crítico (creciente) | No hoy, sí a futuro | No | Sí, hasta la primera implementación real |
| AR-008 | PE-012 desempate ambiguo | Progression Engine | Alto | **Sí** (para ese subsistema) | Sí | No |
| AR-009 / AR-014 | FSM de Motor BPS sin transición de avance de Nivel | Motor BPS, PE | Alto | **Sí** (para avance de Nivel) | Sí | No |
| AR-011 | `origen=coach` sin evento asociado | Engineering (07) | Bajo | No | No | Sí |
| AR-012 | Sin evento de aceptación/rechazo de recomendación PE | Engineering, PE, MB | Alto | No (pero degrada auditoría) | Sí | Sí, con seguimiento |
| AR-013 / AR-026 | `contexto` sin esquema por tipo | Engineering, MB, PE | Alto | No hoy | Sí | Sí, antes de implementar replay |
| AR-017 | 25 variables del BCS sin lista de columnas ensamblada | BCS, Engineering | Medio | **Sí** (para migración BCS) | No — es trabajo de traducción | No |
| AR-018 | RLS de workouts/workout_logs permite delete | Architecture, Engineering | Alto | No hoy, sí para Progression Engine sobre datos reales | No — ya especificado, falta aplicar | No, antes de PE en producción |
| AR-019 | Naming de secretos sin guardrail técnico | Engineering (08, 12) | Alto (condicional) | No hoy | No | Sí, hasta activar la clave |
| AR-021 | Reporte BCS sin cache, recomputación creciente | BCS, Engineering | Medio | No | No | Sí |
| AR-022 | Multi-tenant BCS + un solo proyecto Supabase | BCS, Engineering | Alto (condicional) | No hoy | Sí | Sí, hasta activar multi-tenant |
| AR-025 | Mocks de Recovery heredan ambigüedad | Engineering (10) | Alto | No hoy | Depende de AR-001/006 | Sí |
| AR-027 | Sin log de INSERT rechazado por CHECK | Engineering (07, 11) | Medio | No | No | Sí |
| AR-002, AR-003, AR-004, AR-007, AR-010, AR-015, AR-020, AR-023, AR-028, AR-029, AR-030, AR-031 | Ver detalle arriba | Varios | Bajo–Medio | No | No en su mayoría | Sí |

---

## Autoauditoría de esta revisión

- ✅ Se analizaron los seis handbooks — Architecture, Motor BPS, Progression Engine, BCS, BCS Design System, Engineering — tratados conjuntamente, no de forma aislada.
- ✅ No se omitió ninguna de las 13 categorías de auditoría exigidas — cada una tiene al menos un hallazgo o una nota explícita de "verificado sin problema" con su justificación.
- ✅ No se propuso ninguna funcionalidad nueva — toda "posible alternativa" lista opciones sin decidir cuál adoptar, tal como se exigió.
- ✅ No se modificó el alcance de ningún handbook existente — este documento es puramente analítico, no se escribió ni editó ningún archivo de los seis handbooks.
- ✅ Todos los hallazgos de severidad 🔴 y 🟠 tienen referencia exacta de archivo (verificada por lectura/grep directo, no por memoria) — AR-001, AR-005, AR-006, AR-009/014, AR-011, AR-016, AR-018 fueron confirmados contra el contenido real de los archivos en esta misma sesión.
- ⚠️ Los hallazgos de severidad 🟡 y 🟢 se basan en su mayoría en el conocimiento de autoría de los seis documentos (todos escritos en esta misma sesión) más verificación puntual — no se re-verificó cada uno con grep independiente por razones de alcance práctico; se declara explícitamente en AR-031 como limitación conocida de esta propia revisión.
- ✅ Ningún riesgo se presenta sin evidencia documental — cuando la evidencia es "ausencia de algo" (ej. AR-016, cero tablas; AR-024, cero tests), se verificó la ausencia contra el estado real del repositorio, no se asumió.

**Recomendación del comité:** no aprobar el inicio de implementación de Motor BPS ni Progression Engine hasta resolver AR-001/AR-006 (el contrato de Recovery Engine). El Core Product y el propio Engineering Handbook pueden avanzar (aplicando AR-018) sin bloqueo. El BCS puede avanzar en paralelo si se resuelve AR-017 primero (ensamblar el esquema de columnas) — no depende de Recovery Engine.
