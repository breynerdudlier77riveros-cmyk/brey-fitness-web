# Normative Knowledge Base (NKB) v1.0 — Arquitectura congelada

Infraestructura documental que **almacena referencias normativas de forma
trazable**. Nada más.

Este documento **no contiene código, valores, tablas, percentiles ni una sola
referencia concreta**. Su único producto es lenguaje congelado: entidades,
reglas y límites.

---

## La decisión que condiciona todo

> **El sujeto de una norma es una VARIABLE, nunca una capacidad.**

La NKB no sabe qué es una capacidad funcional, ni una composición corporal, ni
un analito de laboratorio. Almacena normas sobre **magnitudes medibles**, y
quién las use decide a qué corresponden en su propio dominio.

Esa decisión es la que la hace universal. Si la NKB conociera el catálogo de
capacidades del PAS, quedaría atada a él y no podría almacenar una norma de
composición corporal, de bioquímica o de ingesta. Ver `11-ADR.md`, NKB-ADR-01.

**Consecuencia asumida:** la correspondencia entre una variable de la NKB y una
capacidad del PAS —o una variable del BCS— se resuelve **fuera** de la NKB. Es
el mismo criterio que ya separa al Atleta del PAS del Cliente del BCS.

---

## Qué es y qué no es

| Es | No es |
|---|---|
| Un **almacén** de referencias normativas | Un motor de interpretación |
| Un registro **trazable** de qué dice cada fuente | Una fuente de verdad sobre un sujeto |
| Una biblioteca **universal** de normas | Un módulo del PAS |
| Documentación de **cómo** se guarda una norma | Un conjunto de valores normativos |

**La NKB no contiene ni un solo dato de ninguna persona.** No hay sujetos, no
hay mediciones, no hay resultados. Es una biblioteca, no un expediente.

---

## Diferencia frente a la PKB

Responden preguntas distintas y no se solapan.

| | PKB | NKB |
|---|---|---|
| **Pregunta** | ¿Qué prueba puede caracterizar qué capacidad? | ¿Qué referencias normativas existen para una variable? |
| **Sujeto** | La correspondencia prueba→capacidad | La variable medida |
| **Dominio** | Rendimiento físico | Cualquiera |
| **Naturaleza** | Validez del instrumento | Distribución de valores en una población |
| **Sin ella** | No puede derivarse un perfil | Puede derivarse el perfil, sin referencia poblacional |

La PKB dice que una prueba **mide** algo. La NKB dice cómo **se distribuye** ese
algo en una población. Son dos afirmaciones científicas independientes: una
prueba puede tener validez demostrada y ninguna norma publicada, y al revés.

## Diferencia frente al NIE

| | NKB | NIE *(no existe)* |
|---|---|---|
| **Verbo** | Almacena | Aplica |
| **Toca a un sujeto** | Nunca | Sí |
| **Decide qué norma usar** | No | Sí |
| **Produce** | Referencias con su traza | Lectura de un valor concreto |

La NKB **nunca elige** qué norma corresponde a una persona. Publica lo que hay,
con sus condiciones de aplicabilidad, y el NIE decide —y responde por ello—.

Separarlos importa: si la NKB eligiera, la elección quedaría enterrada en la
biblioteca y nadie podría auditarla.

---

## Alcance

La NKB debe poder almacenar normas de **cualquier** dominio: composición
corporal, rendimiento físico, antropometría, fisiología, nutrición, laboratorio
clínico y cualquier sistema futuro del ecosistema.

Nunca se diseña suponiendo que servirá solo para pruebas físicas.

## Limitaciones

- **No demuestra causalidad.** Una norma describe una distribución observada.
- **No interpreta.** No dice qué significa un valor.
- **No clasifica personas.** Almacena las clasificaciones que sus fuentes
  definen; no las aplica.
- **No recomienda.** Ni entrenamiento, ni nutrición, ni conducta clínica.
- **No caracteriza capacidades.** Eso es de la PKB.
- **No convierte unidades.** Conviven kg, kgf y lbf, y cada ficha declara la suya.
- **No contenía ni un valor en v1.0.** Aquel sprint congeló la arquitectura; las
  normas llegaron después, con los criterios ya cerrados.

---

## Cómo leer este documento

### Fundamentos · NKB-1.0

| Fichero | Contenido |
|---|---|
| `00-objetivo.md` | Objetivo, responsabilidades y límites |
| `01-modelo-conceptual.md` | Entidades y sus relaciones |
| `02-modelo-normativo.md` | Qué constituye una norma y sus siete formas |
| `03-poblaciones.md` | El concepto de población y de estrato |
| `04-referencias.md` | Cómo se documenta una referencia; cuáles se rechazan |
| `05-calidad.md` | Estructura de la calidad normativa |
| `06-versionado.md` | Qué cambia, qué no cambia nunca |
| `07-trazabilidad.md` | De dónde sale cada dato almacenado |
| `08-limitaciones.md` | Lo que la NKB jamás afirmará |

### Criterios de admisión · NKB-2.0

