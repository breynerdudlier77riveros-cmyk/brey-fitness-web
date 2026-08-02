---
modulo: 02
titulo: State Model
estado: congelado
---

# 02 · State Model

## Qué representa exactamente un estado del atleta

Un **Perfil Funcional** es una *fotografía derivada*: el conjunto de lo que puede afirmarse
sobre las capacidades de un atleta **usando exclusivamente los registros elegibles en un momento
dado**.

Tres precisiones que definen el concepto:

1. **No es lo que el atleta es.** Es lo que sus pruebas permiten afirmar. La diferencia importa:
   una capacidad sin pruebas no está «baja», está *desconocida*.
2. **No se almacena como verdad.** Se recalcula. Un perfil guardado es una copia con fecha, no la
   fuente.
3. **Incluye siempre lo que no se sabe.** Un perfil sin sus limitaciones estaría incompleto,
   no resumido.

## Las cuatro naturalezas del dato

Toda información del PAS pertenece a exactamente una de estas cuatro categorías. La clasificación
no es documental: determina qué puede modificarse, qué se recalcula y qué se versiona.

### 1 · Ingresado manualmente — *inmutable*

Lo que una persona registró: el resultado de una prueba, la fecha, las condiciones de la toma,
las observaciones.

- **Se corrige creando un registro nuevo y anulando el anterior**, nunca editando en sitio. Es
  el mismo mecanismo que el BCS aplica a sus mediciones, y por el mismo motivo: preservar qué se
  registró y cuándo.
- Es el **único hecho primario** del sistema. Todo lo demás se deriva.

### 2 · Calculado — *volátil, nunca fuente*

Los Estados de Capacidad y el Perfil Funcional.

- Se recalculan íntegramente cada vez que se consultan.
- **Nunca son insumo de otro cálculo del PAS.** Un estado no alimenta a otro estado: ambos se
  derivan de registros. Esta regla impide cadenas de derivación cuyo error se acumule de forma
  imposible de rastrear.
- Persistirlos es admisible como caché o como copia con fecha, jamás como fuente.

### 3 · Histórico — *acumulativo, nunca se borra*

La secuencia completa de Registros de Prueba y Evaluaciones, incluidos los anulados.

- Un registro anulado **sigue existiendo**. Deja de ser elegible, no deja de haber ocurrido.
- El histórico es la única entidad que crece de forma monótona.

### 4 · De catálogo — *versionado, compartido*

Las definiciones de Capacidad y de Prueba, y las correspondencias entre ellas.

- No pertenecen a ningún atleta.
- **Cambian con versión**, y todo perfil declara contra qué versión se calculó (ver `07`).

---

## Tabla de decisión

| Concepto | Naturaleza | ¿Mutable? | ¿Se recalcula? | ¿Se versiona? |
|---|---|---|---|---|
| Registro de Prueba | Manual | No — se anula y se sustituye | No | No |
| Evaluación | Manual | No | No | No |
| Estado de Capacidad | Calculado | n/a | Siempre | No, hereda la del motor |
| Perfil Funcional | Calculado | n/a | Siempre | No, hereda la del motor |
| Traza | Calculado | n/a | Con su estado | No |
| Limitación | Calculada | n/a | Siempre | No |
| Definición de Capacidad | Catálogo | Sí, con versión | n/a | Sí |
| Definición de Prueba | Catálogo | Sí, con versión | n/a | Sí |
| Correspondencia prueba→capacidad | Catálogo | Sí, con versión | n/a | Sí |

---

## Estados posibles de una Capacidad

Cinco, y son **excluyentes**. No hay un sexto valor implícito.

| Estado | Significado |
|---|---|
| **Evaluada** | Hay al menos una prueba elegible y su resultado es interpretable |
| **Parcialmente evaluada** | Hay pruebas elegibles, pero no cubren la capacidad según su definición de catálogo |
| **Desactualizada** | Hubo pruebas, pero ninguna sigue siendo elegible por antigüedad |
| **En conflicto** | Hay pruebas elegibles cuyos resultados no son conciliables (ver `10`) |
| **Desconocida** | Nunca se registró ninguna prueba que la alimente |

**«Desconocida» y «desactualizada» no son lo mismo**, y confundirlas sería el error más probable
de este modelo: la primera dice que nunca se supo; la segunda, que se supo y ha dejado de ser
vigente. Un motor consumidor puede actuar distinto ante cada una.

Ninguno de estos cinco estados es un juicio sobre el atleta. Son afirmaciones sobre el *dato*.

---

## Qué NO forma parte del estado

- **La evolución.** El perfil describe un momento. Comparar dos perfiles es una operación
  posterior, y su definición pertenece al Sprint 4.
- **La causa.** Ningún estado explica por qué una capacidad está como está.
- **La suficiencia del entrenamiento.** No hay noción de «suficiente»: exigiría un objetivo.
