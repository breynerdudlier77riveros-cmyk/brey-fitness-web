---
modulo: 03
titulo: Masa muscular
tipo: variable
estado: verificado
nivel_evidencia_modulo: moderado
---

# 03 · Masa muscular

Responde a la primera pregunta que originó esta base: *¿por qué aumenta el músculo?*

---

### Hipertrofia muscular

```yaml
id: hipertrofia-muscular
tipo: fenomeno
variables_bcs: [masa_muscular_kg, masa_libre_grasa_kg, smi]
nivel_evidencia: moderado
referencias: [proximidad_fallo_hipertrofia_2023, barakat_recomposicion_2020]
estado: verificado
```

**Definición.**
Aumento del tamaño del tejido muscular esquelético por incremento del contenido proteico
contráctil de sus fibras.

**Fundamento fisiológico.**
El modelo convencional atribuye la hipertrofia a tres factores: **tensión mecánica**, estrés
metabólico y daño muscular. La tensión mecánica, generada por la producción de fuerza y el
estiramiento bajo carga, inicia vías de mecanotransducción que estimulan la síntesis proteica
muscular. De los tres, es el factor con respaldo más consistente como determinante principal.

El crecimiento neto ocurre cuando la síntesis proteica supera de forma sostenida a la
degradación, lo que requiere tanto el estímulo mecánico como disponibilidad de sustrato
(ingesta proteica y energética).

**Cambios esperables.**
Incremento lento y progresivo. La evidencia localizada señala como determinantes clave la
**proximidad al fallo** del esfuerzo y un **volumen de series suficiente** por grupo muscular.
Cargas moderadas y altas producen hipertrofia comparable cuando el volumen se iguala, lo que
indica que la tensión mecánica y el reclutamiento pueden alcanzarse en un rango de
intensidades.

**Cambios inesperados.**
Un incremento apreciable de masa muscular entre mediciones separadas por pocos días excede lo
plausible para síntesis de tejido y orienta a variación hídrica o a error de estimación
(módulos 05 y 09).

**Relaciones conocidas.**
- Con **masa libre de grasa**: relación de composición — el músculo forma parte de ella.
- Con **agua intracelular**: relación estructural — el músculo es tejido con alto contenido
  hídrico. No es que el músculo «genere» agua.
- Con **metabolismo basal**: el tejido magro es metabólicamente activo (módulo 07).

**Factores de confusión.**
Hidratación y glucógeno son los dominantes a corto plazo: ambos elevan la conductividad y la
BIA los computa parcialmente dentro de compartimentos magros.

**Nivel de evidencia.** Moderado. Los mecanismos generales cuentan con revisiones sistemáticas
y metaanálisis; el peso relativo de estrés metabólico y daño muscular frente a tensión mecánica
sigue en discusión.

**Limitaciones.**
La velocidad y magnitud esperables dependen del historial de entrenamiento, la edad y el punto
de partida. La evidencia poblacional no permite anticipar una cifra para un individuo.

**Interpretaciones NO admisibles.**
- Atribuir un aumento de masa muscular a una intervención concreta a partir del dato de
  composición: el dato no contiene la causa.
- Proyectar ganancia futura a partir de dos mediciones.
- Presentar la ganancia muscular como «buena»: depende de un objetivo que el dato no incluye.
- Interpretar un aumento en días como tejido nuevo.

**Referencias.** `proximidad_fallo_hipertrofia_2023`, `barakat_recomposicion_2020`

---

### Masa libre de grasa

```yaml
id: masa-libre-de-grasa
tipo: variable
variables_bcs: [masa_libre_grasa_kg]
nivel_evidencia: alto
referencias: [espen_bia_1]
estado: verificado
```

**Definición.**
Todo el peso corporal que no es tejido graso: músculo, hueso, órganos, agua y otros tejidos.

**Fundamento fisiológico.**
Es una categoría **compositiva**, no un tejido. Su valor agrupa componentes de comportamiento
muy distinto: el agua varía en horas, el músculo en semanas, el hueso en años.

**Cambios esperables.**
Se mueve con el músculo y con el agua corporal.

**Relaciones conocidas.**
Contiene al músculo. En BIA suele derivarse del peso y la masa grasa, de modo que hereda el
error de ambos.

**Nivel de evidencia.** Alto en cuanto a definición; la estimación depende de la ecuación.

**Limitaciones.**
Su heterogeneidad es su principal límite: un cambio en masa libre de grasa no identifica qué
componente cambió. Por eso resulta menos informativa que la masa muscular cuando ambas están
disponibles.

**Interpretaciones NO admisibles.**
- Leer masa libre de grasa como sinónimo de músculo.
- Atribuir su variación a tejido contráctil sin considerar el agua.

**Referencias.** `espen_bia_1`

---

### Sarcopenia — delimitación

```yaml
id: sarcopenia-delimitacion
tipo: fenomeno
variables_bcs: [masa_muscular_kg, smi]
nivel_evidencia: alto
referencias: [ewgsop2_sarcopenia]
estado: verificado
```

**Definición.**
Enfermedad muscular caracterizada por cambios adversos del músculo acumulados a lo largo de la
vida. El consenso europeo vigente sitúa la **fuerza muscular baja** como característica
principal, usa la cantidad o calidad muscular baja para **confirmar** el diagnóstico, y el
rendimiento físico pobre como indicador de **gravedad**.

**Por qué está en esta base.**
Precisamente para delimitarla. Es el término que con más facilidad se aplicaría de forma
incorrecta a un descenso de masa muscular observado por BIA.

**Interpretaciones NO admisibles.**
- Llamar sarcopenia a un descenso de masa muscular medido por bioimpedancia. **La fuerza es la
  característica principal del diagnóstico, y BREY no la mide.**
- Usar el índice de masa muscular esquelética (SMI) como criterio diagnóstico aislado.
- Aplicar el marco a población joven sana, para la que no se diseñó.

**Referencias.** `ewgsop2_sarcopenia`
