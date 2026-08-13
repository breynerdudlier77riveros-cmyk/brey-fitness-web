---
modulo: 34
titulo: Ejercicio del modelo de conflictos, determinación de accesos y cierre de deudas
estado: v1.0
sprint: NKB-3.4
---

# 34 · Conflictos, accesos y deudas cerradas

---

## Parte I · El modelo de conflictos, por fin ejercitado

### La candidata que NKB-3.3 señaló

NKB-3.3 nombró `hgs_escolares_chile_8_12_lms` como la candidata prioritaria a
primer conflicto. **Se investigó primero, como exigía el orden de prioridad, y
quedó descartada como ejercicio posible.**

| Comprobación | Resultado |
|---|---|
| ¿Existe? | **Sí.** JSCR, 2 026 escolares chilenos de 8 a 12 años, centiles 10 a 90 por LMS |
| ¿Puede verificarse? | **No.** Unpaywall devuelve `is_oa: false`, `has_repository_copy: false`, `best_oa_location: null` |
| ¿Alcanza E-5? | **No.** Se detiene en E-1 |
| Naturaleza | **Deuda de acceso**, no de evidencia |

Sin sus valores no puede compararse identidad ni contrastarse un solo número.
Declararla en conflicto por parecido temático sería exactamente lo que `22`
prohíbe.

### La candidata que apareció en su lugar

La búsqueda de Prioridad 3 encontró algo mucho más próximo a un conflicto real:

> **`ramirez_velez_hgs_colombia_6_64_2021` y `martinez_torres_hgs_colombia_2022`
> son dos análisis secundarios independientes de la MISMA encuesta**: la
> Encuesta Nacional de la Situación Nutricional de Colombia de 2015.

Es la situación que `29` predijo con estas palabras: el conflicto ocurre «casi
solo entre reanálisis del mismo conjunto de datos».

| Coordenada | Martínez-Torres 2022 | Ramírez-Vélez 2021 | ¿Coincide? |
|---|---|---|---|
| **Variable** | Prensión manual absoluta | Prensión manual absoluta | **Sí** |
| **Población** | ENSIN 2015, Colombia | ENSIN 2015, Colombia | **Sí** |
| **Franja etaria** | 6–17,9 | 6–64 | **Solapan por completo en 6–17,9** |
| **Estrato** | Sexo × edad | Sexo × edad | **Sí** |
| **Tipo** | TN-1 percentiles | TN-1 percentiles | **Sí** |
| **Método de medición** | Takei TKK 5101 | «Dinamómetro de mango ajustable» | **No verificable** |
| **Definición operacional** | Media de ambas manos | No verificable | **No verificable** |
| **Método de estimación** | Regresión cuantílica | LMS de Cole | Distinto, **y no es coordenada** |
| **Percentiles** | P5 P10 P25 P50 P75 P90 P95 | P3 P10 P25 P50 P75 P90 P97 | Comparten cinco |

**Cuatro coordenadas coinciden y las dos que faltan no pueden comprobarse**,
porque el segundo artículo no tiene ninguna copia abierta.

### El veredicto, y por qué es un veredicto y no una evasiva

> **No se declara conflicto.** No porque se haya descartado, sino porque
> **declararlo exigiría afirmar que los métodos coinciden, y eso no se ha
> podido leer.**

Un conflicto normativo es una afirmación fuerte: dice que dos fuentes describen
*lo mismo* y no concuerdan. Afirmarlo con el método sin verificar sería inventar
la coincidencia que hace falta para sostenerlo — el mismo error, con el signo
cambiado, que inventar una equivalencia entre dinamómetros.

Lo que sí queda establecido, y no lo estaba:

1. **El primer conflicto real de la NKB tiene nombre, DOI y una sola condición
   pendiente**: leer la tabla de `ramirez_velez_hgs_colombia_6_64_2021`.
2. **Si al leerla el método coincide**, habrá conflicto —dos juegos de
   percentiles para el mismo estrato de la misma encuesta— y se conservarán
   ambos sin resolver, según `22`.
