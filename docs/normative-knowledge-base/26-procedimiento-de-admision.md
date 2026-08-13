---
modulo: 26
titulo: Procedimiento de admisión
estado: congelado
sprint: NKB-2.0
---

# 26 · Procedimiento de admisión

El recorrido operativo, de principio a fin. Este módulo existe para satisfacer
el criterio de cierre del sprint:

> Otra persona debe poder recibir una fuente cualquiera y responder si produce
> una norma admisible, y qué falta si no, **sin preguntar a nadie**.

Es un procedimiento, no un algoritmo. No hay código y no lo habrá aquí.

---

## Los siete pasos

### Paso 1 · Localizar y verificar la fuente

Comprobar que el documento existe y es lo que dice ser.

- ¿Resuelve su localizador?
- ¿Coinciden título, publicación y año con lo declarado?

**Si no** → detiene en **E-1**. Motivo: CA-01.

### Paso 2 · Comprobar la naturaleza

Clasificar el documento según `20` y comprobar que su clase admite el papel que
se le quiere dar.

- ¿Es de una clase admisible?
- ¿Se pretende usar una secundaria como referencia?

**Si falla** → detiene en **E-2**. Motivo: CA-02.

### Paso 3 · Recorrer la cadena hasta la primaria

Si se llegó por una fuente secundaria, seguir la cadena verificando cada eslabón
(`20`, PR-01 a PR-05).

- ¿Se alcanzó la primaria?
- ¿Coinciden los valores entre eslabones?

**Si la cadena se rompe** → detiene en **E-2**. Motivo: CA-03.
**Si hay discrepancia** → prevalece la primaria; se registra la discrepancia.

### Paso 4 · Comprobar las cuatro coordenadas

En la fuente primaria, verificar que constan:

| Coordenada | Comprobar |
|---|---|
| Variable | Definición operacional, no solo el nombre (CA-04) |
| Método | Descripción suficiente para juzgar comparabilidad (CA-05) |
| Población | Criterios de inclusión (CA-06) |
| Estrato | Cómo divide la fuente sus resultados |

**Si falta alguna** → detiene en **E-3**. Motivo: el CA correspondiente.

### Paso 5 · Comprobar el contenido normativo

- ¿Qué tipo de norma es (`15`)?
- ¿Cumple lo que ese tipo exige?
- ¿Los estadísticos son explícitos y legibles (`21`, OR-1)?
- ¿Constan las limitaciones que la fuente declara?

**Si algún valor exigiría reconstrucción** → detiene en **E-3**. Motivo: CA-07.

Aquí se decide también si lo que parecía una norma es en realidad otra: un punto
de corte sin desenlace puede seguir siendo un percentil admisible.

### Paso 6 · Registrar

Completar el contrato (`14`), campo por campo:

- marcar el origen de cada uno (fuente o BREY, TR-08);
- registrar la ubicación exacta del dato (TR-09);
- registrar la cadena de procedencia (TR-10);
- marcar cualquier dato derivado con su supuesto (TR-11);
- **una entrada por estrato publicado** (`19`).

### Paso 7 · Graduar y publicar

- Ejecutar las once verificaciones (`16`, V-01 a V-11).
- Asignar nivel de calidad y declarar qué dimensiones lo degradaron (CN-30).
- Asignar nivel de confianza de la admisión (CN-31), distinto del anterior.
- Comprobar si entra en conflicto con alguna norma existente (`22`).
- Registrar autor, fecha y versión de criterios (TR-13, TR-14).

Estado inicial: **ES-1 · Activa**.

---

## Las dos preguntas del criterio de cierre

### «¿Esta fuente puede producir una norma admisible?»

Se responde recorriendo los pasos 1 a 5. La respuesta es **sí** si se llega al
paso 6, y **no** en cuanto un paso falla.

La respuesta nunca es «depende» ni «probablemente»: es el nivel del embudo
alcanzado y el criterio que lo detuvo.

### «¿Qué información falta para admitirla?»

Es el criterio que falló, expresado en concreto.

| Respuesta insuficiente | Respuesta correcta |
|---|---|
| «No cumple los criterios» | «Falta la descripción del método (CA-05)» |
| «La población no está clara» | «Solo consta la etiqueta; faltan criterios de inclusión (CA-06)» |
| «Los datos no sirven» | «Los percentiles solo aparecen en la figura 2 y no son legibles (CA-07)» |

La respuesta correcta permite retomar el trabajo si aparece un anexo o una
versión completa. La insuficiente obliga a repetirlo entero (TR-12).

---

## Si el procedimiento no cubre el caso

Puede ocurrir: los criterios se congelaron sin fuentes delante.

**Qué NO hacer:** improvisar un criterio para ese caso, admitir «provisionalmente»
o resolver por parecido con otro.

**Qué hacer:** detener la admisión, registrar el caso como no cubierto y elevarlo
como propuesta de modificación de criterios. Si los criterios cambian, cambian
para todas las normas, y las ya admitidas pasan a **ES-3 · Pendiente de
verificación**.

Un criterio inventado para una fuente concreta es exactamente lo que este sprint
existe para impedir.

## Quién puede ejecutarlo

Cualquiera que pueda leer la fuente. **No se exige criterio experto**: si el
procedimiento lo exigiera, no estaría congelado — estaría delegado en el juicio
de quien lo aplica, y dos personas obtendrían resultados distintos.

Donde el juicio es inevitable, el contrato lo hace visible: el nivel de confianza
de la admisión (CN-31) existe precisamente para registrar cuánto hubo que
interpretar.