| Fichero | Contenido |
|---|---|
| `13-criterios-de-admision.md` | **El embudo de cinco niveles y los ocho criterios** |
| `14-contrato-de-norma.md` | Los 40 campos que describen una norma, con su razón |
| `15-tipos-de-norma.md` | Qué exige, permite y prohíbe cada uno de los siete tipos |
| `16-modelo-de-calidad.md` | 11 verificaciones y 5 niveles, sin umbrales numéricos |
| `17-modelo-de-poblacion.md` | Cómo se registra y cuándo es admisible |
| `18-modelo-de-metodo.md` | Cuándo dos métodos son el mismo |
| `19-modelo-de-estratificacion.md` | Una norma por estrato publicado |
| `20-modelo-de-procedencia.md` | Primaria, secundaria y la cadena entre ambas |
| `21-modelo-de-derivaciones.md` | Qué transformaciones se autorizan |
| `22-modelo-de-conflictos.md` | Qué es un conflicto y por qué no se resuelve |
| `23-estados-y-retirada.md` | Cinco estados, retirada y sustitución |
| `24-reglas-de-trazabilidad.md` | Las ocho preguntas y siete reglas nuevas |
| `25-casos-rechazados.md` | 33 formas que no producen norma admisible |
| `26-procedimiento-de-admision.md` | **El recorrido, de principio a fin** |

### Primer dominio · NKB-3.0 a 3.4

| Fichero | Contenido | Sprint |
|---|---|---|
| `27-dominio-seleccionado.md` | Tres candidatos evaluados y por qué se eligió uno | 3.0 |
| `28-registro-de-evaluacion.md` | **Las dos matrices**: embudo por fuente y cobertura · los cuatro rechazos RN | 3.0 · act. 3.1, 3.3 y 3.4 |
| `29-completacion-y-conflictos.md` | Resolución de fuentes pendientes y primer análisis de conflictos | 3.1 |
| `30-auditoria-de-dominio.md` | Auditoría de las 82 primeras normas y cierre del dominio | 3.2 |
| `31-cobertura-y-aplicabilidad.md` | **Norma existente ≠ admisible ≠ aplicable.** Matrices de cobertura y aplicabilidad | 3.3 · act. 3.4 |
| `32-busqueda-conflictos-y-deudas.md` | Registro de búsqueda por prioridad y las cuatro deudas · **parcialmente superado por 34** | 3.3 |
| `33-auditoria-de-expansion.md` | Auditoría de las 154 normas tras la expansión de cobertura | 3.3 |
| `34-conflicto-accesos-y-cierre-de-deudas.md` | Determinación sistemática de accesos, RN-04 y primer uso de ES-2 | 3.4 |
| `35-auditoria-nkb-34.md` | Auditoría de integridad de las 356 normas, con verificación mecánica celda a celda | 3.4 |
| **`36-contrato-consumo-nie.md`** | **Qué puede pedir el NIE y qué obliga a devolver.** 19 campos, 8 estados y la regla crítica | 3.5 |
| `37-auditoria-calidad-y-celdas.md` | Reproducibilidad de la calidad, las dos objeciones ES-2 y cómo se representa una celda pequeña | 3.5 |
| `38-auditoria-aplicabilidad.md` | **Doctrina calidad ≠ aplicabilidad** y los ocho estados de consumo | 3.5 |
| `39-auditoria-unidades-y-metodos.md` | Tres unidades sin conversión y tres colisiones de marca que no son equivalencias | 3.5 |
| **`40-cierre-conflicto-ensin.md`** | **El conflicto ENSIN: real, verificado, cuantificado y no resuelto** | 3.5 |
| `41-auditoria-tipos-y-puntos-de-corte.md` | Dos tipos en uso · **cero puntos de corte admisibles** | 3.5 |
| `42-auditoria-trazabilidad-nkb-35.md` | Cadena completa de las 356 normas, 3 264 celdas verificadas | 3.5 |
| `_evidencia/referencias.yaml` | SSoT de referencias: verificadas, detenidas, pendientes y rechazadas | — |

#### Fichas de norma

