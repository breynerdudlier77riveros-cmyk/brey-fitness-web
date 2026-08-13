---
ficha: HGS-BR-TN1-M167
tipo_norma: TN-1
estado: ES-1 (5 normas en ES-2)
referencia: reichenheim_hgs_brasil_2021
sprint: NKB-3.4
---

# Ficha · Fuerza de prensión manual · percentiles · mayores de Brasil · varones de 1,60 a 1,70 m

**26 normas** —una por edad, de 65 a 90 años— cada una con 13 percentiles.

> Uno de los seis estratos sexo × estatura que publica la fuente. Ficha
> autosuficiente: **no hereda ningún campo** de las otras cinco (`30`, B2).

> **Cinco de estas 26 normas están en ES-2 · Cuestionada.** La tabla publica un
> P50 constante de 28,06 kgf para las edades de 86 a 90, valor que **supera al
> P75 de esas mismas filas**. Se transcribe tal cual y se marca; no se corrige,
> no se borra y no se recalcula. Detalle en «Anomalías conservadas».

---

## Bloque A · Identidad

| Campo | Contenido |
|---|---|
| **CN-01 Variable** | Fuerza máxima de prensión manual de la **mano dominante** |
| **CN-02 Definición operacional** | Media de la segunda y tercera de tres repeticiones con la mano dominante |
| **CN-03 Método** | Dinamometría hidráulica JAMAR, modelo J00105 (Lafayette Instruments), en sedestación, según el protocolo de la American Society of Hand Therapists |
| **CN-04 Población** | Personas mayores de 65 a 90 años residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-05 Estrato** | Varones de estatura > 1,60 y ≤ 1,70 m × edad (26 edades) |

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
| **CN-26 Ubicación del dato** | Tabla suplementaria S2, «Hand grip strength (kgf) projected for male from >1.6 to 1.7 meters for a wide array of centiles» |

## Bloque F · Estado y calidad

| Campo | Contenido |
|---|---|
| **CN-27 Estado** | ES-1 · Activa para 21 normas · **ES-2 · Cuestionada** para las 5 marcadas ⚠ |
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
| **CN-34 Alcance** | Varones de más de 1,60 m y hasta 1,70 m, de 65 a 90 años, residentes en Brasil, con envejecimiento satisfactorio según los criterios del estudio |
| **CN-35 Origen del dato** | OR-1 · Explícito en la tabla suplementaria S2 |

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

Valores tal como los publica la tabla S2.

