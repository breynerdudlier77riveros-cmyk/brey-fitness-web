---
modulo: 06
titulo: Versionado
estado: congelado
---

# 06 · Versionado

Cómo evolucionan las normas. Qué cambia, qué no cambia nunca.

## Las tres líneas de tiempo

Confundirlas es el error más caro que puede cometerse al implementar la NKB.

| Línea | Qué avanza | Ritmo |
|---|---|---|
| **De la publicación** | Lo que la ciencia ha publicado | Cuando aparece un estudio nuevo |
| **De la base** | Qué normas la NKB ha incorporado y cómo las gradúa | Cuando alguien trabaja en ella |
| **Del consumidor** | Qué norma elige aplicar el NIE | Cuando cambian sus reglas |

Una lectura normativa es la intersección de las tres. Alterar cualquiera puede
cambiar cómo se lee un valor **sin que la persona haya cambiado**.

De ahí que toda norma publicada declare su versión de base, y que el NIE deba
poder advertir que dos lecturas hechas con versiones distintas no son
directamente comparables.

## Qué NUNCA cambia

- **Lo que dice una publicación.** Un estudio de un año determinado afirma lo
  que afirma, para siempre.
- **La referencia** de la que procede una norma.
- **El método** con el que se obtuvieron sus valores.
- **La población** de origen y sus criterios.
- **El hecho** de que una norma estuvo en la base, incluso retirada.

Corregir cualquiera de estos datos se hace **retirando la entrada y creando una
nueva**, nunca editándola en sitio. Es el mismo mecanismo que el BCS aplica a
sus mediciones y el PAS a sus registros, y responde al mismo principio:
preservar qué se afirmó y cuándo, no solo qué se cree ahora.

## Qué sí cambia

| Elemento | Por qué |
|---|---|
| El **conjunto** de normas de la base | Se incorporan normas nuevas |
| La **calidad** asignada a una norma | Puede reevaluarse con criterios afinados |
| Las **limitaciones** declaradas | Puede detectarse una no vista al incorporarla |
| El **estado** de una norma | Vigente o retirada |
| Los **criterios** de admisión y de calidad | Con su propia versión |

## Estados de una norma

Dos, y son excluyentes.

| Estado | Significado |
|---|---|
| **Vigente** | Puede aplicarse |
| **Retirada** | No puede aplicarse; sigue existiendo |

**Ninguna norma se borra.** Retirar es terminal en el sentido de que la entrada
retirada no vuelve: si la fuente recupera validez, se incorpora una entrada
nueva. Una entrada que va y viene haría imposible saber qué estaba vigente en un
momento dado.

## Motivos de retirada

Se congela la lista; ninguno admite excepción.

1. La publicación fue retractada.
2. Se detectó que incumplía un criterio de admisión (`04`).
3. La fuente original resultó no ser localizable.
4. Se incorporó una entrada corregida que la sustituye.
5. La propia fuente publicó una corrección que altera los valores.

**Envejecer no es motivo de retirada.** Una norma antigua sigue describiendo la
población que describió; que ya no represente a la población actual es una
**limitación** que se declara, no una causa para eliminarla. La NKB no fija
ninguna caducidad por antigüedad, porque ninguna fuente la documenta y elegir un
número sería inventarlo.

## Sustitución

Cuando una norma nueva reemplaza a otra:

1. La anterior pasa a **retirada**, con fecha y motivo.
2. La nueva entra como entrada independiente, con su propia traza.
3. La relación entre ambas queda registrada.
4. **La versión de la base avanza.**

La anterior no se modifica ni se marca como «incorrecta»: se declara sustituida.
Puede haber sido correcta con la evidencia de su momento.

## Coexistencia

Dos normas vigentes para la misma variable son **normales**, no un error, si
difieren en método, población o estrato. Ese es el caso habitual.

Lo que no es normal es que coincidan en las cuatro coordenadas de identidad
—variable, método, población, estrato— y afirmen cosas distintas. Eso es un
**conflicto**, y la NKB lo declara sin resolverlo (invariante I-08). Elegir sería
aplicar, y aplicar es del NIE.

## Lo que este módulo NO decide

- **Ninguna política de caducidad** por antigüedad.
- **Ningún criterio de preferencia** entre dos normas vigentes.
- **Ninguna frecuencia de revisión** de la base.
