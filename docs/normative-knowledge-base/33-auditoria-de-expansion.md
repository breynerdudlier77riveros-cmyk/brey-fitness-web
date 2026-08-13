---
modulo: 33
titulo: Auditoría de expansión y cierre de NKB-3.3
estado: v1.0
sprint: NKB-3.3
---

# 33 · Auditoría de expansión

Auditoría de las 154 normas de la base tras la expansión de cobertura. Amplía
la de `30` en vez de sustituirla.

---

## Tabla completa del dominio

| Ficha | Variable | Método | Población | Estrato | Tipo | Normas | Unidad | Fuente | Estado | Calidad | Aplicabilidad | Conflicto |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `HGS-DE-TN2` | Prensión | Smedley S mecánico; máx. de 2 intentos por mano | Alemania 17–90, panel socioeconómico, excluido el 5% de peor salud física autopercibida | Sexo × 14 grupos | TN-2 | 28 | kg | `steiber_hgs_alemania_2016` | ES-1 | Moderada (D-03, D-05) | Solo esa población | Ninguno |
| `HGS-DE-TN1` | Prensión | Ídem | Ídem | Sexo × 14 grupos | TN-1 (P50) | 28 | kg | `steiber_hgs_alemania_2016` | ES-1 | Moderada (D-03, D-05) | Solo esa población | Ninguno |
| `HGS-BR-TN1` | Prensión | JAMAR J00105 hidráulico; media de 2.ª y 3.ª de 3 | Brasil 65–90, envejecimiento satisfactorio | Varones > 1,70 m × 26 edades | TN-1 (13 pct) | 26 | kgf | `reichenheim_hgs_brasil_2021` | ES-1 | Moderada (D-02, D-05) | Solo esa población y ese estrato | Ninguno |
| `HGS-CO-TN1` | Prensión · media de ambas manos | Takei TKK 5101 digital, bipedestación; mayor por mano | Colombia 6–17,9, civil no institucionalizada | Sexo × 12 edades | TN-1 (7 pct) | kg | `martinez_torres_hgs_colombia_2022` | ES-1 | Moderada (D-02, D-04) | **Población objetivo de BREY, franja 6–17,9** | Ninguno |
| `HGS-CL-TN1-D` | Prensión · mano derecha | JAMAR PC-5030 J1 hidráulico, sedestación; mejor de 2 | Chile 6–17,9, escolares de 12 centros públicos del Maule | Sexo × 12 edades | TN-1 (9 pct) | **lbf** | `gomez_campos_hgs_chile_2018` | ES-1 | Moderada (D-01, D-04) | Solo esa población | Ninguno |
| `HGS-CL-TN1-I` | Prensión · mano izquierda | Ídem | Ídem | Sexo × 12 edades | TN-1 (9 pct) | **lbf** | `gomez_campos_hgs_chile_2018` | ES-1 | Moderada (D-01, D-04) | Solo esa población | Ninguno |

**Total: 154 normas · 1 variable · 4 métodos · 4 poblaciones · 3 unidades ·
6 fichas.**

---

## C1 · Referencias

| Comprobación | Resultado |
|---|---|
| Referencias colgantes | **0** |
| Referencias huérfanas | **0** |
| Claves duplicadas | **0** |
| Normas sin referencia | **0** |

Dieciséis claves registradas: 4 admitidas hasta E-5, 1 verificada y no admitida,
2 detenidas en E-2, 8 localizadas sin verificar, 1 rechazada por naturaleza. Las
dieciséis aparecen citadas en `28` o en `32`.

## C2 · Contratos

| Ficha | Campos CN |
|---|---|
| `HGS-DE-TN2` · `HGS-DE-TN1` · `HGS-BR-TN1` | 40/40 (verificado en `30`) |
| `HGS-CO-TN1` | **40/40** |
| `HGS-CL-TN1-D` | **40/40** |
| `HGS-CL-TN1-I` | **40/40** |

Las dos fichas chilenas comparten fuente y muestra, y **ninguna hereda campos de
la otra**: cada una repite protocolo, población y muestreo completos. Es la
misma regla que obligó a corregir `HGS-DE-TN1` en NKB-3.2.