| Id | Edad | P2,5 | P3 | P5 | P10 | P20 | P25 | P50 | P75 | P80 | P90 | P95 | P97 | P97,5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HGS-BR-M167-65 | 65 | 35,98 | 36,00 | 36,05 | 36,13 | 36,22 | 36,26 | 36,40 | 36,55 | 36,59 | 36,68 | 36,76 | 36,81 | 36,83 |
| HGS-BR-M167-66 | 66 | 35,57 | 35,58 | 35,63 | 35,71 | 35,81 | 35,84 | 35,99 | 36,13 | 36,17 | 36,26 | 36,34 | 36,39 | 36,41 |
| HGS-BR-M167-67 | 67 | 35,15 | 35,17 | 35,22 | 35,29 | 35,39 | 35,42 | 35,57 | 35,71 | 35,75 | 35,85 | 35,92 | 35,97 | 35,99 |
| HGS-BR-M167-68 | 68 | 34,73 | 34,75 | 34,80 | 34,88 | 34,97 | 35,01 | 35,15 | 35,30 | 35,33 | 35,43 | 35,51 | 35,56 | 35,57 |
| HGS-BR-M167-69 | 69 | 34,31 | 34,33 | 34,38 | 34,46 | 34,55 | 34,59 | 34,74 | 34,88 | 34,92 | 35,01 | 35,09 | 35,14 | 35,16 |
| HGS-BR-M167-70 | 70 | 33,90 | 33,91 | 33,96 | 34,04 | 34,14 | 34,17 | 34,32 | 34,46 | 34,50 | 34,59 | 34,67 | 34,72 | 34,74 |
| HGS-BR-M167-71 | 71 | 33,48 | 33,50 | 33,55 | 33,63 | 33,72 | 33,76 | 33,90 | 34,05 | 34,08 | 34,18 | 34,26 | 34,31 | 34,32 |
| HGS-BR-M167-72 | 72 | 33,06 | 33,08 | 33,13 | 33,21 | 33,30 | 33,34 | 33,48 | 33,63 | 33,67 | 33,76 | 33,84 | 33,89 | 33,91 |
| HGS-BR-M167-73 | 73 | 32,65 | 32,66 | 32,71 | 32,79 | 32,89 | 32,92 | 33,07 | 33,21 | 33,25 | 33,34 | 33,42 | 33,47 | 33,49 |
| HGS-BR-M167-74 | 74 | 32,23 | 32,25 | 32,30 | 32,37 | 32,47 | 32,50 | 32,65 | 32,79 | 32,83 | 32,93 | 33,00 | 33,05 | 33,07 |
| HGS-BR-M167-75 | 75 | 31,81 | 31,83 | 31,88 | 31,96 | 32,05 | 32,09 | 32,23 | 32,38 | 32,41 | 32,51 | 32,59 | 32,64 | 32,65 |
| HGS-BR-M167-76 | 76 | 31,39 | 31,41 | 31,46 | 31,54 | 31,63 | 31,67 | 31,82 | 31,96 | 32,00 | 32,09 | 32,17 | 32,22 | 32,24 |
| HGS-BR-M167-77 | 77 | 30,98 | 30,99 | 31,04 | 31,12 | 31,22 | 31,25 | 31,40 | 31,54 | 31,58 | 31,67 | 31,75 | 31,80 | 31,82 |
| HGS-BR-M167-78 | 78 | 30,56 | 30,58 | 30,63 | 30,71 | 30,80 | 30,84 | 30,98 | 31,13 | 31,16 | 31,26 | 31,33 | 31,39 | 31,40 |
| HGS-BR-M167-79 | 79 | 30,14 | 30,16 | 30,21 | 30,29 | 30,38 | 30,42 | 30,56 | 30,71 | 30,75 | 30,84 | 30,92 | 30,97 | 30,99 |
| HGS-BR-M167-80 | 80 | 29,73 | 29,74 | 29,79 | 29,87 | 29,97 | 30,00 | 30,15 | 30,29 | 30,33 | 30,42 | 30,50 | 30,55 | 30,57 |
| HGS-BR-M167-81 | 81 | 29,31 | 29,33 | 29,38 | 29,45 | 29,55 | 29,58 | 29,73 | 29,87 | 29,91 | 30,01 | 30,08 | 30,13 | 30,15 |
| HGS-BR-M167-82 | 82 | 28,89 | 28,91 | 28,96 | 29,04 | 29,13 | 29,17 | 29,31 | 29,46 | 29,49 | 29,59 | 29,67 | 29,72 | 29,73 |
| HGS-BR-M167-83 | 83 | 28,47 | 28,49 | 28,54 | 28,62 | 28,71 | 28,75 | 28,90 | 29,04 | 29,08 | 29,17 | 29,25 | 29,30 | 29,32 |
| HGS-BR-M167-84 | 84 | 28,06 | 28,07 | 28,12 | 28,20 | 28,30 | 28,33 | 28,48 | 28,62 | 28,66 | 28,75 | 28,83 | 28,88 | 28,90 |
| HGS-BR-M167-85 | 85 | 27,64 | 27,66 | 27,71 | 27,79 | 27,88 | 27,92 | 28,06 | 28,21 | 28,24 | 28,34 | 28,41 | 28,47 | 28,48 |
| HGS-BR-M167-86 ⚠ | 86 | 27,22 | 27,24 | 27,29 | 27,37 | 27,46 | 27,50 | 28,06 | 27,79 | 27,82 | 27,92 | 28,00 | 28,05 | 28,07 |
| HGS-BR-M167-87 ⚠ | 87 | 26,81 | 26,82 | 26,87 | 26,95 | 27,05 | 27,08 | 28,06 | 27,37 | 27,41 | 27,50 | 27,58 | 27,63 | 27,65 |
| HGS-BR-M167-88 ⚠ | 88 | 26,39 | 26,41 | 26,46 | 26,53 | 26,63 | 26,66 | 28,06 | 26,95 | 26,99 | 27,09 | 27,16 | 27,21 | 27,23 |
| HGS-BR-M167-89 ⚠ | 89 | 25,97 | 25,99 | 26,04 | 26,12 | 26,21 | 26,25 | 28,06 | 26,54 | 26,57 | 26,67 | 26,75 | 26,80 | 26,81 |
| HGS-BR-M167-90 ⚠ | 90 | 25,55 | 25,57 | 25,62 | 25,70 | 25,79 | 25,83 | 28,06 | 26,12 | 26,16 | 26,25 | 26,33 | 26,38 | 26,40 |

## Anomalías conservadas

**El P50 se congela en 28,06 kgf desde los 86 años.** Todas las demás columnas
siguen descendiendo con la edad, de modo que a partir de esa edad el P50 publicado
**es mayor que el P75 de su propia fila**, lo que es internamente imposible en una
distribución.

| Edad | P50 publicado | P75 publicado | ¿P50 ≤ P75? |
|---|---|---|---|
| 86 | **28,06** | 27,79 | **No** |
| 87 | **28,06** | 27,37 | **No** |
| 88 | **28,06** | 26,95 | **No** |
| 89 | **28,06** | 26,54 | **No** |
| 90 | **28,06** | 26,12 | **No** |

**Qué se hace y qué no.** Se transcribe el valor publicado, sin excepción. Las
cinco normas afectadas pasan a **ES-2 · Cuestionada** (`23`): hay una objeción
registrada y sin resolver, y pueden aplicarse **solo con esa advertencia
delante**.

**Qué quedaría por hacer.** Solo la fuente puede resolverlo. Mientras no publique
una corrección, la objeción sigue abierta. Interpolar, suavizar o sustituir el
valor por el de la fila anterior sería fabricar un dato que nadie publicó (`21`).

> Primera vez que la NKB usa **ES-2** desde que se congeló en NKB-2.0. El estado
> existía para exactamente esto: una norma sobre la que hay una duda concreta y
> que no debe ni borrarse ni usarse a ciegas.


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
