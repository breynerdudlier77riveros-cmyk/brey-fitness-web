---
ficha: HGS-CL-TN1-D
tipo_norma: TN-1
estado: ES-1
referencia: gomez_campos_hgs_chile_2018
sprint: NKB-3.3
---

# Ficha · Fuerza de prensión manual · **mano derecha** · percentiles · niños y adolescentes de la Región del Maule, Chile

**24 normas** —12 grupos de edad × 2 sexos— cada una con 9 percentiles.

> **Por qué esta ficha existe separada de la de mano izquierda.** La fuente
> publica la mano derecha y la izquierda en **columnas distintas**, sin
> consolidarlas. Son dos definiciones operacionales, y la definición operacional
> es coordenada de identidad (`14`). Unirlas exigiría promediarlas: una
> derivación que la fuente no autoriza (`21`). Ficha hermana:
> `HGS-CL-TN1-percentiles-mano-izquierda.md`.

---

## Bloque A · Identidad

| Campo | Contenido |
|---|---|
| **CN-01 Variable** | Fuerza máxima de prensión manual de la **mano derecha**, absoluta |
| **CN-02 Definición operacional** | Mejor de dos intentos con la mano derecha |
| **CN-03 Método** | Dinamometría hidráulica JAMAR, en sedestación, según el protocolo de Richards y cols. citado por la fuente |
| **CN-04 Población** | Escolares de 12 establecimientos públicos de la Región del Maule, Chile, 6,0 a 17,9 años |
| **CN-05 Estrato** | Sexo × 12 grupos de edad de un año |

## Bloque B · Medida

| Campo | Contenido |
|---|---|
| **CN-06 Unidad** | **Libras-fuerza (lbf).** La fuente publica en lbf, no en kg |
| **CN-07 Instrumento** | JAMAR *Hydraulic Hand Dynamometer* modelo PC-5030 J1 (Fred Sammons Inc., Burr Ridge, Illinois), precisión 0,1 lbf |
| **CN-08 Parámetros del protocolo** | Sedestación en silla estándar de respaldo recto; 2 intentos por mano; manos alternadas con unos 2 minutos de descanso entre intentos de la misma mano; se registra el mejor de los dos. Error técnico de medida intra e interevaluador entre 1,2% y 1,8% |

## Bloque C · Distribución

| Campo | Contenido |
|---|---|
| **CN-09 Tipo** | TN-1 · percentiles |
| **CN-10 Estadísticos** | 9 percentiles por celda: P3 · P10 · P15 · P25 · P50 · P75 · P85 · P90 · P97, con N y con los parámetros L, M y S |
| **CN-11 Forma de la distribución** | Modelada. La fuente aplica el método LMS de Cole con transformación de potencia de Box-Cox y publica L, M y S por celda |
| **CN-12 Clasificación** | No aplica: **la fuente no define ninguna categoría** |

## Bloque D · Población y muestra

| Campo | Contenido |
|---|---|
| **CN-13 Inclusión** | Escolares de 6,0 a 17,9 años matriculados en 12 establecimientos públicos de la Región del Maule con consentimiento parental |
| **CN-14 Exclusión** | Declarada: 94 fumadores y 647 sin consentimiento parental, de 5 345 invitados |
| **CN-15 Tamaño por estrato** | Publicado por celda (columna n), entre 72 y 385 |
| **CN-16 Muestreo** | 12 establecimientos públicos de una región. **No se describe selección probabilística** de escuelas ni de alumnos |
| **CN-17 Sexo** | Estratificado: 2 269 varones, 2 235 mujeres |
| **CN-18 Edad** | 12 grupos de un año, de 6,0 a 17,9 |
| **CN-19 Nivel de práctica** | No es criterio de esta población |
| **CN-20 Contexto** | Región del Maule, Chile. Datos recogidos entre agosto y noviembre de 2015. La fuente indica que el alumnado de escuela pública en Chile es, en general, de clase media |

## Bloque E · Procedencia

| Campo | Contenido |
|---|---|
| **CN-21 Referencia** | `gomez_campos_hgs_chile_2018` |
| **CN-22 Identificador persistente** | Registrado en la referencia |
| **CN-23 Fecha de publicación** | 2018 |
| **CN-24 Naturaleza** | Estudio original · transversal, diseñado para producir valores normativos |
| **CN-25 Cadena** | Ninguna: acceso directo a la primaria |
| **CN-26 Ubicación del dato** | Tabla 3, «Percentile values for handgrip strength by sex and chronological age», bloque **HGS right (lbf)** |

## Bloque F · Estado y calidad

| Campo | Contenido |
|---|---|
| **CN-27 Estado** | ES-1 · Activa |
| **CN-28 Estado de la fuente** | Vigente; sin retractación ni corrección localizada |
| **CN-29 Calidad** | **Moderada** |
| **CN-30 Dimensiones que la degradaron** | D-01: el muestreo no permite sostener representatividad —12 escuelas públicas de una región, sin selección probabilística descrita, con la propia fuente señalando el sesgo socioeconómico—. D-04: la población declarada es regional, pero la muestra solo cubre el sector público |
| **CN-31 Confianza de la admisión** | **Alta.** Metadatos, protocolo, criterios de exclusión, análisis estadístico y las 24 filas de valores leídos en el fichero original del artículo |

