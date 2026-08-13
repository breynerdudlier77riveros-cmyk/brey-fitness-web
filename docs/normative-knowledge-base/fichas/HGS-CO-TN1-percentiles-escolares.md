---
ficha: HGS-CO-TN1
tipo_norma: TN-1
estado: ES-2
referencia: martinez_torres_hgs_colombia_2022
sprint: NKB-3.3 · estado revisado en NKB-3.5
---

# Ficha · Fuerza de prensión manual · percentiles · niños y adolescentes de Colombia

**24 normas** —12 grupos de edad × 2 sexos— cada una con 7 percentiles.

> ## ⚠ Las 24 normas están en ES-2 · Cuestionada
>
> **Otro análisis publicado de las mismas mediciones estima estos percentiles con
> valores distintos**, y la diferencia llega a **4,5 kg (24%) en el P50 de los
> varones de 12 años**. Lo declara la propia fuente admitida.
>
> Las dos normas proceden de la ENSIN-2015 y comparten las cuatro coordenadas de
> identidad; solo difieren en el estimador —regresión cuantílica frente a LMS—,
> que la identidad normativa no captura.
>
> **Estas normas pueden aplicarse, y solo con esta advertencia delante** (`23`).
> No se ha elegido cuál de las dos es correcta y no se elegirá: ninguna lo es
> más que la otra. Detalle completo, con las 24 diferencias medidas, en `40`.

> **Primera norma colombiana de la NKB.** Su procedencia geográfica **no fue el
> motivo de su admisión**: entró por cumplir los ocho criterios, igual que
> cualquier otra. La relevancia geográfica afecta a la aplicabilidad, no a la
> admisibilidad (`31`).

---

## Bloque A · Identidad

| Campo | Contenido |
|---|---|
| **CN-01 Variable** | Fuerza máxima de prensión manual, absoluta |
| **CN-02 Definición operacional** | Media de los valores de ambas manos, tomando en cada mano el mayor de sus intentos |
| **CN-03 Método** | Dinamometría digital con Takei TKK 5101 |
| **CN-04 Población** | Población civil no institucionalizada de Colombia, 6 a 17,9 años, residente habitual del hogar |
| **CN-05 Estrato** | Sexo × 12 grupos de edad de un año |

## Bloque B · Medida

| Campo | Contenido |
|---|---|
| **CN-06 Unidad** | Kilogramos |
| **CN-07 Instrumento** | Takei TKK 5101 (Takei Scientific Instruments, Tokio), rango 5–100 kg, precisión ±0,1 kg |
| **CN-08 Parámetros del protocolo** | Bipedestación; hombro en aducción y rotación neutra; brazos perpendiculares sin contacto con el cuerpo; pies a la anchura de las caderas; brazo extendido lateralmente sin tocar el tronco; 2 o 3 intentos por mano; en cada mano se toma el mayor |

## Bloque C · Distribución

| Campo | Contenido |
|---|---|
| **CN-09 Tipo** | TN-1 · percentiles |
| **CN-10 Estadísticos** | 7 percentiles por celda: P5 · P10 · P25 · P50 · P75 · P90 · P95, con N |
| **CN-11 Forma de la distribución** | No se asume. **Método de estimación: regresión cuantílica**, que estima cada percentil sin suponer una forma. El estimador es decisivo aquí: otro análisis de los mismos datos usó LMS y obtuvo valores distintos (`40`) |
| **CN-12 Clasificación** | No aplica: **la fuente no define ninguna categoría** |

## Bloque D · Población y muestra

| Campo | Contenido |
|---|---|
| **CN-13 Inclusión** | Población civil no institucionalizada; residentes habituales del hogar; 6 a 17,9 años |
| **CN-14 Exclusión** | **No detallada explícitamente por la fuente.** Se declara la ausencia |
| **CN-15 Tamaño por estrato** | Publicado por celda (columna n) |
| **CN-16 Muestreo** | Análisis secundario de la Encuesta Nacional de la Situación Nutricional de 2015, de alcance nacional |
| **CN-17 Sexo** | Estratificado: 1 575 varones (59,5%), 1 072 mujeres (40,5%) |
| **CN-18 Edad** | 12 grupos de un año, de 6,0 a 17,9 |
| **CN-19 Nivel de práctica** | No es criterio de esta población |
| **CN-20 Contexto** | Colombia, muestra nacional; 72,9% de residencia urbana. Datos recogidos en 2015 |

## Bloque E · Procedencia

