---
modulo: 12
titulo: Roadmap
estado: v1.0
---

# 12 · Roadmap

Qué falta en la PKB y qué depende de ello.

## Prioridad inmediata — antes de PAS-4

Ordenadas por lo que bloquean, no por dificultad.

| # | Trabajo | Desbloquea |
|---|---|---|
| **1** | **MDC y SEM por prueba y población** (V-01) | Que PAS-4 pueda afirmar que un atleta cambió |
| **2** | **Esprint lineal** (D-01) | La capacidad D-01 Velocidad |
| **3** | **CMJ: revisión de fiabilidad verificable** (D-02) | Clave de referencia para la prueba más usada |
| **4** | **Fiabilidad de las 6 pruebas sin verificar** (D-03) | Consolidar `04` |
| **5** | **Vigencia** (V-02) | Que el catálogo declare `vigenciaDias` con respaldo |

El punto 1 es el crítico. Sin él, el Performance Interpretation Engine podrá construir la
comparación entre perfiles pero **no podrá autorizar ninguna conclusión sobre ella**.

El punto 5 puede resultar irresoluble: es posible que la literatura sencillamente no documente
vigencia. Si es así, se declara y el PAS convive con `vigenciaDias: null` de forma permanente.
Eso es preferible a inventar un número.

## Prioridad media

| # | Trabajo | Desbloquea |
|---|---|---|
| **6** | Validez de constructo (V-03) | Que alguna correspondencia alcance nivel **alto** |
| **7** | Pruebas para las 12 capacidades sin cubrir (V-05) | Utilidad real del perfil |
| **8** | Pesos relativos (V-04) | El campo `peso` del catálogo |
| **9** | Poblaciones descubiertas (V-06) | Aplicabilidad fuera de adultos sanos |

## Diferido

| # | Trabajo | Cuándo |
|---|---|---|
| **10** | Capacidades F-01 y F-02 (V-07) | Sprint PAS-5, y solo si hay respaldo |

---

## Qué necesita cada sprint futuro

### Sprint PAS-4 · Performance Interpretation Engine

| Necesita | Estado |
|---|---|
| Correspondencias autorizadas | ✅ 7 disponibles |
| Alcance de cada correspondencia | ✅ Declarado en la matriz |
| Interpretaciones prohibidas | ✅ 18 registradas |
| **MDC / SEM para afirmar cambio** | ❌ **V-01 sin resolver** |
| Pesos relativos | ❌ V-04 sin resolver |

**Puede construirse.** Lo que no puede es declarar mejoras ni empeoramientos: solo describir
diferencias y declarar la limitación. Es la misma disciplina que el PAE ya aplica con las
capacidades desconocidas.

### Sprint PAS-5 · Performance Report System

| Necesita | Estado |
|---|---|
| Qué puede afirmarse por capacidad | ✅ `01` y `09` |
| Qué no puede afirmarse | ✅ `08` |
| Alcance textual autorizado | ✅ En cada fila de la matriz |
| Valores normativos para comparar | ❌ Solo agarre |

**Advertencia de diseño.** Un informe con 12 capacidades desconocidas y 6 parcialmente evaluadas
es un informe honesto, y va a parecer pobre. La tentación de rellenarlo será la mayor presión que
reciba este ecosistema. El README de la PKB existe en buena parte para eso.

### Sprint PAS-6 · Performance Analytics

| Necesita | Estado |
|---|---|
| Datos agregables | ✅ Los perfiles |
| Advertencia de comparabilidad entre versiones | ✅ I-11 del PAS |
| **Validez de las agregaciones** | ❌ Sin fuente |

Agregar perfiles de varios atletas roza el límite L-04 del PAS —no comparar atletas entre sí—.
Ese sprint deberá delimitar con cuidado qué es descripción de una población de clientes y qué
sería comparación entre individuos.

### Sprint PAS-7 · Performance AI Copilot

| Necesita | Estado |
|---|---|
| Vocabulario permitido y prohibido | ✅ `08` y `14` |
| Trazabilidad hasta la referencia | ✅ `_evidencia/referencias.yaml` |
| Alcance por correspondencia | ✅ La matriz |

**Es el sprint de mayor riesgo de toda la serie.** Un generador de texto sobre un perfil con 12
capacidades desconocidas tenderá a rellenar el vacío con lenguaje. Las 18 interpretaciones
prohibidas son su lista de comprobación, y el precedente del Copilot del BCS —que valida su propia
salida contra un catálogo de términos— es el patrón a repetir.

---

## Criterio de actualización

Una versión nueva de la PKB **no reescribe** la anterior. Cuando una correspondencia cambia de
estado:

1. Se registra el estado anterior, la fecha y el motivo.
2. Se actualiza la versión de la base.
3. Los perfiles calculados con la versión anterior **no son directamente comparables**.

Es el mismo mecanismo de versionado de catálogo que el PAS congeló en su modelo temporal, y el
motor ya lo declara en las coordenadas de cada análisis.
