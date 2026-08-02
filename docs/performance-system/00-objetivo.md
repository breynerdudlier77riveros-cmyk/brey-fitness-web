---
modulo: 00
titulo: Objetivo, límites y responsabilidades
estado: congelado
---

# 00 · Objetivo

## Qué hace el PAS

Representa el **estado funcional del atleta** en un momento dado, a partir de pruebas
registradas, y conserva la traza de cómo se llegó a esa representación.

Tres verbos, y ninguno más:

1. **Registra** — recoge el resultado de pruebas realizadas.
2. **Deriva** — compone el estado de cada capacidad a partir de las pruebas elegibles.
3. **Declara** — expone ese estado con su trazabilidad y su incertidumbre.

## Qué NO hace

| No hace | A quién corresponde |
|---|---|
| Prescribir entrenamiento | Workout Engine (no existe) |
| Generar rutinas o sesiones | Workout Generator |
| Calcular progresiones | Progression Engine |
| Decidir descargas o recuperación | Recovery Engine |
| Interpretar nutrición | Nutrition Engine (no existe) |
| Diagnosticar patología | Nadie: fuera del ecosistema |
| Comparar atletas entre sí | Nadie: ver límite L-04 |
| Predecir rendimiento futuro | Nadie: ver límite L-05 |

## Límites

**L-01 · El PAS no decide contenido.**
Nunca dice qué hacer. Describe qué hay. La distinción es la misma que ya separa al Motor BPS
—orquestador— de los motores que sí deciden.

**L-02 · El PAS no mide: recibe medidas.**
No define protocolos de prueba, no ejecuta tomas, no calibra instrumentos. Recibe un resultado
ya obtenido y registra bajo qué condiciones se obtuvo.

**L-03 · El PAS no clasifica clínicamente.**
No emite categorías de salud, riesgo ni normalidad. Si una capacidad admite una referencia
poblacional, esa referencia pertenece a la Clinical Knowledge Base y el PAS únicamente la cita.

**L-04 · El PAS no compara atletas entre sí.**
Su unidad de análisis es un atleta comparado consigo mismo a lo largo del tiempo. Es la misma
decisión que gobierna el BCS, y por el mismo motivo: la comparación longitudinal intraindividual
es metodológicamente más defendible que la transversal.

**L-05 · El PAS no proyecta.**
Describe lo registrado. No estima cuándo se alcanzará un valor ni qué ocurrirá si se entrena de
determinada manera.

**L-06 · El PAS no infiere una capacidad no evaluada.**
Si no hay prueba elegible para una capacidad, el estado de esa capacidad es *desconocido*, no
*promedio* ni *estimado a partir de las demás*.

## Responsabilidades

| Responsabilidad | Descripción |
|---|---|
| **R-01** Custodia del registro | Toda prueba registrada es inmutable; corregirla crea un registro nuevo y anula el anterior |
| **R-02** Elegibilidad | Decidir qué pruebas pueden participar en el estado vigente |
| **R-03** Derivación | Componer el estado de cada capacidad desde sus pruebas elegibles |
| **R-04** Incertidumbre | Declarar qué no se sabe y por qué, con el mismo rango que lo que sí se sabe |
| **R-05** Trazabilidad | Permitir reconstruir cualquier afirmación hasta las pruebas que la produjeron |
| **R-06** Versionado | Conservar qué versión del motor produjo cada perfil |
| **R-07** Publicación | Exponer el Perfil Funcional como contrato estable para otros motores |

## Por qué el PAS existe antes que el Workout Engine

Un motor de entrenamiento necesita saber de qué punto parte el atleta. Hoy ninguna pieza del
ecosistema lo representa: el Diagnóstico BPS asigna un Sistema a partir de preferencias y
disponibilidad declaradas, no de capacidad evaluada, y el BCS describe composición corporal, que
no es función.

Construir el Workout Engine sin el PAS obligaría a que aquel definiera su propio modelo de
estado, y ese modelo quedaría atrapado dentro de un motor que decide contenido — exactamente la
mezcla de responsabilidades que el ecosistema evita desde su primer handbook.
