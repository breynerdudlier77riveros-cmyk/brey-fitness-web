---
ficha: HGS-BR-TN1-F15
tipo_norma: TN-1
estado: ES-1
referencia: reichenheim_hgs_brasil_2021
sprint: NKB-3.4
---

# Ficha · Fuerza de prensión manual · percentiles · mayores de Brasil · mujeres de hasta 1,50 m

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
| **CN-05 Estrato** | Mujeres de estatura ≤ 1,50 m × edad (26 edades) |

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
| **CN-17 Sexo** | Mujeres |
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
| **CN-26 Ubicación del dato** | Tabla suplementaria S6, «Hand grip strength (kgf) projected for female ≤1.5 meters for a wide array of centiles» |

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
| **CN-34 Alcance** | Mujeres de 1,50 m o menos, de 65 a 90 años, residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-35 Origen del dato** | OR-1 · Explícito en la tabla suplementaria S6 |

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

Valores tal como los publica la tabla S6.

| Id | Edad | P2,5 | P3 | P5 | P10 | P20 | P25 | P50 | P75 | P80 | P90 | P95 | P97 | P97,5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-BR-F15-65 | 65 | 10,41 | 10,78 | 11,87 | 13,54 | 15,57 | 16,35 | 19,46 | 22,57 | 23,34 | 25,37 | 27,05 | 28,14 | 28,51 |
| HGS-BR-F15-66 | 66 | 10,34 | 10,70 | 11,78 | 13,45 | 15,46 | 16,23 | 19,32 | 22,41 | 23,18 | 25,19 | 26,86 | 27,94 | 28,30 |
| HGS-BR-F15-67 | 67 | 10,26 | 10,62 | 11,70 | 13,35 | 15,35 | 16,11 | 19,18 | 22,25 | 23,01 | 25,01 | 26,66 | 27,74 | 28,10 |
| HGS-BR-F15-68 | 68 | 10,19 | 10,55 | 11,61 | 13,25 | 15,24 | 15,99 | 19,04 | 22,09 | 22,84 | 24,83 | 26,47 | 27,54 | 27,89 |
| HGS-BR-F15-69 | 69 | 10,11 | 10,47 | 11,53 | 13,15 | 15,13 | 15,88 | 18,90 | 21,93 | 22,67 | 24,65 | 26,28 | 27,33 | 27,69 |
| HGS-BR-F15-70 | 70 | 10,04 | 10,39 | 11,44 | 13,06 | 15,02 | 15,76 | 18,76 | 21,76 | 22,51 | 24,47 | 26,08 | 27,13 | 27,49 |
| HGS-BR-F15-71 | 71 | 9,96 | 10,31 | 11,36 | 12,96 | 14,90 | 15,64 | 18,62 | 21,60 | 22,34 | 24,28 | 25,89 | 26,93 | 27,28 |
| HGS-BR-F15-72 | 72 | 9,89 | 10,24 | 11,27 | 12,86 | 14,79 | 15,53 | 18,48 | 21,44 | 22,17 | 24,10 | 25,70 | 26,73 | 27,08 |
| HGS-BR-F15-73 | 73 | 9,81 | 10,16 | 11,19 | 12,77 | 14,68 | 15,41 | 18,34 | 21,28 | 22,01 | 23,92 | 25,50 | 26,53 | 26,87 |
| HGS-BR-F15-74 | 74 | 9,74 | 10,08 | 11,10 | 12,67 | 14,57 | 15,29 | 18,20 | 21,12 | 21,84 | 23,74 | 25,31 | 26,33 | 26,67 |
| HGS-BR-F15-75 | 75 | 9,67 | 10,00 | 11,02 | 12,57 | 14,46 | 15,17 | 18,06 | 20,96 | 21,67 | 23,56 | 25,11 | 26,13 | 26,46 |
| HGS-BR-F15-76 | 76 | 9,59 | 9,93 | 10,93 | 12,48 | 14,35 | 15,06 | 17,93 | 20,79 | 21,50 | 23,38 | 24,92 | 25,92 | 26,26 |
| HGS-BR-F15-77 | 77 | 9,52 | 9,85 | 10,85 | 12,38 | 14,23 | 14,94 | 17,79 | 20,63 | 21,34 | 23,19 | 24,73 | 25,72 | 26,06 |
| HGS-BR-F15-78 | 78 | 9,44 | 9,77 | 10,76 | 12,28 | 14,12 | 14,82 | 17,65 | 20,47 | 21,17 | 23,01 | 24,53 | 25,52 | 25,85 |
| HGS-BR-F15-79 | 79 | 9,37 | 9,70 | 10,68 | 12,18 | 14,01 | 14,71 | 17,51 | 20,31 | 21,00 | 22,83 | 24,34 | 25,32 | 25,65 |
| HGS-BR-F15-80 | 80 | 9,29 | 9,62 | 10,59 | 12,09 | 13,90 | 14,59 | 17,37 | 20,15 | 20,84 | 22,65 | 24,14 | 25,12 | 25,44 |
| HGS-BR-F15-81 | 81 | 9,22 | 9,54 | 10,51 | 11,99 | 13,79 | 14,47 | 17,23 | 19,99 | 20,67 | 22,47 | 23,95 | 24,92 | 25,24 |
| HGS-BR-F15-82 | 82 | 9,14 | 9,46 | 10,42 | 11,89 | 13,68 | 14,35 | 17,09 | 19,82 | 20,50 | 22,28 | 23,76 | 24,71 | 25,03 |
| HGS-BR-F15-83 | 83 | 9,07 | 9,39 | 10,34 | 11,80 | 13,57 | 14,24 | 16,95 | 19,66 | 20,33 | 22,10 | 23,56 | 24,51 | 24,83 |
| HGS-BR-F15-84 | 84 | 8,99 | 9,31 | 10,25 | 11,70 | 13,45 | 14,12 | 16,81 | 19,50 | 20,17 | 21,92 | 23,37 | 24,31 | 24,63 |
| HGS-BR-F15-85 | 85 | 8,92 | 9,23 | 10,17 | 11,60 | 13,34 | 14,00 | 16,67 | 19,34 | 20,00 | 21,74 | 23,18 | 24,11 | 24,42 |
| HGS-BR-F15-86 | 86 | 8,84 | 9,16 | 10,08 | 11,51 | 13,23 | 13,89 | 16,53 | 19,18 | 19,83 | 21,56 | 22,98 | 23,91 | 24,22 |
| HGS-BR-F15-87 | 87 | 8,77 | 9,08 | 10,00 | 11,41 | 13,12 | 13,77 | 16,39 | 19,02 | 19,66 | 21,38 | 22,79 | 23,71 | 24,01 |
| HGS-BR-F15-88 | 88 | 8,70 | 9,00 | 9,91 | 11,31 | 13,01 | 13,65 | 16,25 | 18,85 | 19,50 | 21,19 | 22,59 | 23,50 | 23,81 |
| HGS-BR-F15-89 | 89 | 8,62 | 8,92 | 9,83 | 11,21 | 12,90 | 13,54 | 16,11 | 18,69 | 19,33 | 21,01 | 22,40 | 23,30 | 23,61 |
| HGS-BR-F15-90 | 90 | 8,55 | 8,85 | 9,74 | 11,12 | 12,78 | 13,42 | 15,97 | 18,53 | 19,16 | 20,83 | 22,21 | 23,10 | 23,40 |

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