> **Por qué no alcanza calidad alta.** Cumple lo que más suele fallar: fue
> diseñada como estudio normativo, publica N por celda, describe el instrumento
> con modelo y precisión, declara sus exclusiones y su error técnico de medida,
> y su procedimiento es reproducible. Lo único que la frena es que su muestreo
> no sostiene la representatividad de la población que nombra (`16`, D-01).

## Bloque G · Alcance y límites

| Campo | Contenido |
|---|---|
| **CN-32 Limitaciones de la fuente** | La propia fuente acota su alcance a la Región del Maule |
| **CN-33 Limitaciones añadidas** | Solo sector público; una región, no el país; datos de 2015; no cubre adultos; unidad en lbf, distinta de la del resto de la base |
| **CN-34 Alcance** | Escolares de 6,0 a 17,9 años de establecimientos públicos de la Región del Maule, Chile |
| **CN-35 Origen del dato** | OR-1 · Explícito en la Tabla 3 |

## Bloque H · Traza

| Campo | Contenido |
|---|---|
| **CN-36 Incorporó** | Sprint NKB-3.3 |
| **CN-37 Fecha** | 2026-08-09 |
| **CN-38 Versión de criterios** | NKB-2.0 |
| **CN-39 Conflictos** | **Ninguno.** Coincide con la norma colombiana en variable, rango etario y estratificación, y difiere en población, método, instrumento, definición operacional y unidad (`32`) |
| **CN-40 Sustitución** | Ninguna. **No sustituye a la norma colombiana**: no es una versión mejor de lo mismo, es otra cosa |

---

## Las 24 normas · percentiles en lbf

Mano derecha. Valores tal como los publica la Tabla 3.

### Varones

| Id | Edad | n | L | M | S | P3 | P10 | P15 | P25 | P50 | P75 | P85 | P90 | P97 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-CL-D-M-06 | 6,0–6,9 | 133 | 1,50 | 20,38 | 0,23 | 10,3 | 13,9 | 15,2 | 17,1 | 20,4 | 23,4 | 24,9 | 26,0 | 28,4 |
| HGS-CL-D-M-07 | 7,0–7,9 | 72 | 1,32 | 23,51 | 0,23 | 12,4 | 16,2 | 17,7 | 19,8 | 23,5 | 27,1 | 28,9 | 30,1 | 33,1 |
| HGS-CL-D-M-08 | 8,0–8,9 | 96 | 1,14 | 26,42 | 0,23 | 14,4 | 18,4 | 19,9 | 22,2 | 26,4 | 30,5 | 32,7 | 34,1 | 37,7 |
| HGS-CL-D-M-09 | 9,0–9,9 | 154 | 0,99 | 29,76 | 0,24 | 16,6 | 20,8 | 22,5 | 25,0 | 29,8 | 34,5 | 37,1 | 38,8 | 43,0 |
| HGS-CL-D-M-10 | 10,0–10,9 | 189 | 0,85 | 34,22 | 0,24 | 19,4 | 24,0 | 25,9 | 28,8 | 34,2 | 39,8 | 42,9 | 45,0 | 50,1 |
| HGS-CL-D-M-11 | 11,0–11,9 | 118 | 0,73 | 40,77 | 0,24 | 23,4 | 28,6 | 30,9 | 34,2 | 40,8 | 47,6 | 51,4 | 54,0 | 60,5 |
| HGS-CL-D-M-12 | 12,0–12,9 | 150 | 0,63 | 49,51 | 0,25 | 28,6 | 34,8 | 37,5 | 41,6 | 49,5 | 58,0 | 62,7 | 66,0 | 74,3 |
| HGS-CL-D-M-13 | 13,0–13,9 | 185 | 0,55 | 59,86 | 0,25 | 34,9 | 42,2 | 45,4 | 50,2 | 59,9 | 70,2 | 76,1 | 80,2 | 90,6 |
| HGS-CL-D-M-14 | 14,0–14,9 | 300 | 0,51 | 70,64 | 0,25 | 41,6 | 50,0 | 53,7 | 59,3 | 70,6 | 82,9 | 89,9 | 94,8 | 107,3 |
| HGS-CL-D-M-15 | 15,0–15,9 | 200 | 0,50 | 80,48 | 0,24 | 47,7 | 57,2 | 61,4 | 67,8 | 80,5 | 94,3 | 102,1 | 107,6 | 121,7 |
| HGS-CL-D-M-16 | 16,0–16,9 | 287 | 0,54 | 88,28 | 0,24 | 52,8 | 63,2 | 67,7 | 74,6 | 88,3 | 103,0 | 111,3 | 117,1 | 131,8 |
| HGS-CL-D-M-17 | 17,0–17,9 | 385 | 0,62 | 93,68 | 0,23 | 56,6 | 67,7 | 72,4 | 79,6 | 93,7 | 108,6 | 117,0 | 122,8 | 137,5 |

