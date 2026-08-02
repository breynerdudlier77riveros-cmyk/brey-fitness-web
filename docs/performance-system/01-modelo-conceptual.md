---
modulo: 01
titulo: Modelo conceptual
estado: congelado
---

# 01 · Modelo conceptual

## Entidades

Nueve entidades. Ninguna más entra en v1.0 sin pasar por el modelo de extensibilidad (`11`).

### E-01 · Atleta
La persona evaluada. **No es el Usuario de la aplicación ni el Cliente del BCS**: es un rol
propio del PAS. Un mismo ser humano puede corresponder a los tres, y la correspondencia se
resuelve fuera del PAS (ver `12-integracion-futura.md`).

*Responsabilidad:* ser el sujeto al que pertenece todo lo demás.

### E-02 · Capacidad
Una dimensión funcional evaluable: fuerza, movilidad, equilibrio… Es un **concepto de
catálogo**, no un dato: existe con independencia de que algún atleta la tenga evaluada.

*Responsabilidad:* definir qué puede conocerse de un atleta.

### E-03 · Prueba *(definición)*
La descripción de un procedimiento evaluativo: qué mide, qué necesita, qué produce. Es de
catálogo, versionada, y **nunca contiene el resultado de nadie**.

*Responsabilidad:* definir cómo puede conocerse.

### E-04 · Registro de Prueba
El resultado concreto de aplicar una Prueba a un Atleta en una fecha. **Inmutable** (ver `07`).

*Responsabilidad:* ser el único hecho primario del sistema. Todo lo demás se deriva de aquí.

### E-05 · Evaluación
Agrupa los Registros de Prueba realizados en una misma sesión, con un propósito declarado
(`06-tipos-de-evaluacion.md`).

*Responsabilidad:* dar contexto temporal y de intención a un conjunto de registros.

### E-06 · Estado de Capacidad
El estado derivado de UNA capacidad para UN atleta en un momento. Incluye siempre su nivel de
certeza.

*Responsabilidad:* responder «qué se sabe de esta capacidad, y cuánto».

### E-07 · Perfil Funcional
El conjunto de Estados de Capacidad de un atleta en un momento. Es **la salida del sistema** y
el contrato que consumirán los demás motores.

*Responsabilidad:* responder la pregunta única del PAS.

### E-08 · Traza
El registro de qué produjo cada Estado de Capacidad: qué registros participaron, cuáles se
descartaron y por qué, con qué versión del motor.

*Responsabilidad:* hacer auditable toda afirmación.

### E-09 · Limitación
Una declaración explícita de algo que el sistema **no puede** afirmar, y su motivo.

*Responsabilidad:* que el silencio nunca se confunda con ausencia de problema.

---

## Relaciones

```
Atleta ──< Evaluación ──< Registro de Prueba >── Prueba (definición)
                                  │                      │
                                  │                      └──< contribuye a >── Capacidad
                                  │
                                  └──── deriva ────> Estado de Capacidad ──> Traza
                                                              │
                                                              └──> Perfil Funcional ──> Limitación
```

Lectura de las cardinalidades:

| Relación | Cardinalidad | Nota |
|---|---|---|
| Atleta → Evaluación | 1 a N | Un atleta acumula evaluaciones sin límite |
| Evaluación → Registro de Prueba | 1 a N | Una evaluación agrupa varios registros |
| Prueba → Registro de Prueba | 1 a N | Una definición se aplica muchas veces |
| Prueba → Capacidad | N a M | **Una prueba puede alimentar varias capacidades** |
| Capacidad → Estado de Capacidad | 1 a 1 por atleta y momento | |
| Estado de Capacidad → Perfil | N a 1 | El perfil los agrupa |
| Estado de Capacidad → Traza | 1 a 1 | Sin traza no hay estado (ver invariante I-05) |

**La relación N a M entre Prueba y Capacidad es la decisión estructural del modelo.** Una prueba
rara vez informa de una sola dimensión, y forzar una correspondencia 1 a 1 obligaría a mentir
sobre lo que cada prueba aporta. Qué prueba alimenta qué capacidad, y con qué peso relativo, es
una cuestión de evidencia que este sprint **no resuelve** (ver `05-relaciones.md`).

---

## Fronteras de responsabilidad

| El PAS es dueño de | El PAS solo consume | El PAS nunca toca |
|---|---|---|
| Prueba, Registro, Evaluación | Referencias de la Clinical Knowledge Base | Sistemas, Niveles, Tracks |
| Capacidad, Estado de Capacidad | Identidad del Atleta | Workouts, prescripciones |
| Perfil Funcional, Traza, Limitación | — | Composición corporal |

**Sobre composición corporal:** el PAS **no** absorbe el BCS. Son sistemas paralelos con sujetos
distintos —el Cliente del BCS puede no ser un Atleta— y con preguntas distintas. Su relación es
de vecindad, no de contención, y se detalla en `12-integracion-futura.md`.

---

## Qué NO es una entidad, y por qué

| Candidato descartado | Motivo |
|---|---|
| **Puntuación global** | Un número único que resuma al atleta exigiría ponderar capacidades entre sí, y ninguna evidencia sostiene esa ponderación. Además destruiría la información que el perfil existe para conservar. |
| **Nivel** | «Principiante/intermedio/avanzado» ya existe en el Core Product como configuración interna del Sistema. Reintroducirlo aquí crearía un segundo nivel con el mismo nombre. |
| **Objetivo del atleta** | El ecosistema declara explícitamente que no conoce el objetivo del usuario. El PAS no lo introduce. |
| **Debilidad / fortaleza** | Son juicios relativos a un objetivo. Ver fila anterior. |
| **Riesgo de lesión** | Afirmación clínica y predictiva. Fuera de los límites L-03 y L-05. |
