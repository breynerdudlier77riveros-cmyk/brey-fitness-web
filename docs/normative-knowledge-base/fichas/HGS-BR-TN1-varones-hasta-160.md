---
ficha: HGS-BR-TN1-M16
tipo_norma: TN-1
estado: ES-1
referencia: reichenheim_hgs_brasil_2021
sprint: NKB-3.4
---

# Ficha · Fuerza de prensión manual · percentiles · mayores de Brasil · varones de hasta 1,60 m

**26 normas** —una por edad, de 65 a 90 años— cada una con 13 percentiles.

> Uno de los seis estratos sexo × estatura que publica la fuente. Ficha
> autosuficiente: **no hereda ningún campo** de las otras cinco (`30`, B2).

---

## Bloque A · Identidad

| Campo | Contenido |
|---|---|
| **CN-01 Variable** | Fuerza máxima de prensión manual de la **mano dominante** |
| **CN-02 Definición operacional** | Media de la segunda y tercera de tres repeticiones con la mano dominante |
| **CN-03 Método** | Dinamometría hidráulica JAMAR, modelo J00105 (Lafayette Instruments), en sedestación, según el protocolo de la American Society of Hand Therapists |
| **CN-04 Población** | Personas mayores de 65 a 90 años residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-05 Estrato** | Varones de estatura ≤ 1,60 m × edad (26 edades) |

## Bloque B · Medida

| Campo | Contenido |
|---|---|
| **CN-06 Unidad** | Kilogramo-fuerza (kgf) |
| **CN-07 Instrumento** | JAMAR hidráulico J00105, Lafayette Instruments |
| **CN-08 Parámetros del protocolo** | Sentado en silla sin apoyabrazos y pies planos en el suelo; hombro pegado a la silla, codo flexionado 90°, antebrazo en posición neutra con el pulgar hacia arriba, muñeca en posición cómoda; el evaluador ajusta el dinámometro en la mano dominante; tres repeticiones; se registra la media de la segunda y la tercera |

## Bloque C · Distribución

| Campo | Contenido |
|---|---|
| **CN-09 Tipo** | TN-1 · percentiles |
| **CN-10 Estadísticos** | 13 percentiles por edad: 2,5 · 3 · 5 · 10 · 20 · 25 · 50 · 75 · 80 · 90 · 95 · 97 · 97,5 |
| **CN-11 Forma de la distribución** | Modelada por la fuente mediante regresión de media y dispersión |
| **CN-12 Clasificación** | No aplica: la fuente no define categorías |

> **Los valores son proyecciones del modelo de la fuente**, no percentiles
> empíricos observados. La fuente los publica explícitamente junto con sus
> ecuaciones. Desde la NKB son **OR-1 · explícitos**: la derivación la hizo y la
> sostiene la fuente, no nosotros (`21`).

## Bloque D · Población y muestra

| Campo | Contenido |
|---|---|
| **CN-13 Inclusión** | ≥ 65 años, sin condiciones físicas o sensoriales que impidieran la evaluación. La muestra de referencia exigió además preservación cognitiva, velocidad de marcha > 0,8 m/s e independencia en actividades básicas de la vida diaria |
| **CN-14 Exclusión** | Quienes no cumplían los criterios anteriores conformaron una muestra de validación aparte. Se excluyeron valores biológicamente implausibles —varones con HGS ≥ 65 kgf y mujeres ≥ 45 kgf— y 252 personas con más de 5 kgf de diferencia entre la segunda y la tercera medición |
| **CN-15 Tamaño por estrato** | **No consta por celda de edad × altura.** La muestra de referencia total es de 2 999 personas |
| **CN-16 Muestreo** | Poblacional, transversal, con muestreo probabilístico estratificado por sexo y edad en cada sede |
| **CN-17 Sexo** | Varones |
| **CN-18 Edad** | 65 a 90 años, año a año |
| **CN-19 Nivel de práctica** | No es criterio de esta población |
| **CN-20 Contexto** | Brasil, 16 ciudades de distintas regiones sociodemográficas. Recogida entre enero de 2009 y enero de 2010 |

> **CN-13 acota la población de forma decisiva.** Estas normas describen a
> personas mayores con **envejecimiento satisfactorio** según los criterios del
> estudio, no a la población mayor brasileña en general.

## Bloque E · Procedencia

| Campo | Contenido |
|---|---|
| **CN-21 Referencia** | `reichenheim_hgs_brasil_2021` |
| **CN-22 Identificador persistente** | Registrado en la referencia |
| **CN-23 Fecha de publicación** | 2021 |
| **CN-24 Naturaleza** | Estudio original |
| **CN-25 Cadena** | Ninguna: acceso directo a la primaria |
| **CN-26 Ubicación del dato** | Tabla suplementaria S3, «Hand grip strength (kgf) projected for male ≤1.6 meters for a wide array of centiles» |

