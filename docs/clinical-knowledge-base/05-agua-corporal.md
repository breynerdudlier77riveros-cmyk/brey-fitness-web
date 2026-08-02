---
modulo: 05
titulo: Agua corporal
tipo: variable
estado: verificado
nivel_evidencia_modulo: moderado
---

# 05 · Agua corporal

Responde directamente a dos de las preguntas que originaron esta base: *qué significa que el
agua intracelular aumente* y *qué significa un aumento simultáneo de agua extracelular*.

---

### Compartimentos hídricos

```yaml
id: compartimentos-hidricos
tipo: variable
variables_bcs: [agua_total_l, agua_intracelular_l, agua_extracelular_l]
nivel_evidencia: alto
referencias: [espen_bia_1, espen_bia_2]
estado: verificado
```

**Definición.**
El agua corporal total (TBW) se reparte en dos compartimentos: agua intracelular (ICW), la
contenida dentro de las células, y agua extracelular (ECW), la del plasma y el líquido
intersticial. TBW = ICW + ECW.

**Fundamento fisiológico.**
La membrana celular separa ambos compartimentos y mantiene gradientes iónicos distintos a cada
lado. Es esa separación la que la bioimpedancia detecta: a baja frecuencia la corriente circula
sobre todo por el espacio extracelular, y solo a frecuencias altas atraviesa las membranas. De
ahí que distinguir ICW de ECW exija un dispositivo multifrecuencia.

**Cambios esperables.**
El agua intracelular guarda relación con la masa celular corporal, y en consecuencia con el
tejido muscular, que es un tejido con alto contenido hídrico.

**Cambios inesperados.**
Un aumento de agua extracelular sin aumento proporcional de la intracelular no se explica por
ganancia de tejido.

**Relaciones conocidas.**
Con masa libre de grasa y masa muscular, por composición: el músculo es mayoritariamente agua.
La relación es **estructural, no causal** — el músculo no «produce» agua, la contiene.

**Factores de confusión.**
Ingesta de líquidos, sudoración, comida reciente, carga de glucógeno (cada gramo de glucógeno
se almacena con agua), ciclo menstrual, ejercicio intenso reciente, temperatura ambiente,
consumo de sodio.

Este conjunto es especialmente relevante en la población de BREY: **el agua corporal es la
variable más volátil del catálogo a corto plazo**, y buena parte de las variaciones diarias de
peso se explican por ella, no por cambios de tejido.

**Nivel de evidencia.** Alto para la fisiología de los compartimentos; el detalle de la
partición por BIA depende del dispositivo.

**Limitaciones.**
La partición ICW/ECW requiere multifrecuencia; los dispositivos de gama básica solo entregan el
total.

**Interpretaciones NO admisibles.**
- Leer un aumento de agua total como ganancia muscular.
- Leer una pérdida de agua como pérdida de grasa.
- Interpretar una variación de agua sin conocer las condiciones de la medición.

**Referencias.** `espen_bia_1`, `espen_bia_2`

---

### Cociente ECW/TBW

```yaml
id: cociente-ecw-tbw
tipo: indicador
variables_bcs: [agua_extracelular_l, agua_total_l]
nivel_evidencia: bajo_para_poblacion_brey
referencias: [ecw_tbw_hemodialisis_2023]
estado: verificado
```

**Definición.**
Proporción del agua corporal total que se encuentra en el espacio extracelular.

**Fundamento fisiológico.**
Un desplazamiento relativo del agua hacia el compartimento extracelular puede acompañar a
estados de sobrecarga de fluidos, a inflamación sistémica o a pérdida de masa celular. La
hipoalbuminemia puede elevarlo por su efecto sobre la presión oncótica.

**Cambios esperables.**
En las poblaciones estudiadas, un cociente elevado se ha asociado a desgaste proteico-energético
y a mayor mortalidad.

**Relaciones conocidas.**
Con marcadores de inflamación y con estado nutricional **en poblaciones clínicas**.

**Factores de confusión.**
Estado de hidratación, función renal, inflamación aguda, ejercicio reciente.

**Nivel de evidencia.** **Bajo para la población de BREY.** Alto dentro de su propio dominio
—pacientes en hemodiálisis, oncológicos— pero ese dominio no es el de una persona sana que
entrena. Es la advertencia más importante de este módulo.

**Limitaciones.**
Se localizan valores de referencia citados para «estado sano» en material de fabricantes, no en
literatura revisada por pares dentro de esta verificación. **No se registran aquí**: un rango de
referencia procedente de una fuente comercial no cumple la política de citación de esta base
(README).

**Interpretaciones NO admisibles.**
- Trasladar a un cliente sano el valor pronóstico obtenido en pacientes en hemodiálisis.
- Clasificar el cociente como normal o alterado usando rangos de fabricante.
- Inferir inflamación a partir de un cociente elevado en una persona sana.

**Referencias.** `ecw_tbw_hemodialisis_2023`

---

### Relación agua–glucógeno–peso

```yaml
id: agua-glucogeno-peso
tipo: fenomeno
variables_bcs: [agua_total_l, peso_kg]
nivel_evidencia: pendiente
referencias: []
estado: pendiente
```

**Definición.**
El glucógeno muscular y hepático se almacena hidratado, de modo que sus variaciones arrastran
cambios de agua corporal y, con ella, de peso.

**Por qué importa aquí.**
Es la explicación fisiológica más frecuente de los cambios rápidos de peso —de días— que un
entrenador observa y que no corresponden a cambios de tejido graso ni muscular. Sin ella, la
lectura de la primera comparación entre dos mediciones próximas es sistemáticamente errónea.

**Estado.**
`pendiente`. El mecanismo es de manual y no se discute, pero **no se localizó en esta
verificación una revisión sistemática o consenso citable** que fije la relación cuantitativa
(gramos de agua por gramo de glucógeno). Los valores que circulan habitualmente proceden de
estudios antiguos y de fuentes secundarias.

Se deja registrada como ficha incompleta en lugar de omitirla: el vacío es en sí mismo
información para el módulo 12, y cerrarlo con una cifra recordada sería exactamente lo que esta
base prohíbe.

**Interpretaciones NO admisibles (aplicables ya).**
- Atribuir a cambio de tejido una variación de peso entre mediciones muy próximas sin considerar
  el estado de glucógeno e hidratación.

**Referencias.** Ninguna verificada en v1.0.
