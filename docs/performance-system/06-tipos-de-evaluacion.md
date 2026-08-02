---
modulo: 06
titulo: Tipos de evaluación
estado: congelado
---

# 06 · Tipos de evaluación

Una **Evaluación** agrupa los Registros de Prueba de una misma sesión bajo un propósito
declarado. El tipo no cambia cómo se calcula nada: cambia **cómo se interpreta la sesión** y qué
puede esperarse de su cobertura.

## Regla común

El tipo es **declarado por quien evalúa, nunca inferido por el sistema**. Deducir que una sesión
es de seguimiento porque existe una anterior sería una suposición sobre la intención del
profesional.

El tipo es **inmutable** una vez cerrada la evaluación, como todo dato ingresado (`02`).

## Catálogo

| Código | Tipo | Propósito | Cobertura esperada |
|---|---|---|---|
| **T-01** | Inicial | Primera evaluación del atleta en el sistema | Amplia: busca cubrir el mayor número de capacidades |
| **T-02** | Seguimiento | Repetición periódica para observar evolución | Equivalente a la inicial, o un subconjunto estable |
| **T-03** | Reevaluación | Repetición de pruebas concretas cuyo resultado quedó en duda | Estrecha: solo lo que se revisa |
| **T-04** | Control | Comprobación puntual de una capacidad concreta | Muy estrecha |
| **T-05** | Alta | Evaluación de cierre de un proceso | Amplia |
| **T-06** | Competencia | Registro obtenido en contexto competitivo real | Variable, no controlada |

## Notas por tipo

**T-01 · Inicial.** Solo puede haber una por atleta. Una segunda evaluación con vocación de
inicio es una T-02, o una T-05 seguida de una nueva T-01 tras el alta; el sistema no admite dos
inicios sin cierre intermedio.

**T-03 · Reevaluación.** Existe para el caso que el modelo de incertidumbre (`10`) genera con más
frecuencia: un resultado en conflicto o de calidad dudosa. Es el mecanismo por el que un conflicto
se resuelve **con dato nuevo en lugar de con criterio**.

**T-06 · Competencia.** El único tipo cuyas condiciones **no controla el evaluador**. Un registro
obtenido en competición no es comparable sin más con uno tomado en condiciones controladas: su
definición de prueba debe declararlo, y su elegibilidad puede diferir (`09`). Se admite porque el
dato existe, y omitirlo obligaría a registrarlo mintiendo sobre su origen.

## Lo que el tipo NO determina

- **No cambia la elegibilidad por sí mismo.** Un registro de una T-04 no es más elegible que uno
  de una T-01 por serlo. La elegibilidad depende del registro, no de la sesión.
- **No pondera.** Ninguna evaluación pesa más que otra.
- **No obliga a una cobertura.** El sistema no rechaza una T-01 incompleta: la declara incompleta
  y continúa.
- **No fija periodicidad.** Ninguna fuente del ecosistema documenta cada cuánto reevaluar, y el
  PAS hereda esa ausencia sin resolverla por su cuenta.
