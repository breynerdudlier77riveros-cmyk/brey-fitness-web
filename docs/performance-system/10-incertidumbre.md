---
modulo: 10
titulo: Modelo de incertidumbre
estado: congelado
---

# 10 · Modelo de incertidumbre

Qué hace el sistema cuando el dato no alcanza. Es el módulo que decide si el PAS resulta fiable:
un sistema de evaluación se juzga por cómo se comporta ante datos imperfectos, porque es la
situación habitual, no la excepción.

## Principio rector

> Ante la duda, el PAS **declara la duda**. Nunca la resuelve por su cuenta, nunca la oculta y
> nunca la promedia.

Tres consecuencias que se aplican sin excepción:

1. **No se rellena.** Una capacidad sin dato es *desconocida*, jamás un valor por defecto.
2. **No se desempata por criterio.** Un empate se declara empate.
3. **La incertidumbre viaja con el dato.** No es una nota al pie: forma parte del estado.

## Los seis escenarios

### 1 · Faltan pruebas

**Situación:** ninguna prueba elegible alimenta la capacidad.
**Comportamiento:** estado **Desconocida**. Se declara qué familias de prueba la alimentarían.
**Prohibido:** estimarla desde otras capacidades. Es el límite L-06 y no admite excepción — la
correlación entre capacidades no autoriza a inferir una desde otra en un individuo.

### 2 · Cobertura parcial

**Situación:** hay pruebas elegibles, pero no cubren la capacidad según su definición.
**Comportamiento:** estado **Parcialmente evaluada**, declarando qué falta.
**Prohibido:** presentarla como evaluada. Una capacidad con la mitad de su cobertura no es media
capacidad conocida: es una afirmación más débil sobre el todo.

### 3 · Pruebas antiguas

**Situación:** hubo pruebas, ninguna sigue vigente (EL-02).
**Comportamiento:** estado **Desactualizada**, con la fecha del último registro elegible.
**Prohibido:** usarlas igualmente advirtiendo que son viejas. La vigencia es binaria por diseño;
si el criterio resulta demasiado estricto, se corrige la vigencia en catálogo, no se ignora en
tiempo de cálculo.

**Desactualizada ≠ Desconocida.** La primera dice que se supo y caducó; la segunda, que nunca se
supo. Un motor consumidor puede actuar distinto ante cada una, y por eso el modelo las separa.

### 4 · Datos contradictorios

**Situación:** dos o más registros elegibles arrojan resultados no conciliables.
**Comportamiento:** estado **En conflicto**. La traza expone los registros implicados.
**Prohibido:** elegir uno. Ni el más reciente, ni el mejor, ni el promedio.

Es la decisión más contraintuitiva de este modelo y la más deliberada. Tomar el más reciente
supondría que el atleta cambió; tomar el mejor supondría que el peor fue un mal día; promediar
supondría que ambos son mediciones ruidosas de un mismo valor. **Las tres son hipótesis sobre lo
ocurrido, y el sistema no dispone de información para elegir entre ellas.**

La vía de resolución es una **T-03 Reevaluación** (`06`): se resuelve con dato nuevo, no con
criterio.

### 5 · Empate

**Situación:** dos registros elegibles con resultado equivalente, cuando la capacidad exige uno.
**Comportamiento:** se declara el empate y se conservan ambos en la traza.
**Prohibido:** desempatar por fecha, por orden de registro o por cualquier regla arbitraria. Un
desempate inventado produce un resultado que parece decidido cuando no lo está.

### 6 · Pruebas anuladas

**Situación:** existen registros anulados para la capacidad.
**Comportamiento:** no participan (EL-01), **pero su existencia se declara**. Si tras excluirlas
no queda ninguna elegible, el estado es *Desconocida* con la nota de que hubo registros anulados.
**Prohibido:** borrarlas del histórico o silenciar que existieron.

## Tabla resumen

| Escenario | Estado resultante | Vía de resolución |
|---|---|---|
| Faltan pruebas | Desconocida | Evaluar |
| Cobertura parcial | Parcialmente evaluada | Completar cobertura |
| Pruebas antiguas | Desactualizada | Reevaluar |
| Contradicción | En conflicto | **T-03 Reevaluación** |
| Empate | Evaluada, con empate declarado | Prueba adicional |
| Anuladas | Desconocida o el que corresponda | Registrar de nuevo |

## Lo que el modelo NO hace

- **No pondera la confianza en un número.** Un índice de certeza exigiría una fórmula, y ninguna
  evidencia la respalda.
- **No decide cuándo la incertidumbre es aceptable.** Eso depende de para qué se use el perfil, y
  el PAS no conoce el uso.
- **No oculta capacidades inciertas.** Todas figuran en el perfil, con su estado.