| Campo | Contenido |
|---|---|
| **CN-21 Referencia** | `martinez_torres_hgs_colombia_2022` |
| **CN-22 Identificador persistente** | Registrado en la referencia |
| **CN-23 Fecha de publicación** | 2022 |
| **CN-24 Naturaleza** | Estudio original · análisis secundario de encuesta poblacional |
| **CN-25 Cadena** | Ninguna: acceso directo a la primaria |
| **CN-26 Ubicación del dato** | Tabla 2, «Sex and age-specific percentile values using quantile regression for the absolute handgrip strength and relative handgrip strength (using mean value of each subject) among Colombian aged 6–17.9 years», columnas de fuerza absoluta |

## Bloque F · Estado y calidad

| Campo | Contenido |
|---|---|
| **CN-27 Estado** | **ES-2 · Cuestionada** desde NKB-3.5. Objeción registrada y sin resolver: otro análisis de las mismas mediciones publica valores distintos (`40`) |
| **CN-28 Estado de la fuente** | Vigente; sin retractación ni corrección localizada. La discrepancia **no es un error** de esta fuente: ella misma la documenta |
| **CN-29 Calidad** | **Moderada** |
| **CN-30 Dimensiones que la degradaron** | D-02: varias celdas tienen N inferior a 60 y la fuente no advierte sobre ello. D-04: los criterios de exclusión no constan |
| **CN-31 Confianza de la admisión** | **Alta.** Metadatos, protocolo, criterios y las 24 filas de valores leídos directamente en el documento |

> **Por qué no alcanza calidad alta.** Su muestreo procede de una encuesta
> nacional —lo que la sitúa por encima de las otras dos fuentes en
> representatividad— y su método de estimación no exige suponer la forma de la
> distribución. La frenan dos cosas: la ausencia de criterios de exclusión y
> el tamaño reducido de las celdas de menor edad (`16`, D-02 y D-04).

## Bloque G · Alcance y límites

| Campo | Contenido |
|---|---|
| **CN-32 Limitaciones de la fuente** | Es un análisis secundario: el protocolo lo fijó la encuesta, no el estudio |
| **CN-33 Limitaciones añadidas** | Criterios de exclusión no declarados; celdas de 6 a 12 años con N entre 52 y 79; datos de 2015; no cubre adultos |
| **CN-34 Alcance** | Niños y adolescentes de 6 a 17,9 años residentes en Colombia, población civil no institucionalizada |
| **CN-35 Origen del dato** | OR-1 · Explícito en la Tabla 2 |

## Bloque H · Traza

| Campo | Contenido |
|---|---|
| **CN-36 Incorporó** | Sprint NKB-3.3 |
| **CN-37 Fecha** | 2026-08-09 |
| **CN-38 Versión de criterios** | NKB-2.0 |
| **CN-39 Conflictos** | **Discrepancia real y verificada** con `ramirez_velez_hgs_colombia_6_64_2021`, que analiza las mismas mediciones de la ENSIN-2015 con otro estimador y publica valores distintos. No se registra como conflicto formal porque esa norma no está admitida (E-2 · CA-07). **No se ha resuelto y no se resolverá por preferencia** (`40`). Con las normas chilenas **no hay conflicto**: coinciden en variable, rango etario y estratificación, y difieren en población, método, instrumento, definición operacional y unidad |
| **CN-40 Sustitución** | Ninguna. **No sustituye a las normas alemanas, brasileñas ni chilenas**: son poblaciones y métodos distintos |

---

## Las 24 normas · percentiles en kg

Fuerza absoluta, valor medio de ambas manos. Valores tal como los publica la
Tabla 2.

### Varones

| Id | Edad | n | P5 | P10 | P25 | P50 | P75 | P90 | P95 |
|---|---|---|---|---|---|---|---|---|---|
| HGS-CO-M-06 | 6,0–6,9 | 54 | 6,5 | 6,7 | 7,4 | 8,7 | 10,5 | 13,9 | 15,0 |
| HGS-CO-M-07 | 7,0–7,9 | 52 | 8,2 | 8,8 | 9,9 | 9,9 | 10,8 | 12,7 | 14,3 |
| HGS-CO-M-08 | 8,0–8,9 | 60 | 8,0 | 8,0 | 9,9 | 11,3 | 13,6 | 16,2 | 20,5 |
| HGS-CO-M-09 | 9,0–9,9 | 64 | 9,3 | 10,4 | 11,3 | 14,0 | 14,7 | 15,1 | 15,5 |
| HGS-CO-M-10 | 10,0–10,9 | 67 | 10,9 | 11,7 | 13,5 | 14,3 | 15,5 | 18,0 | 19,4 |
| HGS-CO-M-11 | 11,0–11,9 | 58 | 11,8 | 12,8 | 14,6 | 16,1 | 18,9 | 22,2 | 23,2 |
| HGS-CO-M-12 | 12,0–12,9 | 57 | 10,4 | 14,5 | 15,0 | 18,5 | 21,0 | 25,3 | 31,0 |
| HGS-CO-M-13 | 13,0–13,9 | 244 | 14,4 | 15,8 | 19,6 | 23,2 | 27,5 | 31,7 | 33,7 |
| HGS-CO-M-14 | 14,0–14,9 | 216 | 18,8 | 19,7 | 21,9 | 26,5 | 31,3 | 34,7 | 36,7 |
| HGS-CO-M-15 | 15,0–15,9 | 230 | 20,3 | 23,3 | 26,6 | 30,7 | 36,3 | 39,0 | 42,8 |
| HGS-CO-M-16 | 16,0–16,9 | 252 | 24,5 | 27,3 | 30,5 | 34,2 | 38,3 | 41,9 | 43,9 |
| HGS-CO-M-17 | 17,0–17,9 | 221 | 24,2 | 27,1 | 30,1 | 35,7 | 39,4 | 44,7 | 47,8 |