3. **Si no coincide**, serán normas distintas, y también se conservarán ambas.

En los dos desenlaces la base hace lo mismo: guardar las dos. Lo que cambia es
cómo se declara la relación, y eso no se decide a ciegas.

### Advertencia registrada por adelantado

El resumen de esa fuente declara un umbral definido como **2 desviaciones
típicas por debajo de la media máxima del ciclo vital**. Origen distributivo, no
de desenlace. Si algún día se admite:

- sus percentiles entran como **TN-1**;
- ese umbral **no** entra como TN-5;
- es la decisión idéntica a RN-02 (`28`), tomada antes de tener la fuente
  delante para que su utilidad no la condicione.

### Los otros pares examinados

Se buscó conflicto deliberadamente en todos los pares con algún parecido:

| Par | ¿Conflicto? | Coordenada que lo impide |
|---|---|---|
| Cúcuta ↔ `HGS-CO-TN1` | No | Instrumento (Camry ≠ Takei TKK 5101), definición operacional, marco muestral, estratificación. Solapan en 10–17 **sin ser comparables** |
| Universitarios ↔ `HGS-CO-TN1` | No | Instrumento (SMEDLY III analógico ≠ TKK 5101 digital) y población. Los rangos etarios **ni siquiera se solapan** |
| Universitarios ↔ Cúcuta | No | Instrumento, definición operacional (media de ambas manos ≠ por dominancia), población y estratificación |
| `HGS-CO-UNI-TN1` ↔ `HGS-CO-UNI-TN2` | No | Comparten **las cuatro coordenadas** y difieren en el **tipo**: una publica percentiles y la otra media con dispersión. No afirman lo mismo sobre lo mismo |
| Las 6 fichas brasileñas entre sí | No | Comparten fuente, población y método; difieren en el **estrato**, que sí es coordenada |
| Chile derecha ↔ Chile izquierda | No | Definición operacional |
| Cúcuta dominante ↔ no dominante | No | Definición operacional |

**El penúltimo par es nuevo y merece atención**: `HGS-CO-UNI-TN1` y
`HGS-CO-UNI-TN2` son las dos primeras normas de la base que comparten las cuatro
coordenadas de identidad. Y aun así no hay conflicto, porque el tipo de norma
determina *qué se afirma*. Una dice dónde cae el percentil 25; la otra, cuál es
la media. Ambas pueden ser ciertas a la vez.

> Es el complemento exacto del hallazgo de `29`: la identidad estricta evita
> falsos conflictos entre estudios distintos, y **el tipo de norma los evita
> dentro de una misma tabla**.

### Estado del modelo

**Sigue sin ejercitarse sobre datos, y por primera vez se sabe exactamente qué
falta para ejercitarlo.** La deuda estructural continúa abierta; deja de ser
indefinida.

---

## Parte II · Determinación sistemática de accesos

NKB-3.3 clasificaba fuentes como «deuda de acceso» a partir de intentos
manuales. Este sprint introduce una comprobación reproducible: **consultar el
estado de acceso abierto de cada DOI en Unpaywall**, que es un registro público
de localizaciones legales.

No es una fuente de evidencia y no aporta ningún valor normativo. Sirve para una
sola cosa: **distinguir «no lo encontré» de «no existe copia abierta»**.

| Fuente | DOI | Estado declarado | Consecuencia |
|---|---|---|---|
| `vivas_diaz_hgs_universitarios_2016` | 10.20960/nh.113 | **Abierta** | **Deuda cerrada** · admitida E-5 |
| `bustos_viviescas_hgs_cucuta_2019` | 10.29375/01237047.2791 | **Abierta** | **Deuda cerrada** · admitida E-5 |
| `ramirez_velez_hgs_fuprecol_2017` | 10.1519/JSC…1459 | Abierta, copia única en repositorio | Repositorio caído en todos los intentos · **sigue abierta** |
| `ramirez_velez_hgs_colombia_6_64_2021` | 10.1016/j.clnesp.2021.05.009 | **Cerrada, sin copia** | Deuda de acceso **confirmada** |
| `hgs_escolares_chile_8_12_lms` | 10.1519/JSC…2631 | **Cerrada, sin copia** | Deuda de acceso **confirmada** |

