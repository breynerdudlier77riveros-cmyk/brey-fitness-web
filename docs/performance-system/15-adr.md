---
modulo: 15
titulo: Decisiones de dominio (ADR)
estado: congelado
---

# 15 · Decisiones de dominio

Las decisiones que podrían haberse tomado de otra manera, con lo que se descartó y qué cuesta
cada una. Una decisión sin alternativa descartada no es una decisión: es una descripción.

---

## PAS-ADR-01 · El sistema no se llama BPS

**Contexto.** El encargo lo llamaba *BREY Performance System (BPS)*. Ese acrónimo ya designa al
orquestador del ciclo de vida del usuario, implementado en `src/lib/engines/bps/` y documentado en
`docs/motor-bps/` (17 módulos), con su propia máquina de estados y su propio «Diagnóstico».

**Decisión.** El sistema se llama **Performance Assessment System (PAS)**. Su salida es el
**Perfil Funcional**, nunca «diagnóstico». La carpeta conserva el nombre pedido:
`docs/performance-system/`.

**Alternativas descartadas.**

| Alternativa | Por qué no |
|---|---|
| Reutilizar «BPS» | *BPS*, *estado* y *diagnóstico* pasarían a significar dos cosas cada uno |
| Renombrar el Motor BPS | Está implementado, documentado y en uso; el coste recae sobre lo que ya funciona |
| Calificadores («BPS-Eval», «BPS funcional») | La ambigüedad sobrevive en conversación, que es donde hace daño |

**Consecuencias.** Un sprint cuyo objetivo es congelar el lenguaje no puede entregar tres
homónimos. Si prefieres otro nombre, es una sustitución mecánica: ninguna decisión de dominio
depende de él.

---

## PAS-ADR-02 · La relación prueba↔capacidad es N a M

**Contexto.** Una correspondencia 1 a 1 sería mucho más simple de modelar y de derivar.

**Decisión.** Una prueba puede contribuir a varias capacidades, y una capacidad recibe de varias
pruebas, con peso relativo.

**Descartado.** 1 a 1, y «una prueba principal por capacidad».

**Consecuencias.** Toda la complejidad de elegibilidad, incertidumbre y traza deriva de aquí. Se
asume porque una prueba rara vez informa de una sola dimensión, y forzar el 1 a 1 obligaría a
mentir sobre lo que cada prueba aporta.

---

## PAS-ADR-03 · No existe puntuación global

**Contexto.** Un número único por atleta es lo que casi todo producto de este tipo entrega.

**Decisión.** No hay puntuación global, ni por dominio, ni por perfil.

**Descartado.** Índice compuesto; puntuación por dominio; nivel general.

**Consecuencias.** El perfil es más difícil de mostrar en una pantalla. A cambio, no se pierde la
información que existe para conservar: resumir exigiría ponderar capacidades entre sí, y ninguna
evidencia sostiene esa ponderación sin conocer el objetivo del atleta —que el ecosistema declara
no conocer.

---

## PAS-ADR-04 · Un conflicto no se resuelve por criterio

**Contexto.** Dos registros elegibles e irreconciliables. Hay que devolver algo.

**Decisión.** Se devuelve **el conflicto**. Ni el más reciente, ni el mejor, ni el promedio.

**Descartado.** Cada una de esas tres reglas.

**Consecuencias.** Es la decisión más contraintuitiva del modelo. Las tres alternativas son
hipótesis sobre lo ocurrido —que el atleta cambió, que tuvo un mal día, que hubo ruido de
medición— y el sistema no dispone de información para elegir entre ellas. El conflicto se resuelve
con dato nuevo (T-03 Reevaluación), no con criterio.

---

## PAS-ADR-05 · Cinco estados de capacidad, no dos

**Contexto.** «Evaluada / no evaluada» bastaría para un primer modelo.

**Decisión.** Cinco estados excluyentes: Evaluada, Parcialmente evaluada, Desactualizada, En
conflicto, Desconocida.

**Descartado.** El binario; y un sexto estado «estimada».

**Consecuencias.** *Desconocida* y *desactualizada* dicen cosas distintas —nunca se supo frente a
se supo y caducó— y un motor consumidor puede actuar distinto ante cada una. Colapsarlas ahorraría
tres estados y perdería exactamente la información por la que existe el sistema.

---

## PAS-ADR-06 · Ninguna correspondencia se fija en el Sprint 1

