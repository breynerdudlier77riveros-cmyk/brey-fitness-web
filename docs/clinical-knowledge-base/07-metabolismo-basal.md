---
modulo: 07
titulo: Metabolismo basal
tipo: variable
estado: verificado
nivel_evidencia_modulo: moderado
---

# 07 · Metabolismo basal

---

### Tasa metabólica basal

```yaml
id: metabolismo-basal
tipo: variable
variables_bcs: [bmr_kcal]
nivel_evidencia: moderado
referencias: [rmr_atletas_2023]
estado: verificado
```

**Definición.**
Energía que el organismo consume en reposo para mantener sus funciones vitales.

**Fundamento fisiológico.**
La mayor parte del gasto en reposo procede de tejidos metabólicamente activos: vísceras,
cerebro y músculo. La masa libre de grasa es el principal determinante individual, razón por la
que la mayoría de ecuaciones predictivas la incorporan de forma directa o indirecta, a través de
peso, talla, edad y sexo.

**Cambios esperables.**
Variación lenta, acompañando a cambios de masa magra.

**Cambios inesperados.**
Saltos apreciables entre mediciones próximas sin cambio de peso son más compatibles con un
cambio en las entradas de la ecuación que con un cambio metabólico real.

**Relaciones conocidas.**
Con masa libre de grasa y masa muscular. **En la mayoría de dispositivos el valor no se mide:
se calcula** a partir de otras variables ya estimadas, de modo que su correlación con ellas es
matemática y no un hallazgo biológico (módulo 10).

**Factores de confusión.**
La ecuación empleada por el dispositivo, que habitualmente no se publica.

**Nivel de evidencia.** Moderado. Existen revisiones sistemáticas con metaanálisis sobre la
exactitud de las ecuaciones predictivas.

**Limitaciones.**
La exactitud **varía marcadamente** según sexo, índice de masa corporal, edad y etnia, y ninguna
ecuación resulta uniformemente superior. En atletas, varias ecuaciones de uso general muestran
desviaciones sistemáticas, y las que mejor se comportan en esa población no coinciden
necesariamente con las de uso clínico habitual. Un valor obtenido por calorimetría indirecta y
uno estimado por ecuación no son intercambiables.

**Interpretaciones NO admisibles.**
- Presentar un valor estimado como un valor medido.
- Comparar el metabolismo basal de dos personas como si la estimación midiera lo mismo en ambas.
- Derivar de él una recomendación de ingesta: esta base no emite recomendaciones, y la
  incertidumbre de la estimación no lo permitiría.

**Referencias.** `rmr_atletas_2023`

---

### Edad metabólica

```yaml
id: edad-metabolica
tipo: indicador
variables_bcs: [edad_metabolica]
nivel_evidencia: insuficiente
referencias: [edad_metabolica_caidas_2025]
estado: verificado
```

**Definición.**
Cifra propietaria que cada fabricante calcula comparando el metabolismo basal estimado del
sujeto con un promedio poblacional por edad.

**Estado de la evidencia.**
La evidencia localizada indica que refleja principalmente la **edad cronológica** y las propias
estimaciones de composición corporal del dispositivo, con correlación moderada con la edad
cronológica y sin asociación independiente con multimorbilidad en el estudio revisado. Existen
trabajos que le atribuyen asociación con marcadores de riesgo metabólico, pero la propia
literatura reclama validación externa.

**Interpretaciones NO admisibles.**
- Presentarla como una edad biológica real.
- Clasificarla como favorable o desfavorable.
- Compararla entre fabricantes: la fórmula no es pública y difiere entre marcas.

**Referencias.** `edad_metabolica_caidas_2025`. Ver módulo 12, §2.
