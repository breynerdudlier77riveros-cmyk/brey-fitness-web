---
ficha: HGS-DE-TN1
tipo_norma: TN-1
estado: ES-1
referencia: steiber_hgs_alemania_2016
sprint: NKB-3.0
---

# Ficha · Fuerza de prensión manual · percentil 50 · población alemana

**28 normas** —14 grupos de edad × 2 sexos—.

> **Por qué es una ficha aparte de `HGS-DE-TN2`.** Comparten las cuatro
> coordenadas de identidad y **difieren en tipo**. NKB-2 (`15`) congela que una
> norma es de un solo tipo: cuando una fuente publica media con dispersión y
> además una mediana, son **dos normas distintas**, no una con dos caras.
> Fundirlas permitiría después derivar una desde la otra sin que se notara.

---

## Bloque A · Identidad

Idéntica a `HGS-DE-TN2` en las cuatro coordenadas:

| Campo | Contenido |
|---|---|
| **CN-01 Variable** | Fuerza máxima de prensión manual |
| **CN-02 Definición operacional** | Máximo de dos intentos por mano, tomando el mayor de ambas manos |
| **CN-03 Método** | Dinamometría de prensión con dinamómetro Smedley S (Tokio, 100 kg) |
| **CN-04 Población** | Población residente en Alemania, 17–90 años, del panel socioeconómico alemán |
| **CN-05 Estrato** | Sexo × grupo de edad (14 grupos) |

## Bloque B · Medida

| Campo | Contenido |
|---|---|
| **CN-06 Unidad** | Kilogramos |
| **CN-07 Instrumento** | Smedley S Dynamometer Tokio 100 kg |
| **CN-08 Parámetros** | Dos mediciones por mano; se registra el máximo de ambas |

Mismos parámetros no publicados que en `HGS-DE-TN2`: posición, ángulo del codo,
mano dominante y calentamiento.

## Bloque C · Distribución

| Campo | Contenido |
|---|---|
| **CN-09 Tipo** | TN-1 · percentil |
| **CN-10 Estadísticos** | **Un único percentil declarado: P50** (tabla inferior) |
| **CN-11 Forma de la distribución** | No consta |
| **CN-12 Clasificación** | No aplica |

> **Solo hay un percentil.** Esta norma permite decir si un valor queda por
> encima o por debajo de la mediana de su celda, y **nada más**. No sitúa un
> valor en ninguna otra posición de la distribución, y completar la curva
> ajustando una función sería el caso CR-16.

## Bloque D · Población y muestra

Los valores coinciden con los de `HGS-DE-TN2` porque proceden de la misma
muestra. **Se enumeran igualmente:** el contrato exige los 40 campos en cada
ficha, y una remisión por rango dejaría campos sin declarar.

| Campo | Contenido |
|---|---|
| **CN-13 Inclusión** | 17–90 años; varones 160–200 cm; mujeres 150–184 cm |
| **CN-14 Exclusión** | Prensión < 10 kg; atípicos con residuo estandarizado > ±3 DT; el 5% con peor puntuación en la escala de componente físico del cuestionario de salud SF-12 |
| **CN-15 Tamaño por estrato** | Publicado por celda (columna N) |
| **CN-16 Muestreo** | Panel de hogares nacionalmente representativo; valores ponderados |
| **CN-17 Sexo** | Estratificado |
| **CN-18 Edad** | Estratificada en 14 grupos |
| **CN-19 Nivel de práctica** | No es criterio de esta población |
| **CN-20 Contexto** | Alemania. Datos de panel; la fuente no fecha la ola concreta de recogida |

## Bloque E · Procedencia

| Campo | Contenido |
|---|---|
| **CN-21 Referencia** | `steiber_hgs_alemania_2016` |
| **CN-22 Identificador persistente** | Registrado en la referencia |
| **CN-23 Fecha** | 2016 |
| **CN-24 Naturaleza** | Estudio original |
| **CN-25 Cadena** | Ninguna: acceso directo a la primaria |
| **CN-26 Ubicación** | Tabla suplementaria S3, columna «P50» |

## Bloque F · Estado y calidad

| Campo | Contenido |
|---|---|
| **CN-27 Estado** | ES-1 · Activa |
| **CN-28 Estado de la fuente** | Vigente |
| **CN-29 Calidad** | **Moderada** |
| **CN-30 Dimensiones que la degradaron** | D-03: el protocolo está descrito de forma incompleta (V-05 parcial). D-05: la fuente publica **un único percentil**, el P50, lo que impide situar un valor en ningún otro punto de la distribución |
| **CN-31 Confianza de la admisión** | **Alta.** Valores leídos directamente |

