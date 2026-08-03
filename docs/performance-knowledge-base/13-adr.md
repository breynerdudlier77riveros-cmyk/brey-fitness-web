---
modulo: 13
titulo: Decisiones documentales (ADR)
estado: v1.0
---

# 13 · Decisiones documentales

Las decisiones que podrían haberse tomado de otra manera, con lo que se descartó y qué cuesta cada
una.

---

## PKB-ADR-01 · Ninguna correspondencia alcanza «Respaldada»

**Contexto.** El estado más alto de la matriz exige validez de constructo demostrada. Con el
criterio aplicado, ninguna de las once pruebas lo alcanza — ni siquiera el 1RM, que tiene la
fiabilidad mejor documentada del catálogo.

**Decisión.** El nivel «Respaldada» queda vacío en v1.0.

**Alternativa descartada.** Relajar el criterio para que la fiabilidad alta bastara.

**Consecuencias.** La matriz parece pobre. A cambio, «Respaldada» conserva significado: cuando
algo llegue a ese nivel, querrá decir lo que dice. Un criterio que aprueba a todos no informa de
nada.

---

## PKB-ADR-02 · La fiabilidad no basta para autorizar una correspondencia

**Contexto.** La literatura verificada de evaluación física está desproporcionadamente concentrada
en fiabilidad. Aceptarla como respaldo habría llenado la matriz.

**Decisión.** Una correspondencia exige respaldo del **constructo**, no solo de la reproducibilidad.
Las que solo tienen fiabilidad entran como «parcialmente respaldada» con el alcance restringido a
lo que la prueba mide directamente.

**Alternativa descartada.** Tratar fiabilidad alta como aval suficiente.

**Consecuencias.** Es la decisión que más correspondencias descarta, y la que separa esta base del
material comercial del sector — que presenta sistemáticamente lo uno como lo otro.

---

## PKB-ADR-03 · El CMJ no se autoriza para potencia

**Contexto.** Es probablemente la correspondencia más usada de toda la evaluación física.

**Decisión.** M-08 queda como **insuficiente**. El CMJ mide altura; la potencia es trabajo por
unidad de tiempo.

**Alternativa descartada.** Autorizarla con reservas, dado el uso universal.

**Consecuencias.** El PAS no podrá evaluar A-03 Potencia con la prueba que todo el mundo usa. Se
asume: el uso extendido no es evidencia, y la alternativa sería documentar como establecido algo
que las fuentes verificadas no establecen.

---

## PKB-ADR-04 · El FMS se documenta para poder rechazarlo

**Contexto.** Podría haberse omitido: no aporta ninguna correspondencia autorizada.

**Decisión.** Se documenta con ficha completa y tres referencias.

**Alternativa descartada.** No incluirlo por irrelevante.

**Consecuencias.** Cuesta espacio documentar una prueba que no se usa. A cambio, cuando alguien
proponga incorporarlo —y lo hará, porque está por todas partes— la respuesta ya está escrita y
citada. **Una base que solo documenta lo que aprueba no sirve para decir que no.**

---

## PKB-ADR-05 · Se distingue «sin evidencia» de «no verificado»

**Contexto.** Los tests de esprint (P-11) y la fiabilidad del CMJ (P-04) no se verificaron en este
sprint. Su literatura es amplia.

**Decisión.** Se registran como **deuda de búsqueda** (D-01, D-02), nunca como ausencia de
evidencia.

**Alternativa descartada.** Marcarlos «sin evidencia» sin más.

**Consecuencias.** Obliga a mantener dos categorías que se parecen. A cambio, evita que un límite
de este sprint se congele como una afirmación científica falsa. Es la distinción de la que depende
la honestidad de toda la base.

---

## PKB-ADR-06 · Los pesos quedan indeterminados

**Contexto.** El catálogo del PAE tiene un campo `peso` por contribución.

**Decisión.** No se asigna ningún peso en v1.0.

**Alternativa descartada.** Repartirlos uniformemente, o por juicio.

**Consecuencias.** El campo queda pendiente. Un peso uniforme parecería una decisión informada sin
serlo, y el Sprint 1 del PAS ya prohibió expresamente la ponderación sin respaldo.

---

## PKB-ADR-07 · Los campos no verificados se omiten

**Contexto.** Cuatro referencias tienen autoría incompleta o sin confirmar.

**Decisión.** El campo se **omite** y la omisión se declara en la `nota` de la entrada.

**Alternativa descartada.** Completar por plausibilidad; descartar la referencia entera.

**Consecuencias.** Las fichas quedan visiblemente incompletas. Es lo correcto: una cita con un
apellido inventado es peor que una cita sin autor, porque parece verificada. Política heredada de
la CKB.

---

## PKB-ADR-08 · La PKB no es código

**Contexto.** Podría expresarse como estructura de datos y que el PAE la importara.

**Decisión.** Es documentación. El traslado de la matriz al catálogo lo hace una persona.

**Alternativa descartada.** Un fichero de datos que el motor consuma directamente.

**Consecuencias.** El traslado es manual y puede desincronizarse. A cambio, un cambio de redacción
no altera en silencio lo que el sistema afirma, y cada correspondencia que entra al catálogo pasa
por una decisión consciente. La barrera es el objetivo, no un efecto secundario.

---

## PKB-ADR-09 · Se excluyen las fuentes comerciales sin excepción

**Contexto.** Buena parte del material sobre FMS y Y-Balance procede de quienes venden formación,
certificación e instrumental.

**Decisión.** Excluidas, aunque contengan datos.

**Alternativa descartada.** Admitirlas señalando el conflicto de interés.

**Consecuencias.** Se pierde volumen de información. A cambio se evita el sesgo que produjo el
problema que este módulo documenta: ese material presenta como establecida justo la afirmación
—la predicción de lesión— que las revisiones independientes no sostienen.

---

## PKB-ADR-10 · Las capacidades reservadas no se documentan

**Contexto.** F-01 y F-02 están congeladas hasta el Sprint PAS-5.

**Decisión.** No se documentan en v1.0.

**Alternativa descartada.** Documentarlas «para tenerlo listo».

**Consecuencias.** Habrá que hacer ese trabajo después. A cambio, no existe una ficha a medio
hacer que invite a activar antes de tiempo dos capacidades que rozan territorio clínico.
