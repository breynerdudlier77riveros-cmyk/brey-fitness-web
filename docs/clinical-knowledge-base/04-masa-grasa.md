---
modulo: 04
titulo: Masa grasa
tipo: variable
estado: parcial
nivel_evidencia_modulo: moderado
---

# 04 · Masa grasa

Responde a la segunda pregunta que originó esta base: *¿por qué disminuye la grasa?*

---

### Reducción de masa grasa

```yaml
id: reduccion-masa-grasa
tipo: fenomeno
variables_bcs: [masa_grasa_kg, grasa_pct, peso_kg]
nivel_evidencia: moderado
referencias: [barakat_recomposicion_2020]
estado: verificado
```

**Definición.**
Descenso del peso absoluto de tejido adiposo.

**Fundamento fisiológico.**
El tejido adiposo almacena energía en forma de triglicéridos. Un balance energético negativo
sostenido moviliza ese sustrato para su oxidación. La magnitud del déficit y su duración
determinan la pérdida total; el estímulo de entrenamiento de fuerza y la ingesta proteica
influyen en qué proporción de esa pérdida procede de tejido graso frente a tejido magro.

**Cambios esperables.**
Descenso gradual de la masa grasa y, en consecuencia, del porcentaje graso.

**Cambios inesperados.**
Un descenso rápido del peso con porcentaje graso estable es más compatible con pérdida hídrica
que con pérdida de tejido graso.

**Relaciones conocidas.**
Con el peso, de forma directa. Con el porcentaje graso, de forma directa pero **no
equivalente**: el porcentaje puede moverse por cambios en el denominador (P3, módulo 01).

**Factores de confusión.**
Hidratación, contenido digestivo y error de estimación. En bioimpedancia la masa grasa suele
**derivarse** del peso y del porcentaje graso, por lo que hereda el error de ambos.

**Nivel de evidencia.** Moderado.

**Limitaciones.**
No se localizó en esta verificación un metaanálisis específico sobre la tasa de pérdida grasa
esperable en población entrenada. Cualquier cifra de pérdida semanal esperable quedaría sin
respaldo, y por eso no se registra ninguna.

**Interpretaciones NO admisibles.**
- Atribuir la pérdida a una intervención concreta (P4, módulo 01).
- Proyectar la pérdida futura.
- Leer un descenso del porcentaje graso como pérdida de grasa sin comprobar la masa absoluta.

**Referencias.** `barakat_recomposicion_2020`

---

### Grasa visceral

```yaml
id: grasa-visceral
tipo: indicador
variables_bcs: [grasa_visceral_idx]
nivel_evidencia: insuficiente
referencias: []
estado: pendiente
```

**Definición.**
Estimación de la grasa que rodea los órganos abdominales, expresada por los analizadores de
bioimpedancia como un índice adimensional.

**Estado.**
`pendiente`. La escala es **propietaria de cada fabricante**, sin equivalencia publicada entre
marcas ni rango universal. No se localizó en esta verificación una fuente revisada por pares que
permita interpretar el índice de un dispositivo genérico.

**Interpretaciones NO admisibles (aplicables ya).**
- Comparar el índice entre dispositivos de fabricantes distintos.
- Clasificarlo con un rango de referencia de fuente comercial (módulo 12, §5).
- Presentarlo como una medida de grasa visceral, cuando es un índice derivado.

Lo único admisible con el conocimiento disponible es leerlo como **serie temporal del mismo
cliente medido siempre con el mismo dispositivo**.

**Referencias.** Ninguna verificada en v1.0. Ver módulo 12, §6.
