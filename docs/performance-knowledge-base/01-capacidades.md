---
modulo: 01
titulo: Capacidades y evidencia disponible
estado: v1.0
---

# 01 · Capacidades y evidencia disponible

Las 20 capacidades congeladas en `docs/performance-system/03-capacidades.md`. Este módulo NO las
redefine: documenta **qué evidencia existe** para cada una y, sobre todo, **cuál falta**.

Leyenda de estado:

| Estado | Significado |
|---|---|
| **Parcial** | Al menos una prueba con correspondencia parcialmente respaldada |
| **Sin prueba autorizada** | Ninguna prueba supera el umbral de admisión en v1.0 |
| **Reservada** | Capacidad congelada hasta el Sprint PAS-5 |

---

## Dominio A · Producción de fuerza

### A-01 · Fuerza máxima — **Parcial**

**Alcance.** Producir tensión máxima con independencia del tiempo.

**Evidencia que existe.** Fiabilidad test-retest del 1RM buena a excelente (ICC mediana 0,97;
CV mediana 4,2%) con independencia de experiencia, ejercicio, sexo y edad
[`grgic_1rm_2020`]. Lo mismo para el IMTP (ICC mediana 0,96) [`grgic_imtp_2022`].

**Evidencia que falta.** Que un 1RM en un ejercicio represente la fuerza máxima **general**. La
literatura verificada documenta reproducibilidad, no generalización entre patrones ni entre
regiones corporales.

**Pruebas que podrían aportar evidencia.** 1RM, IMTP, dinamometría isométrica.

**Pruebas que NO deben utilizarse.** Sit-and-reach, FMS, Y-Balance Test, cualquier prueba de
salto: ninguna mide producción de tensión máxima.

**Interpretaciones prohibidas.** Que más fuerza implique mejor rendimiento deportivo; que un 1RM
alto en un patrón prediga otro; que la fuerza máxima informe de riesgo de lesión.

### A-02 · Fuerza resistencia — **Sin prueba autorizada**

**Evidencia que falta.** No se localizó ninguna revisión sistemática o metaanálisis que valide una
prueba de campo concreta como medida de fuerza resistencia con población nombrada. **Evidencia
insuficiente en v1.0.**

**Nota.** Las pruebas de repeticiones máximas se usan ampliamente; el hueco es de *validación
publicada*, no de práctica.

### A-03 · Potencia — **Sin prueba autorizada**

**Evidencia que existe.** Fiabilidad del CMJ documentada de forma consistente y abundante.

**Evidencia que falta, y es la que decide.** Que la altura del salto sea una medida de *potencia*
y no de otra cosa. La altura es un desplazamiento; la potencia es trabajo por unidad de tiempo. La
equivalencia se da por supuesta con mucha más frecuencia de la que se demuestra. **Validez de
constructo: insuficiente**, y por eso la correspondencia CMJ→A-03 no se autoriza pese a ser la más
usada del sector.

Es el ejemplo más claro de la asimetría descrita en `00-introduccion.md`: se sabe con precisión
que el CMJ se repite bien, y bastante peor qué significa.

**Interpretaciones prohibidas.** Que un salto mayor signifique menor riesgo de lesión; que la
potencia de tren inferior represente la potencia general.

### A-04 · Fuerza reactiva — **Parcial**

**Evidencia que existe.** El Reactive Strength Index se asocia con medidas de rendimiento físico
y deportivo [`rsi_metaanalisis_2021`].

**Advertencia de la propia fuente.** El RSI debe informarse **junto a sus componentes** —altura
de salto y tiempo de contacto—: el índice aislado no permite saber cuál de los dos cambió. Un RSI
estable puede esconder dos cambios que se compensan.

**Evidencia que falta.** Puntos de corte, valores normativos por población.

### A-05 · Fuerza de agarre — **Parcial**

**Evidencia que existe.** La más sólida del catálogo en volumen. Asociación con mortalidad por
cualquier causa, mortalidad cardiovascular e incidencia de discapacidad, con evidencia Clase II
(altamente sugestiva) [`soysal_hgs_2021`]. Marcador de estado general en adultos mayores
[`bohannon_grip_2019`]. Valores normativos internacionales disponibles
[`hgs_normas_internacionales`].

**Evidencia que falta.** Que la fuerza de agarre represente la fuerza de otras regiones. Se usa
como *proxy* de fuerza global con mucha ligereza; ninguna fuente verificada aquí lo autoriza.

**Advertencia crítica.** Ningún desenlace de la revisión paraguas alcanzó evidencia
«convincente», y todas las asociaciones son **observacionales**. Correlación con mortalidad no es
causalidad, y una prueba de agarre no informa de la salud de un individuo concreto.

---

## Dominio B · Rango y control articular

### B-01 · Movilidad — **Sin prueba autorizada**

**Evidencia que falta.** El sit-and-reach mide extensibilidad **pasiva** y no rango activo. No se
localizó validación de una prueba de campo de movilidad activa. **Evidencia insuficiente.**

**Pruebas que NO deben utilizarse.** Sit-and-reach: mide otra cosa (ver B-02).

### B-02 · Flexibilidad — **Parcial**

**Evidencia que existe.** Validez de criterio **moderada** del sit-and-reach para extensibilidad
isquiosural (r ≈ 0,46-0,67) [`mayorga_sit_reach_2014`].

**Evidencia en contra.** Validez **baja** para extensibilidad lumbar en la misma fuente. La prueba
confunde recorrido isquiosural con movilidad de la columna lumbar.

**Interpretación prohibida.** Leer el sit-and-reach como medida de flexibilidad lumbar o de
«flexibilidad general». Es el caso mejor documentado de correspondencia rechazada de toda la PKB.

