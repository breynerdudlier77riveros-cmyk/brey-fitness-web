---
modulo: 10
titulo: Roadmap
estado: congelado
---

# 10 · Roadmap

Qué queda por decidir, en qué orden y por qué en ese orden.

## Criterio de entrega

Desde el Sprint 2, **cada entrega nace implementada, probada e integrada**, no
solo especificada. El Sprint 1 es la excepción deliberada y única: congelar el
lenguaje antes de escribir código evita que el modelo acabe siendo lo que la
primera implementación resultó ser.

## Regla de dependencia

El orden no es negociable en un punto: **el Sprint 3 depende del 2, y el NIE
depende de ambos.** Sin criterios de calidad no puede graduarse ninguna norma, y
sin normas graduadas no hay nada que aplicar.

---

## Sprint 2 · Criterios y contrato — **CERRADO**

**Decidió** cómo se admite y se gradúa una norma, y qué debe poder describirse
de ella.

| Entrega | Módulo |
|---|---|
| Criterios de admisión y embudo de cinco niveles | `13` |
| Contrato conceptual de una norma · 40 campos | `14` |
| Los siete tipos: qué exigen, permiten y prohíben | `15` |
| Modelo de calidad · 11 verificaciones, 5 niveles cualitativos | `16` |
| Modelos de población, método y estratificación | `17`, `18`, `19` |
| Modelos de procedencia, derivaciones y conflictos | `20`, `21`, `22` |
| Estados normativos, retirada y sustitución | `23` |
| Reglas de trazabilidad | `24` |
| Casos rechazados · 33 formas | `25` |
| Procedimiento de admisión | `26` |

**Estado al cerrar:** la base puede admitir normas y **no contiene ninguna**.
Correcto: los criterios se fijaron sin ninguna fuente delante.

**Lo que quedó pendiente y no era de este sprint:** el registro físico de
referencias verificadas —el fichero único al estilo del de la CKB y la PKB— se
crea en el Sprint 3, cuando exista la primera fuente que registrar.

---

## Sprint 3 · Primer dominio — **CERRADO**

**Dominio elegido:** fuerza de prensión manual (`27`), por madurez de su
literatura y porque **falla de las formas que la arquitectura debe resolver**.

| Entrega | Módulo |
|---|---|
| Selección de dominio con tres candidatos evaluados | `27` |
| Registro de referencias | `_evidencia/referencias.yaml` |
| Fichas de norma | `fichas/` · 2 fichas, 56 normas |
| Matriz de cobertura y matriz del embudo | `28` |
| Normas rechazadas dentro de una fuente admitida | `28` · RN-01 a RN-03 |

**Resultado:** 1 fuente admitida hasta E-5, 5 localizadas sin verificar, 1
rechazada por naturaleza. Tres normas rechazadas **dentro** de la fuente
admitida, incluida una columna titulada «risk threshold» que no entró como punto
de corte.

**Lo que no se ejercitó:** el modelo de conflictos, por haber una sola fuente
admitida.

---

## Sprint 3-bis · Segunda fuente y cierre del dominio — **CERRADO** (NKB-3.1 y 3.2)

**Objetivo cumplido en parte:** se verificó una segunda fuente y se auditó el
dominio. El modelo de conflictos **no** llegó a ejercitarse.

| Entrega | Módulo |
|---|---|
| Resolución de las 5 fuentes en E-1 | `29` · 2 resueltas, 3 documentadas como deuda |
| Segunda población · Brasil | `fichas/HGS-BR-TN1-percentiles.md` · 26 normas |
| Segundo método · JAMAR hidráulico | EQ-3 por defecto, aplicado sin excepción |
| Auditoría de las 82 normas y cierre | `30` · 15 criterios |

**Hallazgo arquitectónico:** el conflicto normativo es **estructuralmente raro**,
y eso es consecuencia buscada de una identidad estricta, no un defecto (`29`).

---

## Sprint 3-ter · Expansión de cobertura y relevancia poblacional — **CERRADO** (NKB-3.3)

**Objetivo:** dejar de tener una base cuyas normas no correspondían a nadie de
la población que BREY atiende, sin relajar un solo criterio para conseguirlo.

| Entrega | Módulo |
|---|---|
| Prioridad 1 · Colombia | `fichas/HGS-CO-TN1-percentiles-escolares.md` · 24 normas |
| Prioridad 2 · Latinoamérica | 2 fichas chilenas · 48 normas |
| Separación existente / admisible / aplicable | `31` |
| Matrices de cobertura y aplicabilidad | `31` |
| Registro de búsqueda por prioridad y las cuatro deudas | `32` |
| Búsqueda deliberada de conflictos | `32` |
| Auditoría de las 154 normas | `33` · 18 criterios |

