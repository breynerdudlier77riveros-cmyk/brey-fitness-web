---
modulo: 00
titulo: Introducción
estado: v1.0
---

# 00 · Introducción

## Qué es la PKB

La autoridad científica del PAS. Responde **cinco preguntas** sobre cada prueba de evaluación
física, y ninguna más:

1. ¿Qué mide realmente?
2. ¿A qué capacidad puede alimentar, y con cuánto respaldo?
3. ¿En qué población se estudió?
4. ¿Cuándo NO puede utilizarse?
5. ¿Qué interpretación está prohibida?

## Qué NO es

| No es | Por qué |
|---|---|
| Un manual de protocolos | No dice cómo ejecutar una prueba; dice qué se sabe de ella |
| Una batería recomendada | No prescribe qué evaluar: eso depende de un objetivo que el PAS no conoce |
| Una fuente de valores normativos | Salvo cuando una referencia los aporta y se cita explícitamente |
| Un sistema de puntuación | No convierte resultados en notas |
| Una guía clínica | No diagnostica, no clasifica riesgo, no deriva a nadie |

## La regla que gobierna todo

> Ninguna afirmación entra sin referencia verificada.

Verificada significa: localizada, con título, publicación y localizador comprobados. Los campos
que no se pudieron confirmar se **omiten**, nunca se completan por plausibilidad. Varias entradas
de `_evidencia/referencias.yaml` carecen de autoría por ese motivo, y el hueco es deliberado.

Cuando la evidencia no alcanza, la ficha escribe **«Evidencia insuficiente»**. Es una respuesta
válida y frecuente: en v1.0 lo es para la mayoría de las correspondencias posibles.

## Las tres prohibiciones

**1 · No extrapolar entre poblaciones.** Un hallazgo en adultos mayores no se traslada a atletas
jóvenes, ni al revés. La población estudiada es parte de la afirmación, no un detalle del método.

**2 · No convertir correlación en equivalencia.** Que dos medidas correlacionen no significa que
una mida a la otra. Es el error que produce la mayoría de las correspondencias falsas.

**3 · No inferir capacidad no evaluada.** Un resultado alto en una prueba no informa de las
capacidades que esa prueba no toca. Es el límite L-06 del PAS, y aquí es también una regla
documental.

## Cómo se usa

La PKB alimenta el **catálogo** que consume el Performance Assessment Engine. La cadena es:

```
Referencia verificada  →  Ficha de prueba  →  Fila de la matriz  →  Contribución del catálogo
   (referencias.yaml)        (02)                 (09)                  (dato del PAE)
```

Una contribución sin clave de referencia no entra al catálogo (invariante I-10 del PAS). El motor
ya lo comprueba: emite el conflicto `contribucion_sin_referencia` y no aplica la contribución.

**La PKB no es código y el motor no la importa.** El paso de la matriz al catálogo lo hará una
persona, no un parser: convertirlo en automático haría que un cambio de redacción alterase
silenciosamente lo que el sistema afirma.

## Por qué la mayoría de la matriz queda vacía

Porque la pregunta que hay que responder para llenarla es exigente. No basta con que una prueba
«tenga que ver» con una capacidad: hay que poder citar una fuente que haya estudiado justo esa
relación, en una población nombrada, con una metodología descrita.

La literatura de evaluación física está desproporcionadamente concentrada en **fiabilidad** —cuán
reproducible es una medida— y muy poco en **validez de constructo** —si esa medida representa la
capacidad que se le atribuye—. Se sabe con mucha precisión que el CMJ se repite bien; se sabe
bastante peor qué significa exactamente su altura.

Esa asimetría es la deuda científica de fondo del PAS, y está documentada en `11-contradicciones.md`
y `12-roadmap.md`.
