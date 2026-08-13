---
modulo: 35
titulo: Auditoría de integridad de NKB-3.4
estado: v1.0
sprint: NKB-3.4
---

# 35 · Auditoría de integridad

Auditoría de las 356 normas tras el cierre de deudas. Amplía `30` y `33` sin
sustituirlas.

---

## Los quince puntos

| # | Comprobación | Resultado |
|---|---|---|
| 1 | Referencias colgantes | **0** · una detectada y corregida durante la propia auditoría |
| 2 | Referencias huérfanas | **0** |
| 3 | Referencias duplicadas | **0** · 19 claves únicas |
| 4 | Ids de norma duplicados | **0 de 356** |
| 5 | Campos CN incompletos | **0** · 15/15 fichas al 40/40 |
| 6 | Valores fuera de fichas | **0** |
| 7 | Unidades inconsistentes dentro de una ficha | **0** · ver abajo |
| 8 | Fabricantes usados como autoridad | **0** |
| 9 | Derivaciones no autorizadas | **0** |
| 10 | Percentiles convertidos en cortes | **0** · RN-04 lo impidió una vez más |
| 11 | Conflictos resueltos indebidamente | **0** · no hay ninguno declarado |
| 12 | Normas sin trazabilidad | **0** |
| 13 | Contaminación PAS/BCS | **0** · ningún fichero fuera de `docs/normative-knowledge-base/` |
| 14 | Vocabulario de juicio | **0** · la única coincidencia es una negación explícita |
| 15 | Incoherencias entre README y fichas | **0** tras actualizar el README |

### La referencia colgante que encontró la auditoría

La clave provisional de Cúcuta se retiró del YAML al verificarse la fuente, pero
**seguía citada entre comillas simples en tres puntos de `28` y `32`**. Es
exactamente el mismo fallo que la auditoría de NKB-3.2 encontró en el módulo 28,
y por el mismo motivo: retirar una clave y dejar sus menciones.

Corregido reescribiendo las tres menciones como prosa. Se congela la regla:

> **Una clave provisional no sobrevive a la verificación de su fuente**, ni
> siquiera como cita histórica. Si hay que mencionarla, se menciona sin
> comillas, como texto.

### Sobre el punto 7 · unidades

Conviven tres unidades y **ninguna ficha mezcla dos**:

| Unidad | Fichas | Fuentes |
|---|---|---|
| Kilogramos | 7 | Alemania, Colombia ×3 |
| Kilogramo-fuerza | 6 | Brasil |
| **Libras-fuerza** | 2 | Chile |

**Ninguna conversión, en ninguna dirección.** La comprobación se hizo leyendo
CN-06 de las quince fichas.

### Sobre el punto 8 · fabricantes

Aparecen seis fabricantes —Takei, Camry, JAMAR, Lafayette, Fred Sammons,
GENERAL ASDE— y los seis **solo** en CN-07 como identificación de instrumento.
Ninguno aparece en CN-21 como referencia, ni sostiene ninguna afirmación
normativa.

El caso más tentador era Camry: la fuente de Cúcuta describe el aparato por su
rango y su división, datos que proceden de su documentación comercial. Se
transcriben como **características del instrumento**, nunca como respaldo de la
norma.

### Sobre el punto 9 · derivaciones

| Derivación prohibida | ¿Ocurrió? |
|---|---|
| Percentiles derivados de media y DT | **No.** Y en `HGS-CO-UNI-TN2` está cerrado por evidencia expresa: la fuente declara que la distribución no es normal |
| L, M y S usados para calcular percentiles no tabulados | **No.** Las dos fichas chilenas lo prohíben explícitamente |
| Manos promediadas o combinadas | **No.** Cuatro pares de fichas separadas por lateralidad |
| Interpolación entre estratos de estatura | **No.** Seis fichas brasileñas independientes |
| Extensión de un rango etario | **No.** Brasil se corta en 90 aunque la tabla llegue a 95 |
| Fuentes combinadas para crear una norma | **No** |
| Valores corregidos por ser implausibles | **No.** Ver el punto siguiente |

### Sobre el punto 12 · trazabilidad

Ruta documental completa para las nueve fichas nuevas:

| Ficha | Ruta |
|---|---|
| `HGS-CO-CUC-TN1-D` | Norma → ficha → `bustos_viviescas_hgs_cucuta_2019` → MedUNAB 21(3):363-377 → Tabla 5 → valor |
| `HGS-CO-CUC-TN1-ND` | Ídem → Tabla 6 |
| `HGS-CO-UNI-TN1` | Norma → ficha → `vivas_diaz_hgs_universitarios_2016` → Nutr Hosp 33(2):330-336 → Tabla II, columnas P3–P97 → valor |
| `HGS-CO-UNI-TN2` | Ídem → Tabla II, columnas *Mean* y *SD* |
| Las 5 fichas `HGS-BR-*` nuevas | Norma → ficha → `reichenheim_hgs_brasil_2021` → PLOS ONE 16(5):e0250925 → tabla suplementaria S2 a S6 → valor |