**Resultados que fijan doctrina:**

- La procedencia geográfica **no es criterio de admisión**. Afecta a la
  aplicabilidad, no a la admisibilidad.
- **Latinoamérica no es una población.** No es un conjunto de criterios de
  inclusión, y no aparece como tal en ninguna ficha.
- «Brasil como referencia latinoamericana» quedó **desmentido**: es la norma
  menos transferible de la base, y la literatura regional es densa.
- **Primera aparición de unidades heterogéneas** (kg, kgf, lbf). Se resuelve no
  resolviéndola: cada ficha declara la suya y nadie convierte.

**Lo que sigue sin ejercitarse:** el modelo de conflictos. Pero ya existe una
candidata concreta identificada, y su verificación es la deuda prioritaria.

---

## Sprint 3-quater · Cierre de deudas y ejercicio del conflicto — **CERRADO** (NKB-3.4)

**Objetivo:** convertir deuda de acceso en normas y ejercitar el modelo de
conflictos, sin ampliar el dominio ni tocar los criterios.

| Entrega | Módulo |
|---|---|
| Determinación sistemática de accesos por DOI | `34`, parte II |
| Colombia adulta · universitarios 18–29 | 2 fichas · 48 normas |
| Colombia adulta · Cúcuta 10–69 | 2 fichas · 24 normas |
| Brasil · los 5 estratos que faltaban | 5 fichas · 130 normas |
| RN-04 · categorías importadas de otra población | `28` y `34`, parte III |
| Primer uso de **ES-2 · Cuestionada** | `34`, parte V |
| Auditoría de integridad con verificación mecánica | `35` |

**Resultados que fijan doctrina:**

- **Antes de declarar deuda de acceso, comprobar el estado de acceso abierto del
  DOI.** Una copia ilegible no demuestra que no exista otra legible: así estuvo
  una fuente colombiana detenida un sprint entero sin motivo.
- **Un valor internamente imposible no se corrige ni se borra: se marca ES-2.**
- **Una clave provisional no sobrevive a la verificación de su fuente**, ni
  siquiera como cita histórica.
- **La calidad Baja se admite y se etiqueta.** La primera norma adulta
  colombiana es débil, y se publicó diciéndolo.

**Lo que sigue sin ejercitarse:** el modelo de conflictos. Pero la candidata ya
no es indefinida: `ramirez_velez_hgs_colombia_6_64_2021` comparte encuesta, país,
variable y franja etaria con una norma publicada, y solo falta leer su tabla.

---

## Sprint 3-quinquies · Cierre metodológico y preparación del NIE — **CERRADO** (NKB-3.5)

**Objetivo:** cerrar las condiciones que separaban a la NKB de un consumo seguro
por parte del NIE. Sprint documental y de auditoría: **cero normas nuevas**.

| Entrega | Módulo |
|---|---|
| **Contrato de consumo del NIE** · 19 campos, 8 estados, la regla crítica | `36` |
| Auditoría de calidad y de celdas pequeñas | `37` |
| Doctrina **calidad ≠ aplicabilidad** | `38` |
| Auditoría de unidades, instrumentos y métodos | `39` |
| **Cierre del conflicto ENSIN** | `40` |
| Auditoría de tipos y puntos de corte | `41` |
| Auditoría de trazabilidad de las 356 normas | `42` |

**Resultados que fijan doctrina:**

- **El conflicto ENSIN es real, está cuantificado y no se resuelve.** Dos
  análisis de las mismas mediciones difieren hasta 4,5 kg. `HGS-CO-TN1` pasa a
  ES-2.
- **El método de estimación determina el valor y no es coordenada de
  identidad.** Se registra siempre en CN-11; convertirlo en coordenada sería
  decisión de un sprint de criterios.
- **Calidad y aplicabilidad son ejes independientes.** No hay puntuación
  compuesta y no la habrá.
- **Los números de una tabla descriptiva no son umbrales.** No existe ningún
  umbral de n en la NKB.
- **Trazabilidad no es veracidad.** Que un valor se pueda seguir hasta su tabla
  significa que no lo inventamos, no que sea cierto.

---

## Sprint 3-sexies · Desbloqueo de accesos

**Objetivo:** una sola cosa, y todo lo demás es secundario.

| Entrega | Prioridad | Por qué |
|---|---|---|
| `ramirez_velez_hgs_colombia_6_64_2021` | **1** | Su tabla convierte una discrepancia verificada en **conflicto registrable**, y podría sacar a `HGS-CO-TN1` de ES-2 o confirmar su estado |
| Adultos mayores colombianos (SEMERGEN) | **2** | Única franja colombiana sin norma propia |
| `ramirez_velez_hgs_fuprecol_2017` | 3 | Copia abierta existente; el repositorio no responde |
| `hgs_escolares_chile_8_12_lms` · `hgs_adultos_chile_estandarizacion` | 4 | Deudas de acceso chilenas |
| Doctrina de **estratos estimados** | 5 | Requisito para transcribir la Tabla 4 chilena (`34`, parte IV) |

