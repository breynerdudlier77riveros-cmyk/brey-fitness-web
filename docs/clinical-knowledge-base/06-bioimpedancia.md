---
modulo: 06
titulo: Bioimpedancia
tipo: metodo
estado: verificado
nivel_evidencia_modulo: alto
---

# 06 · Bioimpedancia

Módulo con la evidencia más sólida de esta base, y el más importante para BREY: **todas** las
variables del BCS proceden, directa o indirectamente, de un analizador de bioimpedancia.

---

### Principio de medición

```yaml
id: bia-principio
tipo: metodo
variables_bcs: [impedancia_ohm]
nivel_evidencia: alto
referencias: [espen_bia_1, espen_bia_2]
estado: verificado
```

**Definición.**
La bioimpedancia eléctrica (BIA) estima la composición corporal a partir de la oposición que
ofrece el cuerpo al paso de una corriente alterna de bajo voltaje.

**Fundamento fisiológico.**
Los tejidos con alto contenido de agua y electrolitos —músculo, sangre, vísceras— conducen la
corriente con facilidad. El tejido graso y el hueso, con poca agua, la conducen mal. La
impedancia total combina dos componentes: la **resistencia**, dominada por el agua corporal, y
la **reactancia**, producida por el comportamiento capacitivo de las membranas celulares.

De ahí que la BIA no *mida* grasa ni músculo: mide una propiedad eléctrica y **deriva** el
resto mediante ecuaciones de regresión validadas en poblaciones concretas.

**Cambios esperables.**
La impedancia varía inversamente con el agua corporal total.

**Cambios inesperados.**
Variaciones abruptas sin cambio de peso ni de condiciones apuntan a diferencias en el estado de
hidratación, en la temperatura cutánea, en el contacto de los electrodos o en el dispositivo.

**Relaciones conocidas.**
Es la magnitud primaria de la que el analizador deriva internamente casi todas las demás. Su
relación con el resto de variables no es concurrente: es **de derivación**.

**Factores de confusión.**
Hidratación, ingesta reciente de alimentos o líquidos, ejercicio previo, temperatura ambiente y
cutánea, posición corporal, colocación de electrodos, frecuencia de la corriente y fabricante.

**Nivel de evidencia.** Alto. Principio físico establecido y documentado en guía de sociedad
científica.

**Limitaciones.**
La medida bruta carece de significado clínico por sí sola; todo su valor depende de la ecuación
aplicada.

**Interpretaciones NO admisibles.**
- Que la BIA «mide» grasa o músculo. Los estima.
- Que dos dispositivos distintos produzcan valores comparables en la misma persona.

**Referencias.** `espen_bia_1`, `espen_bia_2`

---

### Condiciones de validez

```yaml
id: bia-condiciones-validez
tipo: metodo
variables_bcs: []
nivel_evidencia: alto
referencias: [espen_bia_2]
estado: verificado
```

**Definición.**
Conjunto de condiciones bajo las cuales ESPEN considera que la estimación por BIA es
interpretable.

**Fundamento.**
Las ecuaciones se derivan asumiendo una hidratación estable y una geometría corporal típica.
Fuera de esos supuestos, la relación entre impedancia y composición deja de sostenerse.

**Condiciones documentadas (ESPEN, 2004).**

| Condición | Estado según la guía |
|---|---|
| Sujetos sanos o con balance hidroelectrolítico estable, con ecuación validada para edad, sexo y raza | La BIA funciona bien |
| Extremos de IMC o hidratación anormal | **No recomendable** de forma rutinaria hasta nueva validación |
| Seguimiento longitudinal con IMC 16–34 sin hidratación anormal | Posible, **interpretando con cautela** |
| BIA multifrecuencia o segmental en condiciones alteradas | Posible ventaja, requiere más validación |
| Talla y peso | Deben **medirse** en el momento del test; los valores referidos por el sujeto no son aceptables |

**Relaciones conocidas.**
Estas condiciones gobiernan la interpretabilidad de todas las demás fichas de esta base que
dependan de una variable derivada de BIA. Es una dependencia transversal.

**Factores de confusión.** Los de la ficha anterior.

**Nivel de evidencia.** Alto. Guía de sociedad científica.

**Limitaciones.**
La guía es de 2004. La tecnología multifrecuencia y segmental ha evolucionado desde entonces;
la propia guía anticipaba esa validación pendiente. No se localizó en esta verificación una
actualización posterior equivalente de ESPEN.

**Interpretaciones NO admisibles.**
- Aplicar los resultados fuera del rango de IMC 16–34 sin advertirlo.
- Tratar una talla referida por el sujeto como equivalente a una medida.

