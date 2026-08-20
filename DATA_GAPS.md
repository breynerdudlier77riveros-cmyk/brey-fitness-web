# DATA_GAPS · Campos que la evidencia exige y el PAS no registra

> Sprint PAS-10E · §25 · **Ninguna migración escrita. Ninguna tabla modificada.**
>
> Este documento existe para que la decisión de ampliar el modelo de datos se
> tome mirando qué evidencia queda bloqueada por cada campo, y no al revés.

---

## G-01 · Masa corporal del atleta

| | |
|---|---|
| **Campo** | `pas_atletas.peso_kg` (numeric, nullable) |
| **Pruebas que lo necesitan** | P-01, P-02 |
| **Evidencia que lo exige** | `van_den_hoek_powerlifting_2024` publica sus percentiles como razón carga ÷ masa corporal. La práctica recomendada del IMTP es informar en N/kg. |
| **Estado sin el campo** | `NO_DETERMINABLE` — la evidencia existe y es compatible; falta el dato |
| **¿Bloquea la interpretación?** | Sí, la normativa. No la longitudinal ni la de objetivo |

**Por qué no puede resolverse con lo que ya hay.** `bcs_mediciones.peso_kg`
existe, pero pertenece a los clientes que el profesional mide como entrenador:
otra persona, otro expediente, otra relación. Reutilizarlo cruzaría dos sujetos
distintos. `profiles.peso` describe al profesional, no al atleta.

**Riesgo de introducirlo.** Bajo en lo técnico: es aditivo y nullable, como
`estatura_cm` en PRS-2.2. El riesgo real es de producto: la masa corporal
cambia entre evaluaciones, así que **no puede vivir en la ficha del atleta como
un dato fijo**. Si se registra en `pas_atletas`, el sistema usará el peso de hoy
para interpretar una medición de hace ocho meses.

**Recomendación.** Registrarlo por evaluación, no por atleta — junto a la
medición o en la cabecera de la evaluación. Es más trabajo y es lo correcto.

---

## G-02 · Longitud de pierna

| | |
|---|---|
| **Campo** | Longitud de pierna en cm, por lado |
| **Pruebas que lo necesitan** | P-08 |
| **Evidencia que lo exige** | La PKB registra que la longitud de pierna obliga a normalizar el Y-Balance. Los valores absolutos y los normalizados no son la misma variable |
| **Estado sin el campo** | El registro puede declarar `normalizado`, así que hoy no bloquea: bloquea calcular la normalización desde un valor absoluto |
| **¿Bloquea la interpretación?** | Solo si el profesional registra centímetros absolutos |

**Recomendación.** No introducirlo todavía. La condición `normalizado` ya
distingue las dos variables, y pedir la longitud de pierna solo tiene sentido si
el sistema va a hacer la conversión — que sería una derivación, y todavía no hay
motivo para asumirla.

---

## G-03 · Asimetría entre lados

| | |
|---|---|
| **Campo** | No es un campo: es un modelo de registro |
| **Pruebas que lo necesitan** | P-08 |
| **Evidencia que lo exige** | La variable con más respaldo del Y-Balance es la diferencia entre lados, no el valor de una pierna |
| **Estado sin él** | La condición `lado` ya permite registrar cada pierna por separado |
| **¿Bloquea la interpretación?** | Sí, la de asimetría. No la de alcance |

**Qué falta exactamente.** Nada en la base. Falta una lectura que empareje dos
registros de la misma evaluación con distinto `lado` y calcule la diferencia.
Es trabajo de la capa de evidencia, no del modelo de datos, y queda fuera de
este sprint porque la única cifra de MDC localizada para esa diferencia procede
de una fuente sin verificar.

---

## G-04 · Componentes del RSI

| | |
|---|---|
| **Campo** | Altura de salto (cm) y tiempo de contacto (ms), junto al índice |
| **Pruebas que lo necesitan** | P-05 |
| **Evidencia que lo exige** | `rsi_metaanalisis_2021` desaconseja **expresamente** informar el índice sin sus dos componentes |
| **Estado sin el campo** | El índice se registra y se sigue, pero un cambio no puede atribuirse a ninguno de los dos |
| **¿Bloquea la interpretación?** | Sí, la longitudinal: un RSI estable puede esconder altura y tiempo subiendo a la vez |

**Riesgo de introducirlo.** Ninguno científico. Es el gap más barato de cerrar y
el que más recupera: convierte una prueba opaca en una legible.

---

## G-05 · Nivel deportivo y disciplina