### Mujeres

| Id | Edad | n | P5 | P10 | P25 | P50 | P75 | P90 | P95 |
|---|---|---|---|---|---|---|---|---|---|
| HGS-CO-F-06 | 6,0–6,9 | 66 | 5,7 | 5,9 | 6,7 | 7,8 | 10,7 | 12,4 | 14,6 |
| HGS-CO-F-07 | 7,0–7,9 | 72 | 7,1 | 7,6 | 8,3 | 8,3 | 9,7 | 11,0 | 11,1 |
| HGS-CO-F-08 | 8,0–8,9 | 64 | 6,4 | 6,8 | 7,4 | 9,9 | 12,8 | 15,4 | 16,1 |
| HGS-CO-F-09 | 9,0–9,9 | 60 | 8,6 | 8,8 | 9,4 | 11,5 | 12,9 | 15,5 | 17,1 |
| HGS-CO-F-10 | 10,0–10,9 | 63 | 10,1 | 10,7 | 12,9 | 14,4 | 16,9 | 19,0 | 20,9 |
| HGS-CO-F-11 | 11,0–11,9 | 79 | 10,8 | 10,8 | 12,1 | 13,6 | 16,2 | 20,1 | 21,9 |
| HGS-CO-F-12 | 12,0–12,9 | 65 | 12,3 | 13,9 | 14,3 | 18,5 | 20,7 | 23,8 | 27,7 |
| HGS-CO-F-13 | 13,0–13,9 | 136 | 11,8 | 13,8 | 16,9 | 19,9 | 22,0 | 24,4 | 25,6 |
| HGS-CO-F-14 | 14,0–14,9 | 108 | 11,0 | 13,5 | 16,1 | 20,1 | 23,6 | 26,6 | 33,6 |
| HGS-CO-F-15 | 15,0–15,9 | 115 | 15,0 | 15,9 | 18,3 | 21,1 | 23,9 | 26,8 | 28,8 |
| HGS-CO-F-16 | 16,0–16,9 | 132 | 14,1 | 15,9 | 18,2 | 22,3 | 26,1 | 29,4 | 30,2 |
| HGS-CO-F-17 | 17,0–17,9 | 112 | 14,4 | 14,6 | 19,4 | 23,2 | 25,0 | 25,8 | 27,4 |

## Anomalías conservadas

Se transcriben tal como aparecen publicadas, **sin corregir**:

- Varones de 7,0–7,9: P25 y P50 coinciden en 9,9.
- Mujeres de 7,0–7,9: P25 y P50 coinciden en 8,3.
- Mujeres de 11,0–11,9: P5 y P10 coinciden en 10,8.
- Varones de 8,0–8,9: P5 y P10 coinciden en 8,0.
- Varones de 9,0–9,9: los percentiles altos se comprimen (P75 14,7 · P90 15,1 · P95 15,5), y el P50 de 14,0 queda por encima del P75 del grupo de 10 años.

Son consecuencia de estimar cuantiles en celdas pequeñas. **No se suavizan, no
se corrigen y no se sustituyen por una curva ajustada:** hacerlo sería fabricar
valores que la fuente no publicó (`21`).

## Lo que estas normas NO permiten afirmar

1. **No cubren adultos.** El límite superior es 17,9 años.
2. **No son comparables** con las normas alemanas, brasileñas ni chilenas:
   dinamómetro, protocolo, definición operacional y población distintos.
   **EQ-3**. Que las chilenas cubran exactamente el mismo rango de edad y la
   misma estratificación **no las hace comparables**: hacen falta las cuatro
   coordenadas, no dos.
3. **P25 no es «bajo» ni P75 «alto».** La fuente no define ninguna categoría.
4. **No aplican a población institucionalizada.**
5. **No dicen si un valor es adecuado.**
6. **No son el único valor publicado para esta población.** Otro análisis de las
   mismas mediciones publica percentiles distintos. Presentar estos como *el*
   percentil de un niño colombiano, sin más, es incorrecto (`40`).