**Referencias.** `espen_bia_2`

---

### Exactitud transversal frente a seguimiento longitudinal

```yaml
id: bia-transversal-vs-longitudinal
tipo: metodo
variables_bcs: [grasa_pct, masa_grasa_kg, masa_muscular_kg, masa_libre_grasa_kg]
nivel_evidencia: moderado
referencias: [bia_dxa_longitudinal_ninos_2024, bia_dxa_ukbiobank, espen_bia_2]
estado: verificado
```

**Definición.**
La BIA se comporta de forma distinta según se use para conocer un valor absoluto o para seguir
su cambio en el tiempo.

**Fundamento.**
El sesgo de una ecuación de regresión tiende a ser **consistente dentro de un mismo sujeto y
dispositivo**. Al restar dos medidas con el mismo sesgo, buena parte del error se cancela; al
leer una sola medida, no.

**Cambios esperables.**
La evidencia disponible indica que la BIA sigue los cambios longitudinales de composición
corporal de forma razonable, mientras que en corte transversal tiende a subestimar la masa
grasa y sobreestimar la masa libre de grasa frente a DXA.

**Cambios inesperados.**
Un cambio grande en una sola medición aislada es más compatible con variación de condiciones de
medida que con un cambio real de tejido.

**Relaciones conocidas.**
Esta ficha es la justificación fisiológica del diseño longitudinal del BCS: comparar a una
persona consigo misma es metodológicamente más defendible que situarla frente a una referencia
poblacional.

**Factores de confusión.**
Cambiar de dispositivo entre mediciones anula la cancelación del sesgo y convierte la
comparación en no interpretable.

**Nivel de evidencia.** Moderado. Concordante entre fuentes, pero una de ellas es un preprint
sin revisión por pares (`bia_dxa_ukbiobank`) y otra es población pediátrica con obesidad
(`bia_dxa_longitudinal_ninos_2024`). No se localizó un metaanálisis en adultos sanos
entrenados.

**Limitaciones.**
La concordancia individual con DXA presenta intervalos amplios; el buen comportamiento
longitudinal está documentado sobre todo **a nivel de grupo**.

**Interpretaciones NO admisibles.**
- Presentar un porcentaje graso de BIA como un valor exacto.
- Comparar el valor absoluto de un cliente con el de otro.
- Comparar dos mediciones tomadas con dispositivos distintos.

**Referencias.** `bia_dxa_longitudinal_ninos_2024`, `bia_dxa_ukbiobank`, `espen_bia_2`

---

### Ángulo de fase

```yaml
id: angulo-de-fase
tipo: indicador
variables_bcs: [angulo_fase_deg]
nivel_evidencia: moderado
referencias: [angulo_fase_criticos_metaanalisis]
estado: verificado
```

**Definición.**
Ángulo derivado de la relación entre resistencia y reactancia, expresado en grados.

**Fundamento fisiológico.**
Refleja la contribución relativa de los fluidos (resistencia) y de las membranas celulares
(reactancia). Valores más altos se asocian a mayor cantidad de membranas celulares íntegras;
valores más bajos, a menor integridad celular.

**Cambios esperables.**
En la literatura se han descrito asociaciones con masa y fuerza muscular.

**Relaciones conocidas.**
Con masa celular corporal y con el reparto de agua entre compartimentos.

**Factores de confusión.**
Hidratación, edad, sexo, frecuencia del dispositivo.

**Nivel de evidencia.** Moderado **y fuertemente condicionado por la población**. La evidencia
pronóstica localizada procede de pacientes críticos, oncológicos, en hemodiálisis, con cirrosis
o EPOC.

**Limitaciones.**
No se localizó evidencia que permita interpretar el ángulo de fase como marcador de progreso en
personas sanas que entrenan, que es la población de BREY. Extrapolar el valor pronóstico desde
poblaciones clínicas sería un salto no autorizado.

**Interpretaciones NO admisibles.**
- Presentarlo como indicador de «salud celular» de una persona sana.
- Trasladar cocientes de riesgo obtenidos en pacientes críticos a un cliente de gimnasio.
- Clasificarlo como normal o anormal: no se localizó punto de corte para población general.

**Referencias.** `angulo_fase_criticos_metaanalisis`

---

## Nota de coherencia con el ecosistema

Lo anterior respalda de forma independiente tres decisiones ya tomadas en el BCS: no clasificar
el ángulo de fase, no comparar el índice de grasa visceral entre dispositivos distintos, y
construir el reporte sobre la evolución del individuo en lugar de sobre normas poblacionales.
Las decisiones se tomaron antes que esta base; la evidencia las acompaña, no al revés.
