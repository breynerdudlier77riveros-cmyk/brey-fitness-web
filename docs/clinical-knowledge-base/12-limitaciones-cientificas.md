---
modulo: 12
titulo: Limitaciones científicas y vacíos
tipo: fundacional
estado: verificado
---

# 12 · Limitaciones científicas y vacíos

Registro de lo que **no** se sabe, o no se sabe para la población de BREY. Para los motores
que consultarán esta base, este módulo tiene el mismo rango que cualquier otro: delimita lo que
no puede afirmarse.

---

## 1 · El sesgo de población

El vacío más importante de toda la base, y el que más fácilmente se pasa por alto.

Buena parte de la evidencia disponible sobre bioimpedancia y sus variables derivadas procede de
**poblaciones clínicas**: pacientes en hemodiálisis, oncológicos, críticos, con cirrosis o EPOC.
Son poblaciones donde la BIA tiene valor pronóstico demostrado y donde la investigación se
financia.

La población de BREY es la opuesta: personas mayoritariamente sanas que entrenan.

| Variable | Dónde está la evidencia | Aplicable a población BREY |
|---|---|---|
| Ángulo de fase | Críticos, oncología, hemodiálisis | **No demostrado** |
| Cociente ECW/TBW | Hemodiálisis, oncología | **No demostrado** |
| Edad metabólica | Ver §2 | **No** |
| Seguimiento longitudinal | Pediatría con obesidad, cohortes generales | Parcialmente |

Trasladar un cociente de riesgo obtenido en pacientes críticos a un cliente de gimnasio es el
error de razonamiento más probable en este dominio. Ninguna ficha de esta base lo autoriza.

---

## 2 · Edad metabólica

```yaml
id: vacio-edad-metabolica
variables_bcs: [edad_metabolica]
referencias: [edad_metabolica_caidas_2025]
estado: verificado
```

La evidencia localizada indica que la edad metabólica estimada por bioimpedancia **refleja
principalmente la edad cronológica y las propias estimaciones de composición corporal del
dispositivo**, con correlación moderada con la edad cronológica y sin asociación independiente
con multimorbilidad en el estudio revisado.

Existen trabajos recientes que le atribuyen asociación con marcadores de riesgo metabólico,
pero la propia literatura reclama validación externa y estudio de su respuesta a
intervenciones.

**Consecuencia para BREY.** No hay base para clasificarla ni para presentarla como una edad
biológica real. Es una cifra propietaria del fabricante. El BCS ya la trata así.

---

## 3 · Ausencia de tolerancia para la validación agua intra + extra ≈ total

La comprobación cruzada existe conceptualmente y es fisiológicamente obligatoria (TBW = ICW +
ECW), pero **no se localizó una tolerancia numérica publicada** que permita decidir cuándo la
diferencia observada es aceptable.

Sin ese número, la validación no es implementable. Es un vacío heredado que esta base confirma
en lugar de resolver.

---

## 4 · Ausencia de periodicidad documentada

No se localizó, ni en esta verificación ni en la documentación interna del ecosistema, ninguna
fuente que establezca **cada cuánto** debe repetirse una medición de composición corporal.

Es probable que no exista como recomendación universal: el intervalo razonable depende del
objetivo, de la magnitud de cambio esperable y de la precisión de la técnica, y ninguna de las
tres es constante.

**Consecuencia.** El Recommendation Engine declara este ámbito como no cubierto. Esta base
confirma el vacío y no lo cierra.

---

## 5 · Rangos de referencia de fuente comercial

Para varias variables —cociente ECW/TBW, índice de grasa visceral, ángulo de fase— circulan
rangos de referencia que proceden de **documentación de fabricantes de básculas**, no de
literatura revisada por pares.

Esta base no los registra. La política de citación del README excluye fuentes comerciales, y
un rango de referencia es exactamente el tipo de afirmación donde esa exclusión más importa:
es lo que convertiría una descripción en una clasificación.

---

## 6 · Grasa visceral sin escala universal

El índice de grasa visceral se expresa en una escala **propietaria de cada fabricante**, sin
equivalencia publicada entre marcas. No existe rango universal.

**Consecuencia.** El valor solo es interpretable como serie temporal del mismo cliente medido
siempre con el mismo dispositivo. Comparar entre dispositivos, o contra una referencia externa,
no es admisible.

---

## 7 · Ecuaciones de metabolismo basal dependientes de población

La exactitud de las ecuaciones predictivas de metabolismo basal **varía marcadamente según
sexo, IMC, edad y etnia**, y ninguna es uniformemente superior. En atletas, varias ecuaciones de
uso general muestran desviaciones sistemáticas.

**Consecuencia.** Un valor de BMR estimado no es un dato medido, y su margen de error depende
de a quién se aplique. Comparar el BMR de dos personas es más frágil que seguir el de una sola.

---

## 8 · Relación glucógeno–agua sin cifra citable

El mecanismo es de manual —el glucógeno se almacena hidratado— pero no se localizó una revisión
sistemática o consenso que fije la relación cuantitativa. Ver ficha `agua-glucogeno-peso`
(módulo 05), registrada como `pendiente`.

---

## 9 · Contradicciones encontradas

**9.1 · Uso longitudinal frente a advertencia de cautela.**
ESPEN admite el seguimiento longitudinal en IMC 16–34 sin hidratación anormal, pero añade que
«debe interpretarse con cautela». Al mismo tiempo, la evidencia más reciente sugiere que el
seguimiento longitudinal es precisamente el uso *más* defendible de la técnica. No es una
contradicción lógica —cautela no es prohibición— pero sí una tensión de énfasis entre una guía
de 2004 y trabajos posteriores.

**Resolución adoptada:** se documentan ambas. La base no arbitra entre fuentes.

**9.2 · Edad metabólica: asociación frente a validez.**
Trabajos recientes reportan asociaciones con riesgo metabólico; otro concluye que la métrica
refleja sobre todo edad cronológica y composición. Ambas pueden ser ciertas: una variable puede
asociarse a un desenlace sin aportar información más allá de sus componentes.

**Resolución adoptada:** se registra la limitación, no la promesa.

---

## 10 · Qué haría falta para cerrar estos vacíos

No es trabajo de redacción, sino de verificación bibliográfica:

1. Position stand de ACSM o NSCA sobre evaluación de composición corporal en población que
   entrena, si existe.
2. Metaanálisis de BIA frente a DXA en **adultos sanos entrenados**, específicamente sobre
   sensibilidad al cambio.
3. Consenso sobre ángulo de fase en población no clínica, si existe.
4. Fuente revisada por pares para el cociente ECW/TBW en población sana.
5. Evidencia sobre error técnico de medida de la BIA en condiciones de campo (gimnasio), frente
   a las condiciones de laboratorio en que se validaron las ecuaciones.