## Bloque F · Estado y calidad

| Campo | Contenido |
|---|---|
| **CN-27 Estado** | ES-1 · Activa |
| **CN-28 Estado de la fuente** | Vigente; sin retractación ni corrección localizada |
| **CN-29 Calidad** | **Moderada** |
| **CN-30 Dimensiones que la degradaron** | D-02: el tamaño muestral por celda de edad × altura no consta. D-05: los percentiles son proyecciones del modelo, no frecuencias observadas |
| **CN-31 Confianza de la admisión** | **Alta.** Metadatos, protocolo, criterios y los 26 valores leídos en el fichero original de la tabla suplementaria |

> **Por qué no alcanza calidad alta:** el estudio sí fue diseñado para producir
> valores normativos y su muestreo es probabilístico, pero no publica el N por
> celda y sus percentiles son modelados. Ambas cosas impiden el nivel superior
> (`16`).

## Bloque G · Alcance y límites

| Campo | Contenido |
|---|---|
| **CN-32 Limitaciones de la fuente** | Los valores son proyecciones por edad derivadas de un modelo de regresión de media y dispersión |
| **CN-33 Limitaciones añadidas** | N por celda no disponible; datos recogidos en 2009-2010; **no se transcriben las edades 91 a 95** que la tabla publica, por quedar fuera del rango 65–90 que la propia fuente declara como su población |
| **CN-34 Alcance** | Varones de 1,60 m o menos, de 65 a 90 años, residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-35 Origen del dato** | OR-1 · Explícito en la tabla suplementaria S3 |

## Bloque H · Traza

| Campo | Contenido |
|---|---|
| **CN-36 Incorporó** | Sprint NKB-3.4 |
| **CN-37 Fecha** | 2026-08-09 |
| **CN-38 Versión de criterios** | NKB-2.0 |
| **CN-39 Conflictos** | **Ninguno.** Comparte fuente, población y método con las otras cinco fichas brasileñas y difiere de todas ellas en el estrato, que es coordenada de identidad (`34`) |
| **CN-40 Sustitución** | Ninguna. No sustituye a `HGS-BR-TN1` ni a las demás: son estratos distintos, no versiones de lo mismo |

---

## Las 26 normas · percentiles en kgf

Valores tal como los publica la tabla S3.