### Lo que esta comprobación corrigió

**`vivas_diaz_hgs_universitarios_2016` estuvo detenida en E-2 un sprint entero
por un error de método nuestro, no por un defecto suyo.** En NKB-3.3 se
localizó una copia escaneada e ilegible y se concluyó «deuda de acceso», lo cual
era cierto pero incompleto: nunca se comprobó si existía otra copia. Existía, y
la publicación siempre fue de acceso abierto.

La lección se congela como procedimiento:

> **Antes de declarar deuda de acceso, comprobar el estado de acceso abierto del
> DOI.** Una copia ilegible no demuestra que no haya otra legible.

### Lo que NO cambia

Que una fuente sea de acceso abierto **no la acerca ni un paso a ser
admisible**. `hgs_escolares_chile_8_12_lms` y `ramirez_velez_…_2021` no quedan
degradadas por ser cerradas, y las dos colombianas no quedan favorecidas por ser
abiertas. El acceso decide si podemos evaluarlas; los ocho criterios deciden si
entran.

---

## Parte III · RN-04 · Categorías importadas de otra población

Primer rechazo del sprint, y el más instructivo de toda la base.

`bustos_viviescas_hgs_cucuta_2019` publica, junto a sus percentiles, cuatro
tablas que convierten esos mismos percentiles en seis categorías nombradas:
*deficiente*, *mala*, *regular*, *bueno*, *muy bueno* y *excelente*.

| | |
|---|---|
| **Qué son** | Tablas 7 y 8, «Categorías de la fuerza de agarre», por sexo, década y mano |
| **Definición verificada** | Deficiente < P10 · Mala P10–P25 · Regular P25–P50 · Bueno P50–P75 · Muy bueno P75–P90 · Excelente > P90 |
| **Nivel alcanzado** | **E-4** |
| **Criterio fallido** | **CA-07**, para el tipo TN-7 |
| **Motivo** | Su definición es **puramente distributiva**: cada categoría es un tramo de percentil y nada más. TN-7 exige un criterio de definición propio, no un renombrado de la distribución (`15`) |

### El agravante, que es lo verdaderamente instructivo

Los seis cortes no los definió este estudio. La propia fuente los cita: proceden
de una **propuesta de valores normativos para la evaluación de la aptitud física
en niños de 6 a 12 años de Arequipa, Perú**.

De modo que unas categorías creadas para **niños peruanos de 6 a 12 años** se
aplican aquí a **personas de Cúcuta de 10 a 69 años**, incluidas todas las
décadas adultas.

**Tres saltos en una sola operación:**

| Salto | De | A |
|---|---|---|
| País | Perú | Colombia |
| Edad | 6–12 años | 10–69 años |
| Naturaleza | Aptitud física general | Fuerza de prensión |

Es simultáneamente la extrapolación de país que `31` prohíbe, la extrapolación
de edad que `19` prohíbe y la conversión de percentil en categoría que I-11
prohíbe.

### Qué se conserva y qué no

- **Los percentiles de las Tablas 5 y 6 entran**, y están en sus dos fichas.
- **Las categorías de las Tablas 7 y 8 no entran** en ninguna forma: ni como
  norma, ni como vocabulario, ni como nota de color.
- El hecho de que la fuente las publique **se registra**, porque quien lea el
  artículo las verá y debe saber por qué la NKB no las tiene.

> Que las publique una revista revisada por pares no las hace admisibles, igual
> que una columna titulada «risk threshold» no era un punto de corte (RN-02).
> **La etiqueta nunca es el criterio.**

---

## Parte IV · Deudas cerradas

