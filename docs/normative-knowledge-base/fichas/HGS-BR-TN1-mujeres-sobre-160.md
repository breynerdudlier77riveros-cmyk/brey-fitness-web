---
ficha: HGS-BR-TN1-F16
tipo_norma: TN-1
estado: ES-1
referencia: reichenheim_hgs_brasil_2021
sprint: NKB-3.4
---

# Ficha · Fuerza de prensión manual · percentiles · mayores de Brasil · mujeres de más de 1,60 m

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
| **CN-05 Estrato** | Mujeres de estatura > 1,60 m × edad (26 edades) |

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
| **CN-26 Ubicación del dato** | Tabla suplementaria S4, «Hand grip strength (kgf) projected for female >1.6 meters for a wide array of centiles» |

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
| **CN-34 Alcance** | Mujeres de más de 1,60 m, de 65 a 90 años, residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-35 Origen del dato** | OR-1 · Explícito en la tabla suplementaria S4 |

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

Valores tal como los publica la tabla S4.

| Id | Edad | P2,5 | P3 | P5 | P10 | P20 | P25 | P50 | P75 | P80 | P90 | P95 | P97 | P97,5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-BR-F16-65 | 65 | 13,70 | 14,15 | 15,52 | 17,62 | 20,16 | 21,12 | 25,02 | 28,92 | 29,88 | 32,42 | 34,52 | 35,89 | 36,34 |
| HGS-BR-F16-66 | 66 | 13,52 | 13,97 | 15,31 | 17,38 | 19,89 | 20,84 | 24,69 | 28,53 | 29,49 | 31,99 | 34,07 | 35,41 | 35,86 |
| HGS-BR-F16-67 | 67 | 13,33 | 13,78 | 15,11 | 17,15 | 19,62 | 20,56 | 24,36 | 28,15 | 29,09 | 31,56 | 33,61 | 34,94 | 35,38 |
| HGS-BR-F16-68 | 68 | 13,15 | 13,59 | 14,90 | 16,92 | 19,36 | 20,28 | 24,03 | 27,77 | 28,70 | 31,14 | 33,15 | 34,46 | 34,90 |
| HGS-BR-F16-69 | 69 | 12,97 | 13,40 | 14,70 | 16,68 | 19,09 | 20,00 | 23,69 | 27,39 | 28,30 | 30,71 | 32,69 | 33,98 | 34,42 |
| HGS-BR-F16-70 | 70 | 12,79 | 13,22 | 14,49 | 16,45 | 18,82 | 19,72 | 23,36 | 27,00 | 27,90 | 30,28 | 32,24 | 33,51 | 33,94 |
| HGS-BR-F16-71 | 71 | 12,61 | 13,03 | 14,28 | 16,22 | 18,56 | 19,45 | 23,03 | 26,62 | 27,51 | 29,85 | 31,78 | 33,03 | 33,46 |
| HGS-BR-F16-72 | 72 | 12,43 | 12,84 | 14,08 | 15,98 | 18,29 | 19,17 | 22,70 | 26,24 | 27,11 | 29,42 | 31,32 | 32,56 | 32,97 |
| HGS-BR-F16-73 | 73 | 12,25 | 12,65 | 13,87 | 15,75 | 18,02 | 18,89 | 22,37 | 25,85 | 26,72 | 28,99 | 30,87 | 32,08 | 32,49 |
| HGS-BR-F16-74 | 74 | 12,06 | 12,47 | 13,67 | 15,52 | 17,76 | 18,61 | 22,04 | 25,47 | 26,32 | 28,56 | 30,41 | 31,61 | 32,01 |
| HGS-BR-F16-75 | 75 | 11,88 | 12,28 | 13,46 | 15,28 | 17,49 | 18,33 | 21,71 | 25,09 | 25,93 | 28,13 | 29,95 | 31,13 | 31,53 |
| HGS-BR-F16-76 | 76 | 11,70 | 12,09 | 13,26 | 15,05 | 17,22 | 18,05 | 21,38 | 24,70 | 25,53 | 27,70 | 29,49 | 30,66 | 31,05 |
| HGS-BR-F16-77 | 77 | 11,52 | 11,91 | 13,05 | 14,82 | 16,95 | 17,77 | 21,04 | 24,32 | 25,13 | 27,27 | 29,04 | 30,18 | 30,57 |
| HGS-BR-F16-78 | 78 | 11,34 | 11,72 | 12,85 | 14,58 | 16,69 | 17,49 | 20,71 | 23,94 | 24,74 | 26,84 | 28,58 | 29,71 | 30,09 |
| HGS-BR-F16-79 | 79 | 11,16 | 11,53 | 12,64 | 14,35 | 16,42 | 17,21 | 20,38 | 23,56 | 24,34 | 26,41 | 28,12 | 29,23 | 29,61 |
| HGS-BR-F16-80 | 80 | 10,98 | 11,34 | 12,44 | 14,12 | 16,15 | 16,93 | 20,05 | 23,17 | 23,95 | 25,98 | 27,67 | 28,76 | 29,12 |
| HGS-BR-F16-81 | 81 | 10,80 | 11,16 | 12,23 | 13,88 | 15,89 | 16,65 | 19,72 | 22,79 | 23,55 | 25,55 | 27,21 | 28,28 | 28,64 |
| HGS-BR-F16-82 | 82 | 10,61 | 10,97 | 12,02 | 13,65 | 15,62 | 16,37 | 19,39 | 22,41 | 23,16 | 25,13 | 26,75 | 27,81 | 28,16 |
| HGS-BR-F16-83 | 83 | 10,43 | 10,78 | 11,82 | 13,42 | 15,35 | 16,09 | 19,06 | 22,02 | 22,76 | 24,70 | 26,29 | 27,33 | 27,68 |
| HGS-BR-F16-84 | 84 | 10,25 | 10,59 | 11,61 | 13,18 | 15,09 | 15,81 | 18,73 | 21,64 | 22,36 | 24,27 | 25,84 | 26,86 | 27,20 |
| HGS-BR-F16-85 | 85 | 10,07 | 10,41 | 11,41 | 12,95 | 14,82 | 15,53 | 18,39 | 21,26 | 21,97 | 23,84 | 25,38 | 26,38 | 26,72 |
| HGS-BR-F16-86 | 86 | 9,89 | 10,22 | 11,20 | 12,72 | 14,55 | 15,25 | 18,06 | 20,88 | 21,57 | 23,41 | 24,92 | 25,91 | 26,24 |
| HGS-BR-F16-87 | 87 | 9,71 | 10,03 | 11,00 | 12,48 | 14,29 | 14,97 | 17,73 | 20,49 | 21,18 | 22,98 | 24,47 | 25,43 | 25,76 |
| HGS-BR-F16-88 | 88 | 9,53 | 9,84 | 10,79 | 12,25 | 14,02 | 14,69 | 17,40 | 20,11 | 20,78 | 22,55 | 24,01 | 24,96 | 25,28 |
| HGS-BR-F16-89 | 89 | 9,34 | 9,66 | 10,59 | 12,02 | 13,75 | 14,41 | 17,07 | 19,73 | 20,39 | 22,12 | 23,55 | 24,48 | 24,79 |
| HGS-BR-F16-90 | 90 | 9,16 | 9,47 | 10,38 | 11,79 | 13,49 | 14,13 | 16,74 | 19,34 | 19,99 | 21,69 | 23,10 | 24,01 | 24,31 |

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