Las cuatro primeras necesitan **acceso institucional**, no más búsqueda. Es una
deuda que no se cierra trabajando más, sino consiguiendo permiso de lectura.

**Regla que no cambia:** una fuente prioritaria por su utilidad sigue teniendo
que pasar los ocho criterios. Que necesitemos una norma no la hace admisible
(`13`).

---

## Sprint 4 · Normative Interpretation Engine (NIE)

**Construye** el motor que aplica. Es el consumidor que justifica todo lo
anterior.

| Necesita | Estado |
|---|---|
| Normas con su población y su método | ✅ Sprint 3 · **356 normas** |
| Calidad por norma | ✅ Sprint 2 |
| Limitaciones por norma | ✅ Sprint 2 |
| Cobertura y alcance declarados | ✅ Sprint 3-ter · `31` |
| Estados normativos, incluida una norma cuestionada | ✅ Sprint 3-quater · `34` |
| **Contrato de consumo: qué pedir y qué recibe** | ✅ Sprint 3-quinquies · `36` |
| **Ocho estados de consumo** | ✅ `38` |
| Reglas de aplicabilidad | ❌ **Del propio NIE, no de la NKB** |
| Qué hacer sin norma aplicable | ❌ Del NIE |
| Qué hacer con una norma **débil pero aplicable** | ❌ Del NIE |
| Qué hacer con una norma **en ES-2** | ❌ Del NIE, y ya hay un caso real |
| Capa explícita de conversión de unidades | ❌ **Fuera de la NKB**, y no existe |

**Frontera:** el NIE decide qué norma corresponde y responde por esa decisión.
La NKB no la toma ni la sugiere (I-09).

**Advertencia de diseño:** el NIE tendrá que devolver «no hay norma aplicable»
con mucha frecuencia, y esa respuesta parecerá un fallo. Es la respuesta
correcta, y su diseño debe tratarla como resultado de primera clase y no como
error.

NKB-3.3 convierte esa advertencia en un caso concreto que el NIE tendrá delante
desde el primer día: **un adulto colombiano, cinco normas de adulto en la base y
ninguna aplicable** (`31`). Si el NIE devuelve cualquiera de las cinco, está
mal construido.

| También tendrá que distinguir | De |
|---|---|
| «No existe norma admisible» | «No hemos podido leer la que existe» |
| «No corresponde a esta persona» | «No existe» |
| «Existe para otro instrumento» | «No existe» |
| «Existe, y la respalda una muestra de conveniencia de 10 personas» | «Existe» |

**La última la añade NKB-3.4 y es la más difícil de las cuatro.** Un adulto
colombiano de 45 años ya tiene norma aplicable; esa norma es de calidad Baja y
procede de 15 a 29 personas por celda. El NIE no puede tratarla igual que la de
una encuesta nacional, y tampoco puede ocultarla. **Mostrar el valor sin su
calidad sería peor que no mostrar nada.**

---

## Sprint 5 · Dominios adicionales

Repite el Sprint 3 sobre otros dominios, sin tocar el modelo. Si un dominio
nuevo obligara a cambiar el modelo conceptual, sería señal de que el modelo no
era universal — y esa es la comprobación real de NKB-ADR-01.

---

## Sprint 6 · Integración

**Conecta** la NKB al resto del ecosistema a través del NIE.

La correspondencia entre una variable de la NKB y una capacidad del PAS, o una
variable del BCS, se resuelve **aquí** — fuera de la NKB, como exige I-01.

---

## Fuera del roadmap, permanentemente

| No se hará | Motivo |
|---|---|
| Almacenar datos de personas | I-02 |
| Elegir qué norma aplicar | I-09 |
| Derivar normas de otras | I-05 |
| Armonizar clasificaciones entre fuentes | I-11 |
| Admitir normas de fabricante sin publicación | `04` |
| Fijar caducidad por antigüedad | `06`: ninguna fuente la documenta |
| Emitir un valor «normal» o «deseable» | I-12 |

## Criterio de actualización

Una versión nueva de la NKB **no reescribe** la anterior. Cuando una norma
cambia de estado se registra el anterior, la fecha y el motivo; la versión de la
base avanza; y dos lecturas hechas con versiones distintas dejan de ser
directamente comparables.

Es el mismo mecanismo de versionado que el PAS congeló en su modelo temporal.
