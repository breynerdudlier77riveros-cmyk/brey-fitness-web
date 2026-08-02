---
modulo: 16
titulo: Glosario
estado: congelado
---

# 16 · Glosario

Lenguaje congelado. Estos términos significan **exactamente** esto dentro del PAS, en
documentación, en conversación y en el código que llegue después. Un término usado con otro
sentido es un defecto, no una variación de estilo.

## Entidades

| Término | Significado | No confundir con |
|---|---|---|
| **Atleta** | Persona evaluada. Rol propio del PAS | Usuario de la aplicación; Cliente del BCS |
| **Capacidad** | Dimensión funcional evaluable. Concepto de catálogo | Métrica; puntuación |
| **Prueba** | *Definición* de un procedimiento evaluativo. Nunca contiene el resultado de nadie | Registro de Prueba |
| **Registro de Prueba** | Resultado concreto de aplicar una prueba a un atleta en una fecha. Inmutable | Prueba |
| **Evaluación** | Conjunto de registros de una misma sesión, con propósito declarado | Diagnóstico BPS |
| **Estado de Capacidad** | Lo que se sabe de UNA capacidad de UN atleta, con su certeza | Nivel; puntuación |
| **Perfil Funcional** | Conjunto de Estados de Capacidad de un atleta en un momento. **La salida del sistema** | Diagnóstico; informe |
| **Traza** | Registro de qué produjo un Estado de Capacidad, incluido lo descartado | Historial |
| **Limitación** | Declaración explícita de algo que el sistema no puede afirmar, con su motivo | Advertencia; nota |

## Estados de una capacidad

Cinco valores excluyentes. No existe un sexto implícito.

| Término | Significado exacto |
|---|---|
| **Evaluada** | Hay al menos una prueba elegible y su resultado es interpretable |
| **Parcialmente evaluada** | Hay pruebas elegibles, pero no cubren la capacidad según su definición |
| **Desactualizada** | Hubo pruebas; ninguna sigue siendo elegible por antigüedad |
| **En conflicto** | Hay pruebas elegibles cuyos resultados no son conciliables |
| **Desconocida** | Nunca se registró ninguna prueba que la alimente |

> **Desconocida ≠ Desactualizada.** La primera dice que nunca se supo; la segunda, que se supo y
> caducó. Usarlas como sinónimos es el error de vocabulario más probable de todo el sistema.

## Operaciones

| Término | Significado |
|---|---|
| **Contribuir** | Que un registro elegible participe en el estado de una capacidad |
| **Derivar** | Componer un estado a partir de registros elegibles |
| **Elegible** | Que un registro cumple las seis condiciones EL-01…EL-06 |
| **Anular** | Retirar la elegibilidad de un registro conservando su existencia. Terminal |
| **Vigencia** | Cuánto tiempo un resultado sigue siendo elegible. Atributo **de la prueba** |
| **Antigüedad** | Días transcurridos desde un registro. Es un hecho, no una decisión |
| **Versión de catálogo** | Estado de las definiciones de capacidad, prueba y correspondencia |
| **Versión de motor** | Estado de las reglas de elegibilidad y derivación |

## Términos prohibidos

No aparecen en el PAS. Cada uno afirma algo que el sistema no puede sostener.

La prohibición alcanza a **toda afirmación sobre un atleta** — salida del sistema, interfaz,
informes y conversación sobre un caso. No alcanza a la prosa sobre el sistema mismo: decir que una
capacidad del catálogo es «de riesgo» para el diseño es hablar del modelo, no del atleta.

| Prohibido | Por qué | Qué se dice en su lugar |
|---|---|---|
| **Diagnóstico** | Ya designa el cuestionario del Motor BPS, y sugiere clínica | Perfil Funcional |
| **Puntuación / índice / score** | Exigiría ponderar capacidades entre sí | Estado de Capacidad |
| **Nivel** | Ya existe en el Core Product como configuración del Sistema | *(sin equivalente: no se usa)* |
| **Débil / fuerte / bajo / alto** | Juicios relativos a un objetivo que el sistema no conoce | El estado de la capacidad, tal cual |
| **Riesgo** | Afirmación clínica y predictiva (L-03, L-05) | *(sin equivalente: no se usa)* |
| **Déficit / desequilibrio** | Presuponen un valor correcto de referencia | *(sin equivalente: no se usa)* |
| **Normal / anormal** | Clasificación clínica (L-03) | *(sin equivalente: no se usa)* |
| **Recomendar / deberías / conviene** | El PAS no decide contenido (L-01, I-12) | *(sin equivalente: no se usa)* |
| **Estimado / aproximado** | Una capacidad sin prueba es *desconocida*, no estimada (I-06) | Desconocida |
| **Potencial** | Proyección (L-05) | *(sin equivalente: no se usa)* |

## Términos que significan otra cosa fuera del PAS

Homónimos reales del ecosistema. Al hablar de ellos, nómbrese el sistema.

| Término | En el PAS | En otro sistema |
|---|---|---|
| **Estado** | Estado de una capacidad del atleta | Fase del ciclo de vida del usuario (Motor BPS) |
| **Diagnóstico** | *Prohibido* | Cuestionario que asigna un Sistema (Motor BPS) |
| **Cliente** | *No existe* | Persona evaluada por un entrenador (BCS) |
| **Medición** | *No se usa*; se dice Registro de Prueba | Toma de composición corporal (BCS) |
| **Sistema** | *No se usa* en sentido de programa | Programa de entrenamiento (Core Product) |
| **Nivel** | *Prohibido* | Configuración interna de un Sistema (Core Product) |
| **Perfil** | Perfil Funcional | Perfil de usuario de la aplicación |
