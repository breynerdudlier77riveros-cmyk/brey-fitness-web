---
modulo: 11
titulo: Contradicciones y vacíos
estado: v1.0
---

# 11 · Contradicciones y vacíos

Dónde la literatura se contradice, y dónde sencillamente no hay nada. Registrarlo es parte del
trabajo: un vacío no declarado se convierte en una invención al sprint siguiente.

---

## Contradicciones encontradas

### C-01 · FMS: uso extendido frente a evidencia en contra

**La contradicción.** El FMS es una de las herramientas de cribado más difundidas del sector, con
certificación comercial y punto de corte establecido (14). Tres revisiones sistemáticas
independientes coinciden en que **no respalda la predicción de lesiones**
[`moran_fms_2017`, `moore_fms_2019`, `bunn_fms_2019`].

**Resolución.** No hay contradicción científica: la hay entre la práctica del sector y la
evidencia. La PKB sigue la evidencia. Correspondencia M-16: **no recomendada**.

### C-02 · Y-Balance: fiabilidad alta, predicción baja

**La contradicción aparente.** La misma fuente documenta fiabilidad intraevaluador alta
(0,85-0,91) y validez predictiva de lesión limitada (1-3 de cada 10-13 estudios)
[`plisky_ybt_2021`].

**Resolución.** No se contradice: son propiedades distintas. Repetirse bien no implica predecir.
Es el ejemplo más limpio de la confusión fiabilidad/validez de toda la base.

### C-03 · Sit-and-reach: válido y no válido a la vez

**La contradicción aparente.** La misma fuente le atribuye validez moderada y validez baja según
qué se pretenda medir: extensibilidad isquiosural o lumbar [`mayorga_sit_reach_2014`].

**Resolución.** Depende del constructo. Autorizada para B-02 con alcance restringido (M-05);
**no recomendada** para movilidad lumbar (M-13).

### C-04 · Agarre: asociación robusta, ninguna convincente

**La contradicción aparente.** La revisión paraguas documenta asociaciones con mortalidad y
discapacidad en millones de personas, y a la vez declara que **ningún desenlace alcanza evidencia
convincente** [`soysal_hgs_2021`].

**Resolución.** Es una advertencia de la propia fuente, no una contradicción: son estudios
observacionales y el mecanismo no está establecido. Autoriza a describir la asociación
poblacional; **no** a pronosticar sobre un individuo.

### C-05 · Agilidad: el término del sector frente al término científico

**La contradicción.** El sector llama «tests de agilidad» a pruebas preplanificadas. La definición
científica exige respuesta a un estímulo [`sheppard_agility_2006`].

**Resolución.** La PKB adopta la definición de la fuente. Correspondencia M-15: **no
recomendada**. Es una contradicción de **vocabulario**, y por eso está también en el glosario.

---

## Vacíos científicos

Áreas donde no se localizó evidencia admisible. **No afirman que la evidencia no exista**: afirman
que no se verificó en este sprint.

### V-01 · Sensibilidad al cambio — el vacío más grave

Ninguna fuente aporta MDC o SEM utilizable. **Sin esto no puede afirmarse que un atleta haya
cambiado**, y es exactamente lo que el Sprint PAS-4 necesita. Ver `06`.

### V-02 · Vigencia de un resultado

Ninguna fuente documenta cuánto tiempo un resultado sigue representando al atleta. El PAS exige
declarar vigencia por prueba (EL-02) y la PKB **no puede aportar ni un solo valor**.

### V-03 · Validez de constructo

Transversal a las once pruebas. La literatura verificada está concentrada en fiabilidad. Es la
razón de que ninguna correspondencia alcance nivel alto.

### V-04 · Pesos relativos

Cuánto informa cada prueba de su capacidad frente a otras. Sin esto, el campo `peso` del catálogo
queda indeterminado.

### V-05 · Doce capacidades sin prueba autorizada

A-02, A-03, B-01, B-03, B-04, C-02, C-03, D-01, D-02, D-03, E-01, E-02. Incluye potencia,
velocidad, agilidad, coordinación y control motor.

### V-06 · Poblaciones descubiertas

Niños y adolescentes casi por completo; adultos mayores salvo agarre y 1RM; poblaciones clínicas y
de rehabilitación en su totalidad.

### V-07 · Capacidades reservadas

F-01 y F-02 no se documentaron por decisión de alcance (PAS-ADR-10). No es un vacío de la
literatura sino de esta base, y es deliberado.

---

## Deudas reales de este sprint

Distinguidas de los vacíos: aquí el problema es el trabajo hecho, no la literatura.

| Deuda | Qué falta | Gravedad |
|---|---|---|
| **D-01** | Esprint lineal (P-11): ninguna fuente verificada | Alta — deja D-01 Velocidad sin evaluar por omisión propia |
| **D-02** | CMJ: fiabilidad ampliamente documentada, sin revisión única verificada | Media — la prueba más usada sin clave de referencia |
| **D-03** | Fiabilidad no verificada en 6 de 11 pruebas | Media |
| **D-04** | Sin revisión dedicada a fiabilidad interevaluador del FMS | Baja — la correspondencia se rechaza igualmente |
| **D-05** | Cuatro referencias con autoría incompleta | Baja — declarada en cada entrada |

**D-01 y D-02 son deudas de búsqueda, no de evidencia.** La diferencia es esencial: no se ha
demostrado que esa evidencia no exista, no se ha buscado lo suficiente. Confundir ambas cosas
convertiría un límite de este sprint en una afirmación científica falsa.

---

## Riesgos

| Riesgo | Descripción | Mitigación |
|---|---|---|
| **R-01** | Que la matriz casi vacía se lea como fallo del trabajo y se rellene por presión de producto | El README lo declara en su primera sección |
| **R-02** | Que alguien traslade una correspondencia «insuficiente» al catálogo | El PAE valida la referencia y emite conflicto |
| **R-03** | Que las deudas D-01 y D-02 se lean como «no hay evidencia» | Declarado aquí y en cada ficha afectada |
| **R-04** | Que el Sprint PAS-4 afirme cambio sin MDC | Registrado en `06` y en `08`, grupo 5 |
| **R-05** | Que entre material comercial al actualizar la base | Regla de fuentes en `10`; el FMS es el caso de prueba |
| **R-06** | Que se apliquen correspondencias fuera de su población | Cada fila de la matriz declara su población |