| | |
|---|---|
| **Campo** | `pas_atletas.deporte` ya existe. Falta el **nivel** |
| **Pruebas que lo necesitan** | P-01, P-04, P-05, P-11 (toda la evidencia de nivel C) |
| **Evidencia que lo exige** | Los benchmarks deportivos se publican por nivel de competición |
| **Estado sin el campo** | Un benchmark de competidores federados no puede aplicarse a nadie sin saber si compite |
| **¿Bloquea la interpretación?** | Sí, toda la evidencia de tipo BENCHMARK |

**Riesgo de introducirlo.** Alto, y conviene decirlo. «Nivel deportivo» no tiene
una taxonomía universal: recreativo / entrenado / competidor / élite significa
cosas distintas en cada literatura. Un vocabulario inventado aquí se convertiría
en una clasificación del atleta sin fuente — exactamente lo que este sistema no
hace.

**Recomendación.** No introducirlo hasta tener una fuente que defina sus
categorías. Mientras tanto, los benchmarks se quedan sin aplicar, y decirlo es
más honesto que aplicarlos a ciegas.

---

## G-06 · País de la norma frente a país del atleta — **RESUELTO**

> Resuelto en PAS-11.2 **por variable**, como pedía el encargo, y con evidencia
> recuperada en origen. La conclusión coincide con el comportamiento que ya
> tenía el sistema; lo que cambia es que ahora está justificada.

### Decisión: el país SE MANTIENE como condición para las dos variables

| Variable | Fuente | Evidencia de efecto poblacional | Decisión |
|---|---|---|---|
| Altura de salto (P-04) | CHMS · Canadá | Rouis 2016: ~10 cm entre grupos de ascendencia distinta, p < 0,001 | **Mantener `pais`** |
| Sit-and-reach (P-06) | CHMS · Canadá | Proporciones de segmentos; la PKB ya lo registra como factor de confusión | **Mantener `pais`** |

### P-04 · Salto

`rouis_etnia_salto_2016` (J Hum Kinet 51:209-216, PMID 28149384) mide 62,9 ± 6,7
cm frente a 52,9 ± 4,4 cm entre varones afrocaribeños y caucásicos, **con brazos
libres** — exactamente el protocolo del CHMS.

Diez centímetros cruzan **cuatro bandas de percentil** de la propia tabla
canadiense (P5 = 32,6; P95 = 63,8 en varones de 20-24). La composición
poblacional de una muestra nacional canadiense no es la de una colombiana, así
que trasladar la tabla sería una suposición con evidencia en contra.

*Limitación de esta evidencia, que conviene decir*: n = 31, y compara
ascendencias, no países. No demuestra que Canadá y Colombia difieran; demuestra
que la composición de la muestra importa lo bastante como para no ignorarla.

### P-06 · Sit-and-reach

Aquí la evidencia decisiva **ya estaba dentro del proyecto**. La ficha de la PKB
registra como factor de confusión: «Proporciones corporales. Brazos largos y
piernas cortas alcanzan más sin más extensibilidad.»

El sit-and-reach mide una **distancia alcanzada**, que es función de la razón
entre longitud de brazos y de piernas. Las proporciones de segmentos varían de
forma sistemática entre poblaciones, así que la composición de la muestra
confunde la comparación directamente — y más que en el salto, porque aquí el
confusor es geométrico y no fisiológico.

### Qué gana el sistema con esto

Nada en el código: el comportamiento ya era este. Lo que gana es que
`EVIDENCIA_NO_COMPATIBLE` deja de ser un valor por defecto conservador y pasa a
ser una **conclusión con fuente**. Y el informe puede decir lo que el §7 del
encargo pedía: «existe una norma poblacional adulta para esta prueba, y no
corresponde a tu población».

### Qué reabriría la decisión

Una fuente que publique percentiles de estas variables en población colombiana o
latinoamericana adulta. No se ha localizado ninguna.

---

## Resumen

| Gap | Pruebas | Bloquea | Recomendación |
|---|---|---|---|
| G-01 · Masa corporal | P-01, P-02 | Normativa | **Introducir, por evaluación** |
| G-02 · Longitud de pierna | P-08 | Parcialmente | Esperar |
| G-03 · Asimetría | P-08 | Interpretación | Capa de evidencia, no datos |
| G-04 · Componentes del RSI | P-05 | Longitudinal | **Introducir** |
| G-05 · Nivel deportivo | P-01, P-04, P-05, P-11 | Benchmarks | No introducir todavía |
| G-06 · País de la norma | P-04, P-06 | Normativa | **RESUELTO: mantener país** |

Dos gaps recomendados, tres en espera, uno resuelto con evidencia.
Ninguna migración se ha escrito.