## C3 · Identidad

Las cuatro coordenadas son explícitas en las seis fichas. Ninguna etiqueta
genérica sobrevive:

- No aparece «niños colombianos»: aparece «población civil no institucionalizada
  de Colombia, 6 a 17,9 años, residente habitual del hogar».
- No aparece «escolares chilenos»: aparece «escolares de 12 establecimientos
  públicos de la Región del Maule».
- **No aparece «Latinoamérica» como población en ninguna ficha.** No es un
  conjunto de criterios de inclusión (`17`).

## C4 · Tipos

Cada ficha declara exactamente un tipo. Ningún tipo se derivó de otro. La
separación en dos fichas chilenas obedece a la definición operacional, no al
tipo: ambas son TN-1.

## C5 · Valores

| Ficha | Ruta documental |
|---|---|
| `HGS-CO-TN1` | Norma → ficha → `martinez_torres_hgs_colombia_2022` → *J Pediatr (Rio J)* 98:590-598 → Tabla 2, columnas de fuerza absoluta → valor |
| `HGS-CL-TN1-D` | Norma → ficha → `gomez_campos_hgs_chile_2018` → PLOS ONE 13(8):e0201033 → Tabla 3, bloque *HGS right* → valor |
| `HGS-CL-TN1-I` | Ídem → bloque *HGS left* |

Ambas tablas se leyeron en el documento original —la chilena, extraída del
fichero XML del artículo—. Ningún valor procede de resumen, artículo secundario,
captura, herramienta comercial ni texto generado.

## C6 · Método

| Comprobación | Resultado |
|---|---|
| Equivalencias asumidas entre dinamómetros | **0** |
| Relaciones declaradas | **EQ-3 · distintos**, en todos los pares |
| Normas comparadas entre métodos | **0** |
| Instrumentos de la misma marca tratados como el mismo método | **0** |

La última es nueva. Las fichas brasileña y chilena usan ambas un dinamómetro
**JAMAR hidráulico**, y son métodos distintos: modelos distintos (J00105 y
PC-5030 J1), posición distinta, número de intentos distinto y consolidación
distinta. Tratarlas como comparables por compartir marca sería exactamente el
error que `18` describe.

## C7 · Población

Sexo, edad, criterios de inclusión y exclusión, contexto geográfico y
estratificación constan según lo publicado. Los acotamientos decisivos, todos
declarados en su ficha:

- **Alemania** excluye el 5% con peor puntuación en salud física autopercibida.
- **Brasil** exige envejecimiento satisfactorio y estatura superior a 1,70 m.
- **Colombia** no declara criterios de exclusión, y así consta (D-04).
- **Chile** excluye fumadores y a quien no obtuvo consentimiento parental, y
  cubre solo el sector público de una región.

## C8 · Alcance

Cada ficha declara dónde aplica y dónde no. Ninguna se extrapola a otros países,
poblaciones, dinamómetros, unidades ni a los grupos que cada estudio excluyó.

Las dos fichas chilenas declaran además que **no se combinan entre sí**.

## C9 · Conflictos

**Ninguno**, buscado deliberadamente y documentado en `32`. El par más próximo
coincide en cuatro elementos y difiere en cinco.

No se creó ningún valor de consenso ni norma fusionada.

## C10 · Rechazos

| Rechazo | Nivel | Criterio | Estado |
|---|---|---|---|
| RN-01 · medias sin dispersión en el estrato | E-4 | CA-07 | Sigue rechazada |
| RN-02 · columna «risk threshold» | E-4 | CA-07 | Sigue rechazada |
| RN-03 · categorías ambiguas | E-4 | CA-07 | Sigue rechazada |
| `tomkinson_normas_internacionales_2024` | E-4 | CA-05 | Sigue no admitida |
| `rechazada_sitio_divulgacion_hgs` | E-1 | CA-02 | Sigue rechazada |

Ninguno se ha borrado ni suavizado. Ninguno se revisó buscando una razón para
admitirlo.

---

## Comprobaciones específicas de la expansión

