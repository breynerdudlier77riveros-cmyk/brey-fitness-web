---
ficha: HGS-BR-TN1-F156
tipo_norma: TN-1
estado: ES-1
referencia: reichenheim_hgs_brasil_2021
sprint: NKB-3.4
---

# Ficha · Fuerza de prensión manual · percentiles · mayores de Brasil · mujeres de 1,50 a 1,60 m

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
| **CN-05 Estrato** | Mujeres de estatura > 1,50 y ≤ 1,60 m × edad (26 edades) |

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
| **CN-26 Ubicación del dato** | Tabla suplementaria S5, «Hand grip strength (kgf) projected for female from >1.5 to 1.6 meters for a wide array of centiles» |

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
| **CN-34 Alcance** | Mujeres de más de 1,50 m y hasta 1,60 m, de 65 a 90 años, residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-35 Origen del dato** | OR-1 · Explícito en la tabla suplementaria S5 |

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

Valores tal como los publica la tabla S5.

| Id | Edad | P2,5 | P3 | P5 | P10 | P20 | P25 | P50 | P75 | P80 | P90 | P95 | P97 | P97,5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-BR-F156-65 | 65 | 11,62 | 12,04 | 13,30 | 15,24 | 17,60 | 18,49 | 22,09 | 25,70 | 26,59 | 28,94 | 30,88 | 32,14 | 32,56 |
| HGS-BR-F156-66 | 66 | 11,49 | 11,91 | 13,15 | 15,07 | 17,39 | 18,28 | 21,84 | 25,40 | 26,29 | 28,61 | 30,53 | 31,77 | 32,19 |
| HGS-BR-F156-67 | 67 | 11,36 | 11,77 | 13,00 | 14,90 | 17,19 | 18,07 | 21,59 | 25,11 | 25,98 | 28,28 | 30,18 | 31,41 | 31,82 |
| HGS-BR-F156-68 | 68 | 11,22 | 11,63 | 12,85 | 14,72 | 16,99 | 17,86 | 21,34 | 24,82 | 25,68 | 27,95 | 29,82 | 31,04 | 31,45 |
| HGS-BR-F156-69 | 69 | 11,09 | 11,49 | 12,70 | 14,55 | 16,79 | 17,65 | 21,08 | 24,52 | 25,38 | 27,62 | 29,47 | 30,68 | 31,08 |
| HGS-BR-F156-70 | 70 | 10,96 | 11,36 | 12,55 | 14,38 | 16,59 | 17,43 | 20,83 | 24,23 | 25,07 | 27,29 | 29,12 | 30,31 | 30,71 |
| HGS-BR-F156-71 | 71 | 10,83 | 11,22 | 12,39 | 14,20 | 16,39 | 17,22 | 20,58 | 23,94 | 24,77 | 26,96 | 28,77 | 29,94 | 30,34 |
| HGS-BR-F156-72 | 72 | 10,69 | 11,08 | 12,24 | 14,03 | 16,19 | 17,01 | 20,33 | 23,65 | 24,47 | 26,63 | 28,42 | 29,58 | 29,97 |
| HGS-BR-F156-73 | 73 | 10,56 | 10,95 | 12,09 | 13,86 | 15,99 | 16,80 | 20,08 | 23,35 | 24,16 | 26,30 | 28,06 | 29,21 | 29,59 |
| HGS-BR-F156-74 | 74 | 10,43 | 10,81 | 11,94 | 13,68 | 15,79 | 16,59 | 19,83 | 23,06 | 23,86 | 25,97 | 27,71 | 28,84 | 29,22 |
| HGS-BR-F156-75 | 75 | 10,30 | 10,67 | 11,79 | 13,51 | 15,59 | 16,38 | 19,57 | 22,77 | 23,56 | 25,64 | 27,36 | 28,48 | 28,85 |
| HGS-BR-F156-76 | 76 | 10,16 | 10,53 | 11,64 | 13,33 | 15,39 | 16,17 | 19,32 | 22,47 | 23,26 | 25,31 | 27,01 | 28,11 | 28,48 |
| HGS-BR-F156-77 | 77 | 10,03 | 10,40 | 11,48 | 13,16 | 15,19 | 15,96 | 19,07 | 22,18 | 22,95 | 24,98 | 26,66 | 27,75 | 28,11 |
| HGS-BR-F156-78 | 78 | 9,90 | 10,26 | 11,33 | 12,99 | 14,99 | 15,75 | 18,82 | 21,89 | 22,65 | 24,65 | 26,31 | 27,38 | 27,74 |
| HGS-BR-F156-79 | 79 | 9,77 | 10,12 | 11,18 | 12,81 | 14,79 | 15,54 | 18,57 | 21,60 | 22,35 | 24,32 | 25,95 | 27,01 | 27,37 |
| HGS-BR-F156-80 | 80 | 9,63 | 9,98 | 11,03 | 12,64 | 14,59 | 15,33 | 18,32 | 21,30 | 22,04 | 23,99 | 25,60 | 26,65 | 27,00 |
| HGS-BR-F156-81 | 81 | 9,50 | 9,85 | 10,88 | 12,47 | 14,39 | 15,12 | 18,06 | 21,01 | 21,74 | 23,66 | 25,25 | 26,28 | 26,63 |
| HGS-BR-F156-82 | 82 | 9,37 | 9,71 | 10,73 | 12,29 | 14,19 | 14,91 | 17,81 | 20,72 | 21,44 | 23,33 | 24,90 | 25,91 | 26,25 |
| HGS-BR-F156-83 | 83 | 9,24 | 9,57 | 10,57 | 12,12 | 13,99 | 14,70 | 17,56 | 20,42 | 21,13 | 23,00 | 24,55 | 25,55 | 25,88 |
| HGS-BR-F156-84 | 84 | 9,10 | 9,44 | 10,42 | 11,94 | 13,79 | 14,49 | 17,31 | 20,13 | 20,83 | 22,67 | 24,19 | 25,18 | 25,51 |
| HGS-BR-F156-85 | 85 | 8,97 | 9,30 | 10,27 | 11,77 | 13,58 | 14,27 | 17,06 | 19,84 | 20,53 | 22,34 | 23,84 | 24,81 | 25,14 |
| HGS-BR-F156-86 | 86 | 8,84 | 9,16 | 10,12 | 11,60 | 13,38 | 14,06 | 16,80 | 19,55 | 20,23 | 22,01 | 23,49 | 24,45 | 24,77 |
| HGS-BR-F156-87 | 87 | 8,71 | 9,02 | 9,97 | 11,42 | 13,18 | 13,85 | 16,55 | 19,25 | 19,92 | 21,68 | 23,14 | 24,08 | 24,40 |
| HGS-BR-F156-88 | 88 | 8,57 | 8,89 | 9,82 | 11,25 | 12,98 | 13,64 | 16,30 | 18,96 | 19,62 | 21,35 | 22,79 | 23,72 | 24,03 |
| HGS-BR-F156-89 | 89 | 8,44 | 8,75 | 9,67 | 11,08 | 12,78 | 13,43 | 16,05 | 18,67 | 19,32 | 21,02 | 22,43 | 23,35 | 23,66 |
| HGS-BR-F156-90 | 90 | 8,31 | 8,61 | 9,51 | 10,90 | 12,58 | 13,22 | 15,80 | 18,37 | 19,01 | 20,69 | 22,08 | 22,98 | 23,29 |

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