| Id | Edad | P2,5 | P3 | P5 | P10 | P20 | P25 | P50 | P75 | P80 | P90 | P95 | P97 | P97,5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-BR-M16-65 | 65 | 16,95 | 17,55 | 19,32 | 22,06 | 25,37 | 26,63 | 31,71 | 36,79 | 38,04 | 41,36 | 44,09 | 45,87 | 46,47 |
| HGS-BR-M16-66 | 66 | 16,77 | 17,36 | 19,12 | 21,83 | 25,11 | 26,35 | 31,38 | 36,40 | 37,65 | 40,93 | 43,63 | 45,39 | 45,98 |
| HGS-BR-M16-67 | 67 | 16,60 | 17,18 | 18,92 | 21,60 | 24,84 | 26,07 | 31,05 | 36,02 | 37,25 | 40,49 | 43,17 | 44,91 | 45,50 |
| HGS-BR-M16-68 | 68 | 16,42 | 17,00 | 18,72 | 21,37 | 24,58 | 25,80 | 30,71 | 35,63 | 36,85 | 40,06 | 42,71 | 44,43 | 45,01 |
| HGS-BR-M16-69 | 69 | 16,24 | 16,81 | 18,52 | 21,14 | 24,31 | 25,52 | 30,38 | 35,25 | 36,46 | 39,63 | 42,25 | 43,95 | 44,53 |
| HGS-BR-M16-70 | 70 | 16,07 | 16,63 | 18,31 | 20,91 | 24,05 | 25,24 | 30,05 | 34,87 | 36,06 | 39,20 | 41,79 | 43,48 | 44,04 |
| HGS-BR-M16-71 | 71 | 15,89 | 16,45 | 18,11 | 20,68 | 23,78 | 24,96 | 29,72 | 34,48 | 35,66 | 38,77 | 41,33 | 43,00 | 43,56 |
| HGS-BR-M16-72 | 72 | 15,71 | 16,26 | 17,91 | 20,45 | 23,52 | 24,68 | 29,39 | 34,10 | 35,27 | 38,34 | 40,87 | 42,52 | 43,07 |
| HGS-BR-M16-73 | 73 | 15,53 | 16,08 | 17,71 | 20,22 | 23,25 | 24,41 | 29,06 | 33,72 | 34,87 | 37,91 | 40,41 | 42,04 | 42,59 |
| HGS-BR-M16-74 | 74 | 15,36 | 15,90 | 17,51 | 19,99 | 22,99 | 24,13 | 28,73 | 33,33 | 34,47 | 37,47 | 39,95 | 41,56 | 42,10 |
| HGS-BR-M16-75 | 75 | 15,18 | 15,71 | 17,31 | 19,76 | 22,72 | 23,85 | 28,40 | 32,95 | 34,08 | 37,04 | 39,49 | 41,08 | 41,62 |
| HGS-BR-M16-76 | 76 | 15,00 | 15,53 | 17,10 | 19,53 | 22,46 | 23,57 | 28,07 | 32,56 | 33,68 | 36,61 | 39,03 | 40,60 | 41,13 |
| HGS-BR-M16-77 | 77 | 14,83 | 15,35 | 16,90 | 19,30 | 22,19 | 23,29 | 27,74 | 32,18 | 33,28 | 36,18 | 38,57 | 40,13 | 40,65 |
| HGS-BR-M16-78 | 78 | 14,65 | 15,17 | 16,70 | 19,07 | 21,93 | 23,02 | 27,41 | 31,80 | 32,88 | 35,75 | 38,11 | 39,65 | 40,16 |
| HGS-BR-M16-79 | 79 | 14,47 | 14,98 | 16,50 | 18,84 | 21,66 | 22,74 | 27,08 | 31,41 | 32,49 | 35,32 | 37,65 | 39,17 | 39,68 |
| HGS-BR-M16-80 | 80 | 14,30 | 14,80 | 16,30 | 18,61 | 21,40 | 22,46 | 26,75 | 31,03 | 32,09 | 34,88 | 37,19 | 38,69 | 39,19 |
| HGS-BR-M16-81 | 81 | 14,12 | 14,62 | 16,10 | 18,38 | 21,14 | 22,18 | 26,41 | 30,65 | 31,69 | 34,45 | 36,73 | 38,21 | 38,71 |
| HGS-BR-M16-82 | 82 | 13,94 | 14,43 | 15,90 | 18,15 | 20,87 | 21,91 | 26,08 | 30,26 | 31,30 | 34,02 | 36,27 | 37,73 | 38,22 |
| HGS-BR-M16-83 | 83 | 13,77 | 14,25 | 15,69 | 17,92 | 20,61 | 21,63 | 25,75 | 29,88 | 30,90 | 33,59 | 35,81 | 37,26 | 37,74 |
| HGS-BR-M16-84 | 84 | 13,59 | 14,07 | 15,49 | 17,69 | 20,34 | 21,35 | 25,42 | 29,49 | 30,50 | 33,16 | 35,35 | 36,78 | 37,25 |
| HGS-BR-M16-85 | 85 | 13,41 | 13,88 | 15,29 | 17,46 | 20,08 | 21,07 | 25,09 | 29,11 | 30,11 | 32,73 | 34,89 | 36,30 | 36,77 |
| HGS-BR-M16-86 | 86 | 13,24 | 13,70 | 15,09 | 17,22 | 19,81 | 20,79 | 24,76 | 28,73 | 29,71 | 32,30 | 34,43 | 35,82 | 36,29 |
| HGS-BR-M16-87 | 87 | 13,06 | 13,52 | 14,89 | 16,99 | 19,55 | 20,52 | 24,43 | 28,34 | 29,31 | 31,86 | 33,97 | 35,34 | 35,80 |
| HGS-BR-M16-88 | 88 | 12,88 | 13,34 | 14,69 | 16,76 | 19,28 | 20,24 | 24,10 | 27,96 | 28,92 | 31,43 | 33,51 | 34,86 | 35,32 |
| HGS-BR-M16-89 | 89 | 12,71 | 13,15 | 14,48 | 16,53 | 19,02 | 19,96 | 23,77 | 27,58 | 28,52 | 31,00 | 33,05 | 34,38 | 34,83 |
| HGS-BR-M16-90 | 90 | 12,53 | 12,97 | 14,28 | 16,30 | 18,75 | 19,68 | 23,44 | 27,19 | 28,12 | 30,57 | 32,59 | 33,91 | 34,35 |

## Anomalías conservadas

**Ninguna.** Los 26 conjuntos de percentiles son monótonos no decrecientes de
P2,5 a P97,5 y descienden con la edad, como corresponde al modelo de la fuente.


## Lo que estas normas NO permiten afirmar

1. **No describen a la población mayor brasileña en general**, solo a quien
   cumpla los criterios de envejecimiento satisfactorio del estudio.
2. **No se aplican a otro estrato de estatura ni al otro sexo.** Cada estrato
   tiene su propia ficha y no se interpolan entre sí (`19`, ST-04).
3. **No son percentiles observados.** Son proyecciones del modelo de la fuente.
4. **No son comparables** con las normas alemanas, colombianas ni chilenas:
   dinámometro, protocolo, definición operacional y población distintos. **EQ-3**.
5. **No cubren de 91 a 95 años**, aunque la tabla publique esas filas.
6. **No dicen si un valor es adecuado.** Un percentil describe posición.