**Alcance real.** Extensibilidad isquiosural, con r ≈ 0,5: aproximadamente una cuarta parte de la
varianza explicada. Una estimación gruesa, no una medida.

### B-03 · Estabilidad — **Sin prueba autorizada**

**Evidencia insuficiente.** El Y-Balance Test se propone a menudo como prueba de estabilidad, pero
lo que la evidencia verificada documenta es **control postural dinámico** (ver D-04), que no es lo
mismo que mantener una posición articular bajo demanda externa.

### B-04 · Control motor — **Sin prueba autorizada**

**Evidencia insuficiente.** El FMS se propone como cribado de calidad de movimiento; su validez
para ello no está establecida y su uso predictivo está desaconsejado
[`moran_fms_2017`]. Ver `08-interpretaciones-prohibidas.md`.

---

## Dominio C · Metabólico

### C-01 · Resistencia aeróbica — **Parcial**

**Evidencia que existe.** Validez de criterio del 20-m shuttle run para **estimar** VO2máx
[`mayorga_20msr_2015`]. Procedimientos normativos en [`acsm_guidelines_11`].

**Advertencia.** El resultado es una **estimación**, no una medición: depende del protocolo y de
la ecuación de predicción empleada. Dos ecuaciones distintas sobre el mismo resultado producen
VO2máx distintos.

**Evidencia que falta.** Cuál ecuación usar según población. La fuente lo declara dependiente de
edad, nivel de aptitud e historial.

### C-02 · Resistencia anaeróbica — **Sin prueba autorizada**

**Evidencia insuficiente en v1.0.** No se verificó ninguna revisión que valide una prueba de campo
concreta para esta capacidad tal como el PAS la define.

### C-03 · Capacidad de recuperación intra-sesión — **Sin prueba autorizada**

**Evidencia insuficiente.** Capacidad definida en el PAS sin prueba de campo validada localizada.

---

## Dominio D · Neuromuscular y coordinativo

### D-01 · Velocidad — **Sin prueba autorizada**

**Evidencia insuficiente en v1.0.** Los tests de esprint son de uso universal; no se verificó aquí
una revisión sistemática que documente sus propiedades métricas. Es una **deuda de búsqueda**, no
una afirmación de que la evidencia no exista (`12-roadmap.md`).

### D-02 · Agilidad — **Sin prueba autorizada, por definición**

**Hallazgo clave.** La agilidad es un movimiento rápido de todo el cuerpo con cambio de velocidad
o dirección **en respuesta a un estímulo** [`sheppard_agility_2006`]. Los tests de cambio de
dirección al uso son **preplanificados**: el atleta sabe de antemano el recorrido.

**Consecuencia.** Un test de cambio de dirección **no mide agilidad**: mide velocidad de cambio de
dirección. Son constructos distintos y la fuente los separa explícitamente.

**Interpretación prohibida.** Presentar un T-test, un 5-0-5 o un Illinois como medida de agilidad.

### D-03 · Coordinación — **Sin prueba autorizada**

**Evidencia insuficiente.**

### D-04 · Equilibrio — **Parcial**

**Evidencia que existe.** Fiabilidad intraevaluador del Y-Balance Test Lower Quarter alta
(0,85-0,91) [`plisky_ybt_2021`]; fiabilidad de moderada a alta del SEBT y el YBT-LQ en adultos
sanos [`sebt_ybt_fiabilidad_2019`].

**Evidencia en contra.** Validez predictiva de lesión **limitada**: 3 de 13 estudios para
asimetría anterior, 3 de 10 para posteromedial/posterolateral, 1 de 13 para el compuesto
[`plisky_ybt_2021`]. La fuente desaconseja los puntos de corte generales.

**Alcance real.** Control postural dinámico. Nada más.

---

## Dominio E · Técnico

### E-01 · Competencia técnica — **Sin prueba autorizada**

**Evidencia insuficiente.** Se evalúa siempre respecto a un patrón nombrado del Master Exercise
Dataset. No se localizó validación de un instrumento genérico de competencia técnica.

**Pruebas que NO deben utilizarse.** El FMS como medida de competencia técnica de un patrón
concreto: sus siete movimientos no son los patrones del dataset y su validez para ello no está
establecida.

### E-02 · Repertorio de habilidad — **Sin prueba autorizada**

**Evidencia insuficiente.** Es un inventario, no una medida. Su registro es factual —qué patrones
ejecuta el atleta con competencia— y depende de E-01.

---

## Dominio F · Tolerancia y disponibilidad

### F-01 · Tolerancia a la carga — **Reservada**
### F-02 · Disponibilidad funcional — **Reservada**

Congeladas hasta el Sprint PAS-5 por decisión del Sprint 1 (PAS-ADR-10). La PKB **no adelanta
trabajo sobre ellas**: documentarlas ahora crearía la tentación de activarlas antes de tiempo.

Ambas rozan territorio clínico. F-02 registra que un patrón no puede ejecutarse, **nunca por qué**,
y ninguna admite categorías de riesgo.

---

## Recuento

| Estado | Total | Capacidades |
|---|---|---|
| Parcial | **6** | A-01, A-04, A-05, B-02, C-01, D-04 |
| Sin prueba autorizada | **12** | A-02, A-03, B-01, B-03, B-04, C-02, C-03, D-01, D-02, D-03, E-01, E-02 |
| Reservada | **2** | F-01, F-02 |

**Seis de dieciocho capacidades activas** tienen alguna prueba parcialmente respaldada. Doce no
tienen ninguna. Ese es el estado real de la evidencia en v1.0, y no mejora escribiéndolo de otra
manera.

Conviene fijarse en cuáles son las doce: incluyen potencia, velocidad, agilidad, coordinación y
control motor — el corazón de lo que cualquier producto de evaluación física dice medir.
