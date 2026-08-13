---
modulo: 30
titulo: Auditoría de dominio y cierre
estado: v1.0
sprint: NKB-3.2
---

# 30 · Fase B · Auditoría de dominio

Auditoría completa del dominio de fuerza de prensión manual contra los quince
criterios de cierre.

---

## Tabla del dominio

| Ficha | Variable | Método | Población | Estrato | Tipo | Normas | Fuente | Estado | Evidencia | Aplicabilidad | Limitaciones | Conflicto |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `HGS-DE-TN2` | Fuerza de prensión | Smedley S mecánico; máx. de 2 intentos por mano | Alemania 17–90, panel socioeconómico, excluido el 5% de peor salud física autopercibida | Sexo × 14 grupos de edad | TN-2 | 28 | `steiber_hgs_alemania_2016` | ES-1 | Moderada (D-03, D-05) | Solo esa población | Protocolo incompleto; forma de distribución no consta; sin estandarizar por altura | Ninguno |
| `HGS-DE-TN1` | Fuerza de prensión | Ídem | Ídem | Sexo × 14 grupos de edad | TN-1 (solo P50) | 28 | `steiber_hgs_alemania_2016` | ES-1 | Moderada (D-03, D-05) | Solo esa población | Un único percentil | Ninguno |
| `HGS-BR-TN1` | Fuerza de prensión | JAMAR hidráulico J00105; media de 2.ª y 3.ª de 3 | Brasil 65–90, envejecimiento satisfactorio | Varones > 1,70 m × edad año a año | TN-1 | 26 | `reichenheim_hgs_brasil_2021` | ES-1 | Moderada (D-02, D-05) | Solo esa población y ese estrato | N por celda no consta; percentiles modelados; 1 de 6 estratos leídos | Ninguno |

**Total: 82 normas · 1 variable · 2 métodos · 2 poblaciones · 3 fichas.**

---

## B1 · Referencias

| Comprobación | Resultado |
|---|---|
| Referencias colgantes | **0** |
| Referencias huérfanas | **0** |
| Claves duplicadas | **0** |
| Normas sin referencia | **0** |

Siete claves registradas: 2 admitidas hasta E-5, 1 verificada y no admitida, 3
pendientes, 1 rechazada por naturaleza. Las siete aparecen citadas.

## B2 · Contratos

| Ficha | Campos CN |
|---|---|
| `HGS-DE-TN2` | 40/40 |
| `HGS-DE-TN1` | 40/40 |
| `HGS-BR-TN1` | 40/40 |

Ninguna ficha hereda campos de otra. La `HGS-DE-TN1` los enumeraba por rango en
NKB-3 y se corrigió: **una ficha debe ser autosuficiente documentalmente**.

## B3 · Identidad

Las cuatro coordenadas son explícitas en las tres fichas. Ninguna usa
etiquetas genéricas:

- No aparece «adultos» a secas: aparece el rango etario y el marco muestral.
- No aparece «personas sanas»: aparecen los criterios concretos de cada estudio,
  incluida la exclusión por salud física autopercibida en Alemania y los
  criterios de envejecimiento satisfactorio en Brasil.
- No aparece «población general».

## B4 · Tipos

Cada ficha declara **exactamente un tipo**. La separación entre `HGS-DE-TN2` y
`HGS-DE-TN1` existe precisamente por esto: la misma fuente publica media con
dispersión y mediana, y son dos normas, no una.

Ningún tipo se derivó de otro.

## B5 · Valores

Ruta documental completa para las tres fichas:

| Ficha | Ruta |
|---|---|
| `HGS-DE-TN2` | Norma → ficha → `steiber_hgs_alemania_2016` → PLOS ONE 11(10):e0163917 → Tabla suplementaria S3 → valor |
| `HGS-DE-TN1` | Ídem → columna P50 de la misma tabla |
| `HGS-BR-TN1` | Norma → ficha → `reichenheim_hgs_brasil_2021` → PLOS ONE 16(5):e0250925 → Tabla suplementaria S1 → valor |

Ambas tablas suplementarias se **extrajeron de sus ficheros originales** y se
transcribieron desde ahí. Ningún valor procede de resumen, artículo secundario,
captura, herramienta comercial ni texto generado.

## B6 · Método

| Comprobación | Resultado |
|---|---|
| Equivalencias asumidas entre dinamómetros | **0** |
| Relación declarada entre Smedley S y JAMAR | **EQ-3 · distintos** |
| Normas comparadas entre métodos | **0** |

La relación por defecto se aplicó sin excepción. No se buscó evidencia de
equivalencia porque no se necesitaba: sin ella, EQ-3 es el estado correcto.