## Bloque G · Alcance y límites

| Campo | Contenido |
|---|---|
| **CN-32 Limitaciones de la fuente** | Valores no estandarizados por altura |
| **CN-33 Limitaciones añadidas** | Un único percentil; protocolo incompleto; población acotada; contexto temporal no fechado |
| **CN-34 Alcance** | Personas de 17 a 90 años residentes en Alemania, dentro de los rangos de estatura declarados, excluido el extremo de peor salud física autopercibida |
| **CN-35 Origen del dato** | OR-1 · Explícito |

## Bloque H · Traza

| Campo | Contenido |
|---|---|
| **CN-36 Incorporó** | Sprint NKB-3.0 |
| **CN-37 Fecha** | 2026-08-08 |
| **CN-38 Versión de criterios** | NKB-2.0 |
| **CN-39 Conflictos** | Ninguno |
| **CN-40 Sustitución** | Ninguna |

---

## Las 28 normas · P50

| Id | Edad | Sexo | P50 (kg) | N |
|---|---|---|---|---|
| HGS-DE-P50-F-01 | 17–19 | Mujeres | 31,4 | 526 |
| HGS-DE-P50-F-02 | 20–24 | Mujeres | 32,0 | 799 |
| HGS-DE-P50-F-03 | 25–29 | Mujeres | 33,5 | 809 |
| HGS-DE-P50-F-04 | 30–34 | Mujeres | 33,0 | 942 |
| HGS-DE-P50-F-05 | 35–39 | Mujeres | 34,0 | 1 144 |
| HGS-DE-P50-F-06 | 40–44 | Mujeres | 34,5 | 1 357 |
| HGS-DE-P50-F-07 | 45–49 | Mujeres | 33,0 | 1 372 |
| HGS-DE-P50-F-08 | 50–54 | Mujeres | 32,0 | 1 291 |
| HGS-DE-P50-F-09 | 55–59 | Mujeres | 30,0 | 1 092 |
| HGS-DE-P50-F-10 | 60–64 | Mujeres | 29,0 | 1 004 |
| HGS-DE-P50-F-11 | 65–69 | Mujeres | 28,0 | 947 |
| HGS-DE-P50-F-12 | 70–74 | Mujeres | 26,0 | 895 |
| HGS-DE-P50-F-13 | 75–79 | Mujeres | 24,0 | 522 |
| HGS-DE-P50-F-14 | 80–90 | Mujeres | 21,0 | 420 |
| HGS-DE-P50-M-01 | 17–19 | Varones | 48,5 | 538 |
| HGS-DE-P50-M-02 | 20–24 | Varones | 50,5 | 782 |
| HGS-DE-P50-M-03 | 25–29 | Varones | 52,0 | 710 |
| HGS-DE-P50-M-04 | 30–34 | Varones | 53,0 | 730 |
| HGS-DE-P50-M-05 | 35–39 | Varones | 52,5 | 924 |
| HGS-DE-P50-M-06 | 40–44 | Varones | 54,0 | 1 172 |
| HGS-DE-P50-M-07 | 45–49 | Varones | 53,0 | 1 294 |
| HGS-DE-P50-M-08 | 50–54 | Varones | 50,5 | 1 189 |
| HGS-DE-P50-M-09 | 55–59 | Varones | 49,0 | 1 010 |
| HGS-DE-P50-M-10 | 60–64 | Varones | 46,5 | 950 |
| HGS-DE-P50-M-11 | 65–69 | Varones | 44,0 | 1 019 |
| HGS-DE-P50-M-12 | 70–74 | Varones | 42,0 | 915 |
| HGS-DE-P50-M-13 | 75–79 | Varones | 38,0 | 582 |
| HGS-DE-P50-M-14 | 80–90 | Varones | 33,0 | 350 |

## Lo que estas normas NO permiten afirmar

1. **No sitúan un valor** en ninguna posición distinta de «por encima» o «por
   debajo» de la mediana.
2. **No se combinan con `HGS-DE-TN2`** para reconstruir la distribución: sería
   una derivación sin supuesto sostenido por la fuente (`21`).
3. **No convierten P50 en categoría.** «Por encima de la mediana» no es bueno,
   suficiente ni esperable (`15`, TN-1).