Todas las tablas se leyeron en su **fichero original**: PDF de la editorial en
los dos casos colombianos y DOCX suplementario en los cinco brasileños. Ningún
valor procede de resumen, artículo secundario, captura, repositorio de terceros
ni texto generado.

---

## Verificación mecánica de los valores

No basta con declarar que se transcribió bien. Las 202 normas nuevas se
compararon **celda a celda** con su fichero fuente mediante extracción
automática:

| Bloque | Filas | Celdas | Discrepancias |
|---|---|---|---|
| Brasil · 5 estratos nuevos | 130 | 1 690 | **0** |
| Cúcuta · mano dominante | 12 | 84 | **0** |
| Cúcuta · mano no dominante | 12 | 84 | **0** |
| Universitarios · percentiles | 24 | 168 | **0** |
| Universitarios · media y DT | 24 | 48 | **0** |
| **Reverificación** de `HGS-BR-TN1` (NKB-3.1) | 26 | 338 | **0** |
| **Reverificación** de las 2 fichas chilenas (NKB-3.3) | 48 | 432 | **0** |

Las dos comprobaciones de Cúcuta se hicieron **posición a posición y por
página**, no por coincidencia de valores, para descartar que las tablas de mano
dominante y no dominante estuvieran intercambiadas.

---

## Comprobaciones específicas de este sprint

| # | Riesgo | Resultado |
|---|---|---|
| 1 | **Declarar un conflicto sin poder comprobar el método** | ✅ No ocurrió. La candidata queda nombrada, no declarada |
| 2 | **Admitir una fuente débil porque el producto la necesita** | ✅ No ocurrió. Cúcuta entró por cumplir los ocho criterios y salió con calidad **Baja** declarada en cada norma |
| 3 | **Presentar una muestra regional como norma nacional** | ✅ No ocurrió. La ficha dice «de la ciudad de Cúcuta» y cita la advertencia literal de la fuente |
| 4 | **Presentar universitarios como población adulta general** | ✅ No ocurrió |
| 5 | **Corregir un valor internamente imposible** | ✅ No ocurrió. Se transcribió y se marcó ES-2 |
| 6 | **Importar categorías nombradas** | ✅ No ocurrió. RN-04 |
| 7 | **Convertir «no accesible» en «no cumple»** | ✅ No ocurrió. Tres fuentes siguen en E-1/E-2 con el motivo exacto y qué haría falta |
| 8 | **Convertir «no encontrado» en «no existe»** | ✅ No ocurrió. Ninguna deuda científica declarada |
| 9 | **Tratar dos Takei como el mismo método** | ✅ No ocurrió. TKK 5101 digital y T-18 SMEDLY III analógico son métodos distintos |
| 10 | **Encadenar las tres normas colombianas en una curva de 6 a 69 años** | ✅ No ocurrió. Tres instrumentos, tres poblaciones, no se relevan |

El segundo era el riesgo real de este sprint. El producto lleva dos sprints
pidiendo una norma adulta colombiana, y la que apareció es de calidad Baja. **Se
admitió tal cual y se etiquetó tal cual**, en lugar de suavizar la etiqueta o
de rechazarla por incómoda.

---

## Estados normativos en uso

| Estado | Normas | Primera vez |
|---|---|---|
| **ES-1 · Activa** | 351 | NKB-3.0 |
| **ES-2 · Cuestionada** | **5** | **NKB-3.4** |
| ES-3 · Pendiente de verificación | 0 | — |
| ES-4 · Sustituida | 0 | — |
| ES-5 · Retirada | 0 | — |

Tres de los cinco estados siguen sin ejercitarse. Es coherente: **ES-4 y ES-5
requieren que algo salga**, y en cuatro sprints no ha salido nada. ES-3 requiere
que cambien los criterios de admisión, y siguen congelados desde NKB-2.0.

---

## Calidad de las 356 normas

| Nivel | Normas | Fichas |
|---|---|---|
| Alta | **0** | — |
| Moderada | 332 | 13 |
| **Baja** | **24** | 2 · Cúcuta |
| Muy baja | 0 | — |

**Ninguna norma de la base alcanza calidad Alta**, y llevan cuatro sprints sin
alcanzarla. El motivo es siempre el mismo: o el muestreo no sostiene
representatividad, o falta el N por celda, o los percentiles son modelados. No
es un defecto de la literatura sino del nivel: *Alta* exige las tres cosas a la
vez.

Que la base no tenga ninguna norma Alta **es en sí un dato para el NIE**, y debe
llegarle.

---

## Ámbito tocado

| Comprobación | Resultado |
|---|---|
| Ficheros modificados fuera de `docs/normative-knowledge-base/` | **0** |
| Código de producción creado o modificado | **0** |
| SQL, UI o migraciones | **0** |
| Criterios NKB-2 modificados | **0** · CA, CN, E, I y ADR intactos |
| Suite de pruebas | **1 053 / 1 053** |
