---
modulo: 16
titulo: Modelo de calidad
estado: congelado
sprint: NKB-2.0
---

# 16 · Modelo de calidad

Cómo se gradúa una norma admitida. Desarrolla las seis dimensiones de `05` y
fija los criterios de nivel que aquel módulo dejó pendientes.

## La tensión que este módulo resuelve

NKB-1 dejó los criterios de nivel para este sprint. Este sprint prohíbe inventar
umbrales sin fundamento metodológico.

**Resolución congelada:**

> Los niveles se definen por **condiciones cualitativas verificables**, nunca
> por cortes numéricos. La suficiencia de una muestra se juzga contra el diseño
> del propio estudio y el estrato concreto, jamás contra un número elegido aquí.

Un umbral inventado —«N ≥ 100 es buena norma»— parecería riguroso y sería
arbitrario: la N necesaria depende de la variabilidad de la variable y del uso,
y ninguna fuente autoriza a fijarla en abstracto.

---

## Las once verificaciones

`05` congeló seis **dimensiones**. Este módulo las descompone en las
verificaciones concretas que las determinan. Cada una es una comprobación
binaria: se cumple o no se cumple.

| Código | Verificación | Dimensión |
|---|---|---|
| **V-01** | La publicación existe y es localizable | D-06 |
| **V-02** | La publicación es identificable de forma inequívoca | D-06 |
| **V-03** | La metodología está descrita y es verificable | D-03 |
| **V-04** | La población está definida por criterios | D-04 |
| **V-05** | El método permite juzgar comparabilidad | D-03 |
| **V-06** | Los datos normativos son recuperables sin reconstrucción | D-05 |
| **V-07** | La procedencia es trazable hasta el origen | D-06 |
| **V-08** | La aplicabilidad poblacional está delimitada | D-04 |
| **V-09** | El tamaño del estrato consta | D-02 |
| **V-10** | El muestreo permite juzgar representatividad | D-01 |
| **V-11** | La norma es reproducible con lo publicado | D-03, D-05 |

**V-11 es la verificación decisiva y la que más fuentes degrada:** ¿podría otro
equipo, con lo que la fuente publica, obtener una norma equivalente sobre otra
muestra de la misma población?

---

## Los cinco niveles

Se adopta la escala del ecosistema (NKB-ADR-09). Los criterios son cualitativos
y acumulativos: **un nivel exige todas las condiciones de los inferiores**.

### Alta

Todas las verificaciones se cumplen, **y además**:

- el estudio fue diseñado para producir valores normativos;
- el muestreo permite sostener que representa a la población declarada;
- la norma es reproducible con lo publicado (V-11).

### Moderada

Todas las verificaciones se cumplen, pero concurre alguna de estas:

- el estudio no fue diseñado como normativo, aunque publica datos utilizables;
- el muestreo no permite sostener representatividad, sin ser de conveniencia;
- la reproducibilidad es parcial: faltan detalles que no impiden usar la norma.

### Baja

Todas las verificaciones de admisión se cumplen —la norma entró—, pero:

- el muestreo es de conveniencia y la norma se presenta como poblacional; **o**
- el tamaño del estrato es claramente pequeño **en relación con la
  estratificación que la propia fuente propone**; **o**
- parte de los estadísticos son derivados (`21`).

### Muy baja

La norma es admisible, y concurre alguna de estas:

- el tamaño del estrato no consta y no puede estimarse (V-09 falla);
- el muestreo no se describe (V-10 falla);
- la definición de población es mínima aunque suficiente para admitirla.

### Insuficiente

**La norma no entra.** Es el resultado cuando falla alguna verificación que
también es criterio de admisión (`13`).

Se registra como fuente evaluada y detenida, no como norma de baja calidad.

---

## Sobre el tamaño muestral

Se congelan tres reglas y ningún número.

**1 · El N que cuenta es el del estrato, no el del estudio.** Un estudio de
miles de personas puede tener una docena en la celda que interesa, y la norma de
esa celda vale lo que valgan esas doce.

**2 · Se registra tal como la fuente lo publica.** Si no consta, se declara «no
consta»; nunca se estima ni se reparte proporcionalmente entre estratos.

**3 · La suficiencia es relativa al diseño, no absoluta.** La pregunta no es «¿N
supera un umbral?» sino «¿la fuente sostiene que esa N respalda la
estratificación que publica?».

| Estado del N | Cómo se registra |
|---|---|
| Informado por estrato | Se registra tal cual |
| Informado solo global | Se registra como global y se declara que no hay N por estrato |
| Desconocido | «No consta» |
| Insuficiente según la propia fuente | Se registra junto con la advertencia de la fuente |

---

## Calidad de la norma frente a confianza de la admisión

Dos ejes distintos, ambos obligatorios en el contrato (CN-29 y CN-31).

| | Calidad de la norma | Confianza de la admisión |
|---|---|---|
| **Valora** | La evidencia | Nuestra decisión |
| **Responde** | ¿Cuánto respalda esta norma? | ¿Cuán seguros estamos de haberla admitido bien? |
| **Baja cuando** | La fuente es débil | Algún criterio se resolvió con juicio y no por lectura directa |

Una norma puede ser de calidad **alta** y admitirse con confianza **media** —por
ejemplo, si el estrato de edad se dedujo del texto en lugar de leerse en una
tabla—. Fundir ambos ejes ocultaría exactamente el punto donde alguien tuvo que
interpretar.

## Reevaluación

Un nivel puede cambiar sin que la fuente cambie: cuando los criterios se afinan,
o cuando se detecta algo no visto al incorporarla.

Toda reevaluación registra el nivel anterior, la fecha y el motivo (`23`). Un
nivel que cambia en silencio hace imposible saber con qué calidad se publicó
algo el mes pasado.

## Lo que este módulo NO decide

- **Ningún umbral numérico**, en ninguna dimensión.
- **Ninguna ponderación** entre dimensiones: no hay puntuación agregada, y por
  eso el contrato exige declarar **qué** dimensión degradó la norma (CN-30).
- **Ningún nivel concreto** para ninguna norma: no hay normas todavía.