Cinco riesgos que solo aparecen cuando la base crece por cobertura geográfica.

| # | Riesgo | Resultado |
|---|---|---|
| 1 | **Admitir una fuente por su país** en vez de por sus criterios | ✅ No ocurrió. La colombiana pasó los ocho criterios; dos colombianas muy pertinentes se quedaron en E-2 pese a su procedencia |
| 2 | **Tratar una región como una población** | ✅ No ocurrió. «Latinoamérica» no aparece como población en ninguna ficha |
| 3 | **Rellenar un hueco con la norma más parecida** | ✅ No ocurrió. La franja adulta colombiana sigue vacía, teniendo cinco normas adultas disponibles en la base |
| 4 | **Convertir unidades** para poder comparar | ✅ No ocurrió. kg, kgf y lbf conviven sin conversión |
| 5 | **Fusionar mano derecha e izquierda** en una sola norma | ✅ No ocurrió. Dos fichas separadas |

El tercero es el que más presión tenía. Es literalmente el escenario que motivó
todo el sprint: hay una persona adulta colombiana, hay cinco normas adultas en
la base, y la respuesta correcta es **ninguna**.

---

## Los quince criterios de cierre

Reaplicados a las 154 normas.

| # | Criterio | Resultado |
|---|---|---|
| 1 | Fuentes pendientes resueltas o documentadas como deuda | ✅ 2 nuevas admitidas · 10 documentadas con tipo de deuda |
| 2 | Normas cumplen CN-01…CN-40 | ✅ 6/6 fichas al 40/40 |
| 3 | Referencias colgantes | ✅ 0 |
| 4 | Referencias huérfanas | ✅ 0 |
| 5 | Ids duplicados | ✅ 0 de 154 |
| 6 | Valores trazables a primaria | ✅ 6/6 fichas |
| 7 | Normas derivadas artificialmente | ✅ 0 |
| 8 | Fabricante como autoridad | ✅ 0 · Takei y JAMAR aparecen como instrumento, nunca como fuente |
| 9 | Percentil convertido en punto de corte | ✅ 0 |
| 10 | Promedio de estudios como norma | ✅ 0 |
| 11 | Conflictos reales conservados sin resolver | ✅ no hay ninguno; buscado deliberadamente |
| 12 | Diferencias legítimas no etiquetadas como conflicto | ✅ demostrado en dos pares nuevos |
| 13 | Limitaciones poblacionales y metodológicas declaradas | ✅ en las seis fichas |
| 14 | Rechazos importantes registrados | ✅ 5 conservados · 2 nuevas detenciones en E-2 |
| 15 | Criterios NKB-2 no modificados | ✅ ninguno |

**Tres comprobaciones añadidas en este sprint:**

| # | Criterio | Resultado |
|---|---|---|
| 16 | Ninguna norma admitida por relevancia geográfica | ✅ |
| 17 | Ninguna unidad convertida | ✅ |
| 18 | Ningún hueco rellenado con población ajena | ✅ |

---

## Qué desbloquea al futuro NIE

| Puede usar | Todavía no |
|---|---|
| 154 normas con población, método, estrato y unidad declarados | Ninguna norma para adulto colombiano |
| Percentiles reales para niños y adolescentes colombianos, 6–17,9, ambos sexos | Aplicarlos a nadie medido con otro dinamómetro o en sedestación |
| Cuatro poblaciones y cuatro métodos, explícitamente no comparables | Compararlos: la relación es EQ-3 en todos los pares |
| Percentiles chilenos por mano, con L, M y S | Calcular percentiles que la fuente no tabula, o promediar las dos manos |
| Media y dispersión para la población alemana | Derivar percentiles de ella: la forma de la distribución no consta |
| Limitaciones y alcance por norma | Cualquier punto de corte: no hay ninguno admitido |

El NIE recibe además, y esto es lo que este sprint añade: **la obligación de
responder «no existe norma admisible para esta persona» cuando así sea, teniendo
otras normas a la vista.** Es la respuesta que la base está ahora en condiciones
de exigirle, porque el caso es real y está documentado en `31`.
