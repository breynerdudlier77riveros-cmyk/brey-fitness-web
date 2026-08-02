---
modulo: 09
titulo: Patrones de cambio
tipo: patron
estado: verificado
nivel_evidencia_modulo: moderado
---

# 09 · Patrones de cambio

Responde a las preguntas de combinación que originaron esta base: *qué patrones son compatibles
con recomposición corporal*, *qué significa perder peso con pérdida muscular*, *qué significa
ganar peso sin ganar grasa*, *qué cambios suelen indicar error de medición*.

Un patrón es una **combinación** de direcciones observadas. Este módulo describe qué se sabe de
cada combinación; no clasifica a nadie ni califica ninguna como preferible — el objetivo de la
persona no forma parte del dato.

---

### Recomposición corporal

```yaml
id: patron-recomposicion
tipo: patron
variables_bcs: [peso_kg, grasa_pct, masa_grasa_kg, masa_muscular_kg]
nivel_evidencia: moderado
referencias: [barakat_recomposicion_2020]
estado: verificado
```

**Definición.**
Aumento de masa muscular con descenso simultáneo de masa grasa, con el peso corporal estable,
en descenso leve o en ascenso leve.

**Fundamento fisiológico.**
Masa magra y masa grasa responden a señales distintas. El entrenamiento de fuerza y una ingesta
proteica suficiente sostienen la síntesis proteica muscular, mientras un déficit energético
moderado moviliza sustrato desde el tejido adiposo. Ambos procesos pueden coexistir cuando
ninguna de las dos señales es lo bastante extrema como para anular la otra.

**Cambios esperables.**
La evidencia localizada documenta el fenómeno de forma más robusta en personas **no entrenadas
previamente** y en personas con **mayor porcentaje graso inicial**. En personas entrenadas y
magras sigue siendo posible bajo condiciones específicas, pero el ritmo de ganancia muscular en
déficit es lento.

**Cambios inesperados.**
Una recomposición aparente muy rápida entre dos mediciones próximas es más compatible con
variación de agua corporal que con cambio real de tejido — ver módulo 05.

**Relaciones conocidas.**
Peso ↔ masa grasa ↔ masa muscular, con el agua corporal como confusor dominante a corto plazo.

**Factores de confusión.**
Estado de hidratación y glucógeno, error de la propia estimación por BIA, intervalo corto entre
mediciones.

**Nivel de evidencia.** Moderado. Revisión narrativa, no metaanálisis. Las variables descritas
como influyentes son el entrenamiento de fuerza progresivo y la ingesta proteica.

**Limitaciones.**
La magnitud y la velocidad esperables dependen del punto de partida y del historial de
entrenamiento; la evidencia no permite anticipar una cifra para un individuo concreto.

**Interpretaciones NO admisibles.**
- Calificar el patrón como «bueno» o «exitoso». Depende de un objetivo que el dato no contiene.
- Prometer o proyectar recomposición futura a partir de dos mediciones.
- Afirmar recomposición cuando la magnitud del cambio está dentro del error de la técnica.

**Referencias.** `barakat_recomposicion_2020`

---

### Descenso de peso con descenso de masa muscular

```yaml
id: patron-perdida-peso-con-perdida-muscular
tipo: patron
variables_bcs: [peso_kg, masa_muscular_kg, masa_libre_grasa_kg]
nivel_evidencia: moderado
referencias: [ewgsop2_sarcopenia, barakat_recomposicion_2020]
estado: verificado
```

**Definición.**
Reducción del peso corporal acompañada de reducción de masa muscular o de masa libre de grasa.

**Fundamento fisiológico.**
En un déficit energético el organismo moviliza sustrato de varios compartimentos. La proporción
que procede de masa magra frente a masa grasa depende, entre otros factores, del estímulo de
entrenamiento de fuerza y de la ingesta proteica: sin estímulo mecánico suficiente, la masa
magra participa más en la pérdida.

**Cambios esperables.**
Descenso conjunto de peso, masa muscular y, con frecuencia, agua intracelular — esta última por
composición del propio tejido, no como fenómeno independiente.

**Relaciones conocidas.**
Con masa libre de grasa (que contiene al músculo) y con agua intracelular.

**Factores de confusión.**
Deshidratación puntual reproduce parte del patrón sin pérdida real de tejido. Es la confusión
más habitual y la que más falsos positivos genera.

**Nivel de evidencia.** Moderado.

