---
modulo: 11
titulo: Calidad de medición
tipo: metodo
estado: verificado
nivel_evidencia_modulo: alto
---

# 11 · Calidad de medición

Un dato de composición corporal vale lo que valga el procedimiento que lo produjo. Este módulo
documenta qué determina esa calidad.

---

### Estandarización del procedimiento

```yaml
id: estandarizacion-procedimiento
tipo: metodo
variables_bcs: []
nivel_evidencia: alto
referencias: [espen_bia_2, isak_estandares]
estado: verificado
```

**Definición.**
Conjunto de condiciones que deben mantenerse constantes entre mediciones para que su comparación
sea interpretable.

**Fundamento.**
Las variables de composición corporal son sensibles a condiciones fisiológicas de corto plazo.
Si esas condiciones cambian entre dos mediciones, el cambio observado mezcla variación real con
variación de contexto, y ambas resultan indistinguibles a posteriori.

**Condiciones documentadas.**
ESPEN establece que talla y peso deben **medirse** en el momento del test, y que los valores
referidos por el sujeto no son aceptables. La guía también condiciona la interpretabilidad al
balance hidroelectrolítico estable.

**Factores de confusión a controlar.**
Hora del día, ingesta reciente de alimentos y líquidos, ejercicio previo, estado de hidratación,
temperatura, posición corporal, colocación de electrodos y —de forma crítica— **el mismo
dispositivo**.

**Nivel de evidencia.** Alto.

**Limitaciones.**
Las ecuaciones de BIA se validaron en condiciones de laboratorio. No se localizó evidencia
sobre el error técnico añadido por las condiciones reales de un gimnasio o consulta (ver módulo
12, §10).

**Interpretaciones NO admisibles.**
- Comparar mediciones tomadas en condiciones distintas como si fueran equivalentes.
- Comparar mediciones de dispositivos distintos.

**Referencias.** `espen_bia_2`, `isak_estandares`

---

### Error técnico de medida (TEM)

```yaml
id: error-tecnico-de-medida
tipo: metodo
variables_bcs: []
nivel_evidencia: alto
referencias: [isak_estandares]
estado: verificado
```

**Definición.**
Medida de la variabilidad atribuible al procedimiento y al medidor, no al sujeto.

**Fundamento.**
Toda medición repetida sobre un sujeto que no ha cambiado produce valores ligeramente distintos.
El TEM cuantifica ese ruido y establece el suelo por debajo del cual un cambio observado no es
distinguible del error.

**Por qué importa.**
Es el concepto que separa «cambió» de «se midió distinto». Sin una estimación del error, no hay
criterio para decidir si una diferencia significa algo.

**Relaciones conocidas.**
ISAK construye su esquema de acreditación en cuatro niveles precisamente sobre el mantenimiento
objetivo del TEM, exigido en todos los niveles. En la literatura antropométrica se aplica
habitualmente un umbral del 5 % para pliegues cutáneos evaluado con ICC, TEM y CV%.

**Nivel de evidencia.** Alto para el marco conceptual y el esquema de acreditación.

**Limitaciones.**
El umbral del 5 % citado corresponde a pliegues cutáneos en el marco ISAK. **No se ha
verificado un TEM equivalente publicado para las variables derivadas de bioimpedancia**, que es
lo que BREY registra.

**Interpretaciones NO admisibles.**
- Trasladar el umbral de pliegues a variables de bioimpedancia.
- Interpretar como cambio real una diferencia menor que el error de la técnica.
- Presentar decimales como si tuvieran significado clínico cuando la técnica no los resuelve.

**Referencias.** `isak_estandares`

---

### Consistencia interna del registro

```yaml
id: consistencia-interna
tipo: metodo
variables_bcs: [peso_kg, masa_grasa_kg, masa_libre_grasa_kg, agua_total_l, agua_intracelular_l, agua_extracelular_l]
nivel_evidencia: alto
referencias: [espen_bia_1]
estado: verificado
```

**Definición.**
Comprobaciones que un registro debe satisfacer por construcción, con independencia de la
persona medida.

**Fundamento.**
Los modelos de composición corporal son aditivos: los compartimentos de un nivel deben sumar el
total de ese nivel. Masa grasa + masa libre de grasa = peso. Agua intracelular + agua
extracelular = agua total. Ninguna masa parcial puede superar el peso corporal.

Un registro que viola estas identidades contiene un error, sin necesidad de conocer nada del
sujeto.

**Relaciones conocidas.**
Es la comprobación de máxima prioridad: si falla, ninguna otra lectura del registro es
interpretable.

**Nivel de evidencia.** Alto — se deriva de la definición de los modelos (módulo 02), no de un
estudio empírico.

**Limitaciones.**
La identidad indica **que** hay un error, nunca **dónde**. Puede originarse en el dispositivo,
en el redondeo o en la transcripción manual.

Además, la comprobación de agua carece de tolerancia numérica publicada (módulo 12, §3), lo que
la hace conceptualmente obligatoria pero no implementable como criterio automático.

**Interpretaciones NO admisibles.**
- Concluir cuál de los valores implicados es el incorrecto.
- Atribuir la inconsistencia a un fallo del dispositivo como conclusión: lo admisible es marcar
  el registro para revisión.

**Referencias.** `espen_bia_1`