**Contexto.** Sin correspondencias, el sistema no deriva nada. La tentación de dejar «unas cuantas
obvias» es fuerte.

**Decisión.** Cero correspondencias concretas en v1.0.

**Descartado.** Un conjunto inicial «evidente», revisable después.

**Consecuencias.** Al cerrar el Sprint 2 el sistema registrará pruebas sin poder derivar ningún
perfil. Se asume: afirmar que una prueba mide una capacidad es una afirmación científica, y una
correspondencia provisional se vuelve permanente en cuanto algo la consume.

---

## PAS-ADR-07 · El Atleta es una entidad propia

**Contexto.** Ya existen el Usuario de la aplicación y el Cliente del BCS.

**Decisión.** El Atleta es un rol del PAS. La correspondencia con las otras dos identidades se
resuelve **fuera** de los tres sistemas.

**Descartado.** Reutilizar el Usuario; reutilizar el Cliente BCS.

**Consecuencias.** Hay que resolver la identidad en algún punto. A cambio, tres contextos que
evolucionan por separado no quedan acoplados por conveniencia — la misma decisión que ya separa
al Cliente BCS del Usuario, y por el mismo motivo.

---

## PAS-ADR-08 · El perfil se deriva, nunca se almacena como verdad

**Contexto.** Recalcular en cada consulta es más caro que leer.

**Decisión.** Estados, perfiles, trazas y limitaciones se recalculan siempre. Persistirlos vale
como caché o copia fechada, jamás como fuente.

**Descartado.** Persistir el perfil y actualizarlo por eventos.

**Consecuencias.** Un perfil depende de tres relojes —registros, catálogo, motor (`07`)—, y solo
uno de ellos avanza por acción del atleta. Un perfil almacenado quedaría desactualizado por
cambios que nadie asociaría a él, y servirlo como actual sería el peor fallo posible del sistema.

---

## PAS-ADR-09 · La calistenia es familia propia

**Contexto.** F-I podría haber sido una subfamilia de F-A (fuerza).

**Decisión.** Familia independiente.

**Descartado.** Tratarla como modo de resistencia dentro de F-A.

**Consecuencias.** En calistenia el peso corporal es simultáneamente la resistencia y el sujeto de
la medida, de modo que su resultado no es comparable con el de una carga externa aunque ambos
evalúen la misma capacidad. Dado el peso de la calistenia en este ecosistema, esconderla dentro de
otra familia habría forzado la taxonomía desde el primer día.

---

## PAS-ADR-10 · F-01 y F-02 se declaran pero se reservan

**Contexto.** Tolerancia a la carga y disponibilidad funcional son capacidades reales, y también
las de mayor riesgo del catálogo.

**Decisión.** Entran al catálogo, sin pruebas asociadas, activables en el Sprint 5 y solo si hay
respaldo.

**Descartado.** Omitirlas; o activarlas ya.

**Consecuencias.** Omitirlas habría hecho que alguien las colase dentro de otra capacidad por
falta de sitio. Activarlas ya habría producido categorías de riesgo sin respaldo, que es
exactamente lo que el límite L-03 prohíbe.

---

## PAS-ADR-11 · Los patrones de movimiento no pertenecen al PAS

**Contexto.** E-01, E-02 y F-H necesitan nombrar patrones concretos.

**Decisión.** Se toman del **Master Exercise Dataset**. El PAS no define ninguno.

**Descartado.** Un catálogo de patrones propio, «más adecuado a la evaluación».

**Consecuencias.** El PAS depende de un catálogo que no controla. A cambio, no existen dos nombres
para el mismo movimiento — que es el problema que este ADR compra por adelantado.

---

## PAS-ADR-12 · No hay pruebas definidas por el usuario

**Contexto.** Un profesional querrá registrar algo que el catálogo no contempla.

**Decisión.** El catálogo es curado y versionado centralmente. Lo no catalogado se registra como
**observación de una evaluación**: dato conservado, sin contribución a ningún estado.

**Descartado.** Pruebas ad hoc creadas por el usuario.

**Consecuencias.** El profesional no puede evaluar con su propia prueba dentro del sistema. A
cambio, el catálogo no se convierte en un campo de texto libre, que haría imposibles tanto la
elegibilidad como la trazabilidad. El dato se guarda igualmente: el sistema no lo pierde, solo se
abstiene de fingir que sabe qué significa.