**Limitaciones.**
El marco de sarcopenia del EWGSOP2 se refiere a una **enfermedad muscular** definida por fuerza
baja y confirmada por cantidad o calidad muscular, evaluada con instrumentos que BREY no
recoge. Un descenso de masa muscular en una persona sana **no es** sarcopenia, y esta base no
autoriza a nombrarla así.

**Interpretaciones NO admisibles.**
- Denominar «sarcopenia» a un descenso de masa muscular observado por BIA.
- Diagnosticar pérdida de tejido sin descartar variación hídrica.
- Atribuir causa (dieta, entrenamiento, descanso) a partir del patrón.

**Referencias.** `ewgsop2_sarcopenia`, `barakat_recomposicion_2020`

---

### Aumento de peso sin aumento de masa grasa

```yaml
id: patron-aumento-peso-sin-grasa
tipo: patron
variables_bcs: [peso_kg, masa_grasa_kg, masa_muscular_kg, agua_total_l]
nivel_evidencia: moderado
referencias: [barakat_recomposicion_2020, proximidad_fallo_hipertrofia_2023]
estado: verificado
```

**Definición.**
Incremento del peso corporal sin incremento proporcional de la masa grasa.

**Fundamento fisiológico.**
Tres explicaciones compatibles con este patrón, no mutuamente excluyentes: ganancia de tejido
magro, aumento de agua corporal (glucógeno, hidratación, sodio) y error de estimación.

**Cambios esperables.**
Si el origen es tejido magro, el aumento suele acompañarse de masa libre de grasa y agua
intracelular. Si el origen es hídrico, el agua extracelular puede participar de forma
desproporcionada.

**Cambios inesperados.**
Un aumento de peso y de masa magra en pocos días excede lo fisiológicamente plausible para
síntesis de tejido y orienta a agua o a error.

**Relaciones conocidas.**
Ver módulo 10 para el conjunto de covariaciones.

**Factores de confusión.**
Carga de glucógeno tras reintroducir carbohidratos, retención por sodio, medición tras
entrenamiento.

**Nivel de evidencia.** Moderado.

**Limitaciones.**
La BIA no distingue con fiabilidad, en una sola medición, entre agua y tejido magro recién
ganado: ambos elevan la conductividad.

**Interpretaciones NO admisibles.**
- Afirmar ganancia muscular a partir de un único incremento de peso con masa magra.
- Descartar ganancia grasa por el solo hecho de que el porcentaje graso baje: el porcentaje es
  una **proporción** y puede descender por aumento del denominador.

**Referencias.** `barakat_recomposicion_2020`, `proximidad_fallo_hipertrofia_2023`

---

### Patrones compatibles con error de medición

```yaml
id: patron-error-de-medicion
tipo: patron
variables_bcs: []
nivel_evidencia: alto
referencias: [espen_bia_2, isak_estandares]
estado: verificado
```

**Definición.**
Combinaciones cuya explicación más probable es un fallo del procedimiento, no un cambio
corporal.

**Fundamento.**
Ciertos tejidos cambian con lentitud conocida. Una variación rápida en ellos es
biológicamente implausible y señala al procedimiento.

**Señales documentadas por implausibilidad biológica.**

| Observación | Por qué orienta a error |
|---|---|
| Masa ósea o mineral con variación apreciable entre mediciones próximas | Son tejidos de recambio lento |
| Talla cambiante en un adulto | La estatura adulta es estable; sugiere medida referida o mal tomada |
| Suma de compartimentos que no reconstruye el total | Inconsistencia interna del propio registro |
| Una masa absoluta que supera el peso corporal | Físicamente imposible |
| Cambio grande sin cambio de peso ni de condiciones | Compatible con contacto de electrodos o dispositivo distinto |

**Relaciones conocidas.**
Este patrón tiene prioridad de lectura sobre los anteriores: si el registro es inconsistente,
los demás patrones no son interpretables.

**Nivel de evidencia.** Alto para el principio de control de calidad; el detalle numérico de
cada umbral pertenece a los handbooks internos, **no a esta base**.

**Limitaciones.**
La distinción entre cambio real y error de medida no siempre es resoluble con el dato
disponible. ESPEN es explícita en que la BIA no distingue automáticamente entre una retención
real y un fallo de contacto.

**Interpretaciones NO admisibles.**
- Declarar «error del dispositivo» como conclusión. Lo admisible es señalar el registro para
  revisión humana.
- Descartar un dato por inverosímil sin verificarlo.

**Referencias.** `espen_bia_2`, `isak_estandares`