## B7 · Población

Sexo, edad, criterios de inclusión y exclusión, contexto geográfico y
estratificación constan según lo publicado. Ninguna población se convirtió en
universal.

Los dos acotamientos decisivos están declarados en sus fichas y repetidos aquí
porque son los que más fácilmente se pierden al usar la norma:

- **Alemania** excluye el 5% con peor puntuación en la escala de componente
  físico del cuestionario de salud.
- **Brasil** exige envejecimiento satisfactorio: preservación cognitiva,
  velocidad de marcha e independencia funcional.

## B8 · Alcance

Cada ficha declara dónde aplica y dónde no. Ninguna se extrapola a otros países,
otras poblaciones, otros dinamómetros ni a los grupos que cada estudio excluyó.

## B9 · Conflictos

**Ninguno, y está documentado por qué** (`29`, A3–A4): las dos fuentes admitidas
difieren en método, definición operacional, unidad, población y estratificación.

No se creó ningún valor de consenso ni norma fusionada.

## B10 · Rechazos

Conservados con fuente, criterio, nivel y motivo:

| Rechazo | Nivel | Criterio |
|---|---|---|
| RN-01 · medias sin dispersión en el estrato | E-4 | CA-07 |
| RN-02 · columna «risk threshold» | E-4 | CA-07 |
| RN-03 · categorías ambiguas | E-4 | CA-07 |
| `tomkinson_normas_internacionales_2024` | E-4 | CA-05 |
| `rechazada_sitio_divulgacion_hgs` | E-1 | CA-02 |

Ninguno se ha borrado ni suavizado.

---

## Los quince criterios de cierre

| # | Criterio | Resultado |
|---|---|---|
| 1 | Fuentes pendientes resueltas o documentadas como deuda | ✅ 2 resueltas, 3 documentadas con tipo de deuda |
| 2 | Normas cumplen CN-01…CN-40 | ✅ 3/3 fichas al 40/40 |
| 3 | Referencias colgantes | ✅ 0 |
| 4 | Referencias huérfanas | ✅ 0 |
| 5 | Ids duplicados | ✅ 0 de 82 |
| 6 | Valores trazables a primaria | ✅ ambas tablas extraídas de su fichero original |
| 7 | Normas derivadas artificialmente | ✅ 0 |
| 8 | Fabricante como autoridad | ✅ 0 |
| 9 | Percentil convertido en punto de corte | ✅ 0 · RN-02 lo impidió |
| 10 | Promedio de estudios como norma | ✅ 0 · la revisión internacional no entró |
| 11 | Conflictos reales conservados sin resolver | ✅ no hay ninguno; documentado |
| 12 | Diferencias legítimas no etiquetadas como conflicto | ✅ demostrado en A5 |
| 13 | Limitaciones poblacionales y metodológicas declaradas | ✅ en las tres fichas |
| 14 | Rechazos importantes registrados | ✅ 5 |
| 15 | Criterios NKB-2 no modificados | ✅ ninguno |

---

## Deudas del dominio

| Tipo | Deuda |
|---|---|
| **Búsqueda** | 3 fuentes en E-1 sin verificar · 5 de los 6 estratos brasileños sin transcribir |
| **Acceso** | 1 fuente de acceso restringido: no puede evaluarse su contenido |
| **Científica** | Ninguna variable del dominio quedó sin norma por ausencia demostrada de evidencia |
| **Estructural** | El modelo de conflictos sigue sin ejercitarse, y `29` argumenta que puede seguir así por diseño |

**No hay deuda científica en este dominio.** Todo lo que falta falta por trabajo
pendiente o por acceso, no porque se haya comprobado que la evidencia no existe.
La distinción es la que I-14 exige mantener.

## Qué desbloquea al futuro NIE

| Puede usar | Todavía no |
|---|---|
| 82 normas con población, método y estrato declarados | Ninguna norma fuera de Alemania y Brasil |
| Dos poblaciones y dos métodos, explícitamente no comparables | Comparar entre ellas: la relación es EQ-3 |
| Percentiles reales para un estrato brasileño | Percentiles para el resto de estratos |
| Media y dispersión para la población alemana | Derivar percentiles de ella: la forma de la distribución no consta |
| Limitaciones y alcance por norma | Cualquier punto de corte: no hay ninguno admitido |
| La mediana alemana | Convertirla en categoría |

El NIE recibirá, además, dos cosas que no son valores y le hacen falta igual:
**la lista de lo que no puede afirmar** y **la obligación de comprobar
pertenencia poblacional antes de aplicar nada**.