| Fichero | Normas | Población | Calidad |
|---|---|---|---|
| `fichas/HGS-DE-TN2-media-dispersion.md` | 28 · media y dispersión | Alemania, 17–90 | Moderada |
| `fichas/HGS-DE-TN1-mediana.md` | 28 · percentil 50 | Alemania, 17–90 | Moderada |
| `fichas/HGS-BR-TN1-percentiles.md` | 26 · 13 percentiles | Brasil, varones > 1,70 m, 65–90 | Moderada |
| `fichas/HGS-BR-TN1-varones-160-170.md` | 26 · **5 en ES-2** | Brasil, varones 1,60–1,70 m, 65–90 | Moderada |
| `fichas/HGS-BR-TN1-varones-hasta-160.md` | 26 | Brasil, varones ≤ 1,60 m, 65–90 | Moderada |
| `fichas/HGS-BR-TN1-mujeres-sobre-160.md` | 26 | Brasil, mujeres > 1,60 m, 65–90 | Moderada |
| `fichas/HGS-BR-TN1-mujeres-150-160.md` | 26 | Brasil, mujeres 1,50–1,60 m, 65–90 | Moderada |
| `fichas/HGS-BR-TN1-mujeres-hasta-150.md` | 26 | Brasil, mujeres ≤ 1,50 m, 65–90 | Moderada |
| `fichas/HGS-CO-TN1-percentiles-escolares.md` | 24 · **ES-2** | **Colombia, 6–17,9** | Moderada |
| `fichas/HGS-CO-UNI-TN1-percentiles.md` | 24 · 7 percentiles | **Colombia, universitarios 18–29** | Moderada |
| `fichas/HGS-CO-UNI-TN2-media-dispersion.md` | 24 · media y dispersión | **Colombia, universitarios 18–29** | Moderada |
| `fichas/HGS-CO-CUC-TN1-mano-dominante.md` | 12 · 7 percentiles | **Colombia, Cúcuta, 10–69** | **Baja** |
| `fichas/HGS-CO-CUC-TN1-mano-no-dominante.md` | 12 · 7 percentiles | **Colombia, Cúcuta, 10–69** | **Baja** |
| `fichas/HGS-CL-TN1-percentiles-mano-derecha.md` | 24 · 9 percentiles | Chile, Región del Maule, 6–17,9 | Moderada |
| `fichas/HGS-CL-TN1-percentiles-mano-izquierda.md` | 24 · 9 percentiles | Chile, Región del Maule, 6–17,9 | Moderada |

### Transversales

| Fichero | Contenido |
|---|---|
| `09-invariantes.md` | Reglas que nunca podrán romperse |
| `10-roadmap.md` | Sprints 3 en adelante |
| `11-ADR.md` | Decisiones arquitectónicas |
| `12-glosario.md` | Lenguaje congelado y términos prohibidos |

> **Por dónde empezar si vas a evaluar una fuente:** `26`, y desde ahí a lo que
> haga falta. Ese módulo existe para que puedas responder si una fuente produce
> norma admisible sin preguntar a nadie.

## Estado

| | |
|---|---|
| **NKB-1.0** | Arquitectura congelada · 12 entidades, 14 invariantes, 10 ADR |
| **NKB-2.0** | Criterios de admisión congelados · 40 campos, 33 casos rechazados, 9 invariantes y 7 ADR nuevos |
| **NKB-3.0 a 3.5** | Primer dominio · fuerza de prensión manual · auditada y con contrato de consumo definido |
| **Normas publicadas** | **356** · 1 variable, 6 métodos, 6 poblaciones, 3 unidades, 15 fichas |
| **Estados** | 327 en ES-1 · **29 en ES-2 · Cuestionada** (`34` y `40`) |
| **Calidad** | **0 Alta** · 332 Moderada · **24 Baja** · 0 Muy baja |
| **Tipos** | TN-1 · 308 · TN-2 · 48 · **TN-5 puntos de corte: 0** |
| **Fuentes evaluadas** | 19 · 6 admitidas hasta E-5 · 1 verificada y no admitida · 2 detenidas en E-2 · 9 sin verificar · 1 rechazada por naturaleza |
| **Conflictos** | **1 discrepancia real y verificada** (par ENSIN), no resuelta y no registrable como conflicto formal hasta que la segunda norma sea accesible (`40`) |
| **Verificación** | 3 264 celdas contrastadas celda a celda contra su fichero original · **0 discrepancias** |

Los criterios se fijaron **antes** de tener ninguna fuente delante, para que
ninguna los condicionara. El primer dominio (`27`) se eligió después.

**Diez de las quince fichas no son aplicables a la población objetivo de BREY**,
y las quince permanecen en la base. La NKB es universal: almacena normas, no
recomendaciones. Y no interpreta valores individuales — eso será del NIE, que
todavía no existe.

**Colombia ya tiene cobertura adulta**, y hay que leerla con su calidad delante:
18–29 años con una fuente de 5 647 personas, y 20–69 solo con una muestra de
conveniencia de una sola ciudad, de **calidad Baja**. Los mayores de 70 siguen
sin norma. Detalle en `31`.

**La norma colombiana de 6 a 17,9 años está Cuestionada.** Otro análisis de las
mismas mediciones de la ENSIN-2015 publica percentiles que difieren hasta 4,5 kg.
No se ha elegido cuál es correcta y no se elegirá (`40`).

**Ninguna norma de la base alcanza calidad Alta**, en cinco sprints. Es un dato
sobre el nivel de exigencia, no sobre la literatura, y debe llegarle al NIE.

**No existe ningún punto de corte admisible** para esta variable. El NIE podrá
situar un valor en una distribución; **no podrá clasificar a nadie** (`41`).

## Principio heredado

> Nada que carezca de respaldo se inventa; se declara como pendiente.

Aplicado aquí en tres formas que conviene no confundir (`05`):

| Estado | Significa |
|---|---|
| **Sin norma admisible** | Se buscó y no se localizó fuente aceptable |
| **No verificado** | No se ha comprobado todavía · afirma algo sobre **nuestro trabajo** |
| **Deuda de acceso** | Existe y no podemos leerla · tampoco afirma nada sobre la evidencia |

**La NKB no tiene ninguna deuda científica declarada en este dominio.** Todo lo
que falta, falta por trabajo pendiente o por acceso.