### Mujeres

| Id | Edad | n | L | M | S | P3 | P10 | P15 | P25 | P50 | P75 | P85 | P90 | P97 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-CL-D-F-06 | 6,0–6,9 | 161 | −0,17 | 17,57 | 0,35 | 9,5 | 11,4 | 12,4 | 14,0 | 17,6 | 22,3 | 25,5 | 27,9 | 35,1 |
| HGS-CL-D-F-07 | 7,0–7,9 | 124 | −0,10 | 20,65 | 0,33 | 11,4 | 13,7 | 14,8 | 16,6 | 20,6 | 25,8 | 29,1 | 31,7 | 38,9 |
| HGS-CL-D-F-08 | 8,0–8,9 | 101 | −0,03 | 23,99 | 0,31 | 13,5 | 16,2 | 17,5 | 19,5 | 24,0 | 29,5 | 33,0 | 35,7 | 43,0 |
| HGS-CL-D-F-09 | 9,0–9,9 | 243 | 0,03 | 28,01 | 0,29 | 16,2 | 19,3 | 20,8 | 23,1 | 28,0 | 34,0 | 37,7 | 40,5 | 48,0 |
| HGS-CL-D-F-10 | 10,0–10,9 | 269 | 0,08 | 32,86 | 0,27 | 19,5 | 23,1 | 24,7 | 27,3 | 32,9 | 39,4 | 43,4 | 46,3 | 54,2 |
| HGS-CL-D-F-11 | 11,0–11,9 | 165 | 0,13 | 38,56 | 0,26 | 23,4 | 27,6 | 29,4 | 32,4 | 38,6 | 45,7 | 50,1 | 53,2 | 61,5 |
| HGS-CL-D-F-12 | 12,0–12,9 | 148 | 0,20 | 44,58 | 0,24 | 27,6 | 32,3 | 34,4 | 37,7 | 44,6 | 52,4 | 57,0 | 60,3 | 69,0 |
| HGS-CL-D-F-13 | 13,0–13,9 | 119 | 0,31 | 49,85 | 0,23 | 31,3 | 36,5 | 38,9 | 42,5 | 49,8 | 58,1 | 62,8 | 66,2 | 75,0 |
| HGS-CL-D-F-14 | 14,0–14,9 | 271 | 0,44 | 53,77 | 0,22 | 34,0 | 39,7 | 42,2 | 46,1 | 53,8 | 62,1 | 66,9 | 70,3 | 78,8 |
| HGS-CL-D-F-15 | 15,0–15,9 | 167 | 0,59 | 56,15 | 0,21 | 35,5 | 41,7 | 44,3 | 48,3 | 56,2 | 64,5 | 69,2 | 72,4 | 80,6 |
| HGS-CL-D-F-16 | 16,0–16,9 | 247 | 0,75 | 57,19 | 0,21 | 36,0 | 42,5 | 45,2 | 49,3 | 57,2 | 65,3 | 69,8 | 72,9 | 80,5 |
| HGS-CL-D-F-17 | 17,0–17,9 | 359 | 0,92 | 57,37 | 0,20 | 35,9 | 42,6 | 45,4 | 49,6 | 57,4 | 65,3 | 69,5 | 72,4 | 79,6 |

## L, M y S no autorizan a calcular percentiles nuevos

Los tres parámetros se transcriben porque la fuente los publica y porque son lo
que hace **reproducible** esta norma (V-11). No son una licencia:

> Calcular con ellos un percentil que la fuente no tabula —un P60, un P80—
> produciría un valor **que nadie publicó**. Sería una derivación OR-3 y `21` no
> la autoriza. La NKB almacena los nueve percentiles publicados; ni uno más.

## Anomalías conservadas

- **Notación.** En la tabla original, tres celdas usan coma donde el resto usa
  punto decimal —`72,4` y `42,1` en el grupo de 17,0–17,9 años de mujeres—.
  Es una errata tipográfica de la fuente; el valor numérico no es ambiguo y en
  esta ficha, que usa coma como separador decimal, se transcribe igual.
- **Discrepancia interna de la fuente.** El texto de métodos dice que las edades
  se agruparon en «10 categorías»; las tablas publican **12**. Se transcriben las
  12 que la tabla contiene. La discrepancia se registra, no se resuelve.

## Lo que estas normas NO permiten afirmar

1. **No cubren adultos.** El límite superior es 17,9 años.
2. **No están en kilogramos.** Convertirlas cambiaría la unidad publicada; si
   alguna vez se hiciera, sería una derivación y debería declararse como tal.
3. **No son comparables** con las normas colombianas, alemanas ni brasileñas:
   instrumento, posición corporal, definición operacional y población distintos.
   **EQ-3**.
4. **No se combinan con la mano izquierda.** Promediarlas crearía un valor que la
   fuente no publica.
5. **P25 no es «bajo» ni P75 «alto».** La fuente no define ninguna categoría.
6. **No representan a Chile**, sino a escolares de escuela pública de una región.
7. **No dicen si un valor es adecuado.** Un percentil describe posición.
