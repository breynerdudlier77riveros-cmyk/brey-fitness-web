---
modulo: 08
titulo: Indicadores antropométricos
tipo: indicador
estado: verificado
nivel_evidencia_modulo: alto
---

# 08 · Indicadores antropométricos

Índices derivados de medidas externas del cuerpo. A diferencia de las variables de
bioimpedancia, no dependen de un dispositivo propietario: dependen del **procedimiento**.

---

### IMC — Índice de masa corporal

```yaml
id: imc
tipo: indicador
variables_bcs: [imc, peso_kg, altura_cm]
nivel_evidencia: alto
referencias: [who_waist_2008]
estado: verificado
```

**Definición.**
Peso dividido por la talla al cuadrado (kg/m²).

**Fundamento.**
Índice poblacional de corpulencia. Fue diseñado para describir poblaciones, no para
caracterizar individuos.

**Relaciones conocidas.**
Con peso, de forma directa; con talla, de forma inversa y cuadrática.

**Limitaciones.**
No distingue de qué tejido procede el peso. Una persona con masa muscular elevada puede
presentar un IMC alto sin exceso de tejido graso. Esta limitación es especialmente relevante en
la población de BREY.

**Interpretaciones NO admisibles.**
- Interpretar el IMC como medida de adiposidad individual.
- Aplicar categorías poblacionales a una persona entrenada sin advertir su limitación.
- Usarlo aislado cuando se dispone de porcentaje graso.

**Referencias.** `who_waist_2008`

---

### Perímetro de cintura y cociente cintura-cadera

```yaml
id: whr-perimetros
tipo: indicador
variables_bcs: [circ_cintura_cm, circ_cadera_cm, whr]
nivel_evidencia: alto
referencias: [who_waist_2008, isak_estandares]
estado: verificado
```

**Definición.**
Perímetro abdominal, perímetro glúteo, y su cociente (WHR) como aproximación a la distribución
de la grasa corporal.

**Fundamento fisiológico.**
La distribución de la grasa —central frente a periférica— aporta información distinta de la
cantidad total. La OMS convocó una consulta de expertos específicamente para revisar la
evidencia sobre estos índices como predictores de enfermedad cardiovascular, diabetes y
mortalidad.

**Cambios esperables.**
Varían con cambios de masa grasa, con la postura y con el estado del tracto digestivo.

**Relaciones conocidas.**
Con masa grasa total, aunque de forma imperfecta: dos personas con igual porcentaje graso pueden
tener distribuciones muy distintas.

**Factores de confusión.**
El punto anatómico de medición, la fase respiratoria, la tensión de la cinta y el operador. La
variabilidad entre medidores es la fuente de error dominante — de ahí la existencia del estándar
ISAK y de su esquema de acreditación.

**Nivel de evidencia.** Alto. Consenso de sociedad científica internacional.

**Limitaciones.**
El propio informe de la OMS distingue entre usos **clínicos y diagnósticos** y usos de **cribado
y vigilancia poblacional**, y señala que los puntos de corte se emplean en grados variables
según el propósito. Además, la validez de los puntos de corte varía por sexo, edad y etnia.

**Interpretaciones NO admisibles.**
- Trasladar un punto de corte poblacional a una evaluación individual sin su contexto.
- Comparar mediciones tomadas por operadores distintos sin control del error técnico.
- Presentar el WHR como evaluación de riesgo certificada.

**Referencias.** `who_waist_2008`, `isak_estandares`

---

### Índices normalizados por talla

```yaml
id: indices-normalizados-talla
tipo: indicador
variables_bcs: [smi]
nivel_evidencia: moderado
referencias: [ewgsop2_sarcopenia]
estado: verificado
```

**Definición.**
Familia de índices que dividen una masa por la talla al cuadrado para permitir comparación entre
personas de distinto tamaño. El SMI (índice de masa muscular esquelética) es el caso relevante
para BREY.

**Fundamento.**
Una masa absoluta no es comparable entre personas de estatura distinta; normalizar por talla
busca corregirlo.

**Limitaciones.**
Existen fórmulas alternativas en la literatura sin consenso único sobre cuál emplear, y los
puntos de corte dependen de la población de referencia y del método de medición con el que se
derivaron.

**Interpretaciones NO admisibles.**
- Usar el SMI como criterio diagnóstico aislado (ver módulo 03).
- Comparar SMI obtenidos con métodos distintos (BIA frente a DXA) como si fueran equivalentes.

**Referencias.** `ewgsop2_sarcopenia`