| Deuda | Tipo | Estado |
|---|---|---|
| Universitarios colombianos ilegibles | Acceso | **Cerrada** · 48 normas |
| Cúcuta sin verificar | Búsqueda | **Cerrada** · 24 normas |
| Brasil · 5 estratos sin transcribir | Transcripción | **Cerrada** · 130 normas |
| Colombia adulta sin ninguna norma | Cobertura | **Cerrada parcialmente** · 18–29 y 20–69 cubiertos; 30–59 y 60+ solo por Cúcuta, con calidad Baja |
| Candidata a conflicto indefinida | Estructural | **Cerrada** · la candidata tiene nombre, DOI y una única condición pendiente |

### Deudas que siguen abiertas

| Deuda | Tipo | Qué haría falta |
|---|---|---|
| `ramirez_velez_hgs_colombia_6_64_2021` | **Acceso** | Acceso institucional a Clinical Nutrition ESPEN. Desbloquea el conflicto |
| `hgs_escolares_chile_8_12_lms` | **Acceso** | Acceso institucional a JSCR |
| `ramirez_velez_hgs_fuprecol_2017` | **Acceso** | Que el repositorio de la Universidad del Rosario vuelva a responder |
| Adultos mayores colombianos (SEMERGEN) | **Acceso** | Acceso institucional. Es la única franja colombiana sin norma propia |
| `hgs_adultos_chile_estandarizacion` | **Acceso** | SciELO Chile devolvió 403 en todos los intentos |
| Chile · Tabla 4, edad biológica | **Transcripción** | Verificada y accesible. Ver la nota siguiente |
| Perú, PURE, Chile con discapacidad intelectual | **Búsqueda** | Verificarlas |
| Reino Unido, Estados Unidos, adolescentes | **Búsqueda** | Heredadas, sin avance |
| Prioridad 3 internacional | **Búsqueda** | No abordada: las prioridades 1 a 3 siguen sin agotarse |
| **Científica** | — | **Ninguna.** Nada se ha declarado inexistente |

### Por qué NO se transcribió la Tabla 4 chilena

Es la única deuda de transcripción que quedaba abierta y accesible, y se decidió
no cerrarla en este sprint por un motivo que conviene dejar escrito:

> Su estrato es la **edad biológica**, expresada como años respecto al pico de
> velocidad de crecimiento. Ese estrato **no se observa: se estima** con las
> ecuaciones de Mirwald a partir de talla, talla sentado, longitud de pierna y
> edad decimal.

Una norma cuyo estrato hay que calcular plantea una pregunta que la NKB no ha
resuelto: **¿quién puede asignar a una persona a ese estrato, y con qué
autoridad?** Almacenarla sin responderla invitaría a que el consumidor aplicara
las ecuaciones por su cuenta, que es justo el tipo de derivación silenciosa que
`21` existe para impedir.

Se registra como **deuda estructural**, no de transcripción: falta doctrina, no
trabajo.

---

## Parte V · Primer uso de ES-2

La transcripción de la tabla brasileña S2 encontró un defecto en la fuente:

> Para el estrato de varones de 1,60 a 1,70 m, el **P50 se congela en 28,06 kgf
> desde los 86 años** mientras todas las demás columnas siguen descendiendo. En
> las edades 86 a 90 el P50 publicado **supera al P75 de su propia fila**.

Cinco normas afectadas. La decisión:

| Opción | Descartada porque |
|---|---|
| Corregir el valor | Fabricaría un dato que nadie publicó (`21`) |
| Interpolar entre vecinos | Ídem |
| Omitir las cinco normas | Ocultaría un defecto de la fuente y dejaría un hueco sin explicación |
| Retirar la ficha entera | Las otras 21 normas del estrato no tienen ningún problema |
| **Transcribir y marcar ES-2** | ✅ |

**ES-2 · Cuestionada** existe desde NKB-2.0 y nunca se había usado. Su
definición encaja sin forzar nada: «hay una objeción registrada y sin resolver»,
y «puede aplicarse, con advertencia».

Solo la fuente puede resolverlo. Mientras no publique una corrección, la
objeción sigue abierta y las cinco normas se aplican **con la advertencia
delante o no se aplican**.

> Cierra una deuda estructural que ni siquiera estaba en la lista: **tres de los
> cinco estados normativos seguían sin usarse.** Ahora son dos.
