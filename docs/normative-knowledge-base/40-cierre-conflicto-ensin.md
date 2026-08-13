---
modulo: 40
titulo: Cierre del conflicto ENSIN-2015
estado: v1.0
sprint: NKB-3.5
---

# 40 · Cierre del conflicto ENSIN-2015

## Resultado

> **CONFLICTO REAL, VERIFICADO Y NO RESUELTO.**
>
> Se corresponde con el resultado **A** del sprint: los métodos coinciden y las
> cuatro coordenadas de identidad coinciden. La discrepancia entre los valores
> está **cuantificada**, y llega a **4,5 kg (24%)** en el P50 de los varones de
> 12 años.

Ninguna de las dos normas gana. No se promedia, no se prefiere la más reciente,
no se prefiere la muestra mayor, no se prefiere ningún método estadístico.

---

## La condición pendiente y cómo se resolvió

NKB-3.4 dejó una única condición: **comprobar si el método de medición coincide
realmente**. No podía comprobarse porque `ramirez_velez_hgs_colombia_6_64_2021`
no tiene copia abierta.

Se resolvió sin leer esa fuente, y sin inferir nada, porque **la fuente admitida
lo declara ella misma**:

> «A report in Colombia [33] **with the same data as that of the present
> analysis** estimated the normative values with the LMS method and reported
> that among males, the values between 7 and 14 years of age in the P50 were
> higher but that after 15 years of age, the P50 estimated by quantile
> regression was higher. Among females, it was observed that with the LMS method
> up to 11 years of age, the P50 was higher, but beginning at 12 years, the
> differences in the P50 were minimal.»
>
> — `martinez_torres_hgs_colombia_2022`, sección de discusión

La referencia 33 de esa fuente es, literalmente:

> Ramírez-Vélez R., Rincón-Pabón D., Correa-Bautista J.E., García-Hermoso A.,
> Izquierdo M. *Handgrip strength: normative reference values in males and
> females aged 6-64 Years old in a Colombian population.* Clin Nutr ESPEN.
> 2021;44:379–386. doi: 10.1016/j.clnesp.2021.05.009

Es exactamente la fuente registrada como
`ramirez_velez_hgs_colombia_6_64_2021`.

### Por qué esto cierra la condición

**«Los mismos datos» significa las mismas mediciones.** Ambos son análisis
secundarios de la ENSIN-2015: la encuesta midió una vez, con un dinamómetro y
un protocolo, y los dos equipos analizaron ese único conjunto de mediciones.

No hace falta leer el segundo artículo para saber su método de medición: **es el
mismo por construcción**, y lo afirma el primero, que sí hemos leído.

> Esto **no** es una inferencia. Es una afirmación explícita de una fuente
> primaria verificada sobre su propia procedencia de datos. Inferir habría sido
> suponer que dos estudios colombianos usan el mismo dinamómetro porque son
> colombianos.

---

## Verificación de identidad

| Coordenada | `martinez_torres_…_2022` | `ramirez_velez_…_2021` | ¿Coincide? |
|---|---|---|---|
| **Variable** | Prensión manual absoluta | Prensión manual absoluta | **Sí** |
| **Método de medición** | ENSIN-2015 · Takei TKK 5101 | **Los mismos datos** | **Sí** |
| **Población** | ENSIN-2015, civil no institucionalizada | ENSIN-2015 | **Sí** |
| **Estrato** | Sexo × edad de un año | Sexo × edad | **Sí** |
| Tipo de norma | TN-1 percentiles | TN-1 percentiles | Sí |
| n varones 6–17 | 1 575 | **1 575** | **Sí** |
| n mujeres 6–17 | 1 072 | **1 072** | **Sí** |
| Método de **estimación** | Regresión cuantílica | LMS de Cole | **No, y no es coordenada** |

**Las cuatro coordenadas de identidad coinciden.** Los tamaños muestrales por
sexo coinciden exactamente, lo que confirma que la submuestra analizada es la
misma.

Lo único que difiere es **cómo se estimaron los percentiles a partir de esas
mismas mediciones**. Y `18` no incluye el método de estimación entre las
coordenadas de identidad: el método es el **procedimiento de medición**.

> **Este es el hallazgo estructural del sprint.** Dos normas pueden compartir
> las cuatro coordenadas, describir a las mismas 2 647 personas medidas con el
> mismo aparato, y publicar valores que difieren en un 24%. La identidad
> normativa no captura el estimador, y por eso el conflicto es posible.

---

## La discrepancia, cuantificada

La propia `martinez_torres_hgs_colombia_2022` publica en su Tabla 3 los P50 de
ambos análisis, lo que permite medir la diferencia sin leer la otra fuente.

### Varones · P50 en kg

| Edad | Regresión cuantílica *(admitida)* | LMS *(no admitida)* | Diferencia |
|---|---|---|---|
| 6 | 8,7 | 8,4 | −0,3 |
| 7 | 9,9 | 10,7 | **+0,8** |
| 8 | 11,3 | 13,1 | **+1,8** |
| 9 | 14,0 | 15,5 | **+1,5** |
| 10 | 14,3 | 18,0 | **+3,7** |
| 11 | 16,1 | 20,5 | **+4,4** |
| 12 | 18,5 | 23,0 | **+4,5** |
| 13 | 23,2 | 25,6 | **+2,4** |
| 14 | 26,5 | 28,1 | **+1,6** |
| 15 | 30,7 | 30,4 | −0,3 |
| 16 | 34,2 | 32,6 | −1,6 |
| 17 | 35,7 | 34,5 | −1,2 |

### Mujeres · P50 en kg

| Edad | Regresión cuantílica *(admitida)* | LMS *(no admitida)* | Diferencia |
|---|---|---|---|
| 6 | 7,8 | 8,9 | **+1,1** |
| 7 | 8,3 | 10,5 | **+2,2** |
| 8 | 9,9 | 12,1 | **+2,2** |
| 9 | 11,5 | 13,7 | **+2,2** |
| 10 | 14,4 | 15,2 | +0,8 |
| 11 | 13,6 | 16,7 | **+3,1** |
| 12 | 18,5 | 18,2 | −0,3 |
| 13 | 19,9 | 19,5 | −0,4 |
| 14 | 20,1 | 20,7 | +0,6 |
| 15 | 21,1 | 21,7 | +0,6 |
| 16 | 22,3 | 22,6 | +0,3 |
| 17 | 23,2 | 23,4 | +0,2 |

**Magnitud máxima: 4,5 kg en varones de 12 años**, sobre un valor de 18,5 kg.
Un mismo niño de 12 años, medido una sola vez, cae en el P50 según un análisis y
muy por debajo del P50 según el otro.

Las dos tablas reproducen exactamente lo que la prosa de la fuente describe, lo
que confirma que la lectura es correcta.

---

## Qué NO se hace con esta discrepancia

| Tentación | Por qué no |
|---|---|
| Elegir la regresión cuantílica porque es la que ya está en la base | Preferencia de producto |
| Elegir el LMS porque es el método más usado en normas de crecimiento | Preferencia metodológica sin evidencia que la sostenga aquí |
| Elegir la de 2022 por ser más reciente | La recencia no resuelve conflictos (`22`) |
| Elegir la de mayor cobertura etaria (6–64) | El tamaño no resuelve conflictos |
| Promediar ambos P50 | Crearía un valor que **nadie publicó** |
| Presentar un intervalo entre ambos | Igual: sería una norma inventada |
| Retirar `HGS-CO-TN1` | Un conflicto se declara, no se poda (`23`) |

**Ninguna de las dos es incorrecta.** Son dos estimadores distintos aplicados a
los mismos datos, y ambos autores lo saben: la fuente admitida discute la
diferencia abiertamente en lugar de ocultarla.

---

## Consecuencia sobre la base

### Lo que NO puede registrarse

**No se registra un conflicto formal entre dos normas**, porque `22` lo define
entre **dos normas admitidas** y `ramirez_velez_hgs_colombia_6_64_2021` sigue
detenida en **E-2 · CA-07**: no tenemos su tabla de percentiles, solo su P50
reproducido por un tercero.

**Tampoco se admite su norma desde la Tabla 3 de la otra fuente.** Sería:

- una **procedencia secundaria** (CA-03: una fuente secundaria localiza, no
  sustituye · `20`);
- **incompleta**: solo P50, cuando la fuente publica de P3 a P97.

Que tengamos sus valores delante no los hace admisibles. Es la misma disciplina
que impidió admitir la revisión internacional en NKB-3.1.

### Lo que sí se registra

> **`HGS-CO-TN1` pasa a ES-2 · Cuestionada, sus 24 normas.**

`23` define ES-2 como «hay una objeción registrada y sin resolver» y permite
aplicarla **con advertencia**. La objeción es exactamente esta:

> Otro análisis publicado de **las mismas mediciones** estima el mismo percentil
> con valores que difieren hasta 4,5 kg, y la propia fuente admitida lo declara.
> El valor de esta norma depende de una elección de estimador que su identidad
> normativa no captura.

**No se degrada su calidad.** Sigue siendo Moderada: la objeción no es sobre la
evidencia, es sobre la unicidad del valor. Calidad y estado son ejes distintos
(`37`).

**No se retira.** Sigue siendo la única norma admitida para escolares
colombianos, y es utilizable — con la advertencia delante.

---

## Por qué esto es lo contrario de un fracaso

La base pasa de *«no hay conflictos»* a *«hay uno, está medido y no se ha
resuelto»*. Es mejor así:

1. **El modelo de conflictos queda ejercitado sobre datos reales**, tras cuatro
   sprints. La deuda estructural más antigua se cierra.
2. **Se confirma la predicción de `29`**: el conflicto aparece entre reanálisis
   del mismo conjunto de datos, exactamente donde se dijo que aparecería.
3. **Aparece un límite del modelo de identidad** que no se había visto: el
   estimador no es coordenada, y debería registrarse siempre. Ahora se registra.
4. **El NIE recibe un caso real** en el que un número solo, sin advertencia,
   sería engañoso.

---

## Nota de método sobre las coordenadas

Se registra como observación, **sin modificar `18` ni ninguna coordenada**, que
los criterios NKB-2 están congelados:

> El **método de estimación** (regresión cuantílica, LMS, distribución empírica)
> no es coordenada de identidad, pero **determina el valor**. Dos normas
> idénticas en identidad pueden diferir materialmente solo por él.

Consecuencia práctica que sí se aplica ya: **CN-11 debe declarar siempre el
método de estimación**, no solo la forma de la distribución. Las 15 fichas se
auditaron contra esto en `41`.

Si algún día se decide convertirlo en coordenada, será una decisión de un sprint
de criterios, no de un sprint de dominio.

---

---

## Revisión de NIE-1.4 · el conflicto sigue sin poder declararse

NIE-1.4 volvió sobre este par con un único objetivo: **determinar si la
evidencia primaria accesible permite declarar el conflicto formal**. No
buscaba producirlo.

### Acceso, comprobado en seis índices

| Índice | Resultado |
|---|---|
| Unpaywall | `is_oa: false` · `has_repository_copy: false` · `best_oa_location: null` |
| OpenAlex | `is_oa: false` · `oa_status: closed` · solo editorial y PubMed |
| Crossref | Licencia Elsevier TDM · «All rights reserved» |
| Semantic Scholar | `isOpenAccess: false` · `openAccessPdf` vacío |
| Europe PMC | `isOpenAccess: N` · `inPMC: N` · sin PMCID |
| OpenAIRE | Sin copia en ningún repositorio institucional |

Más ScienceDirect y la web de la revista, ambas 403, y el observatorio de la
UPNA, que solo expone metadatos. **La deuda de acceso está comprobada, no
supuesta.**

### Matriz de coordenadas

| Coordenada | `HGS-CO-TN1` | Ramírez-Vélez 2021 | Estado |
|---|---|---|---|
| Variable | Prensión absoluta | Prensión absoluta | ✅ coincide |
| Población | ENSIN-2015 | ENSIN-2015 | ✅ coincide |
| Fuente muestral | ENSIN-2015 | «the same data» | ✅ coincide |
| Franja etaria | 6–17,9 | 6–64 | ✅ solapan |
| Sexo · n por sexo | M/F · 1 575 / 1 072 | M/F · 1 575 / 1 072 | ✅ coincide |
| Unidad | kg | kg | ✅ coincide |
| Tipo de norma | TN-1 | TN-1 | ✅ coincide |
| **Instrumento** | Takei TKK 5101 | «hand dynamometer with an adjustable grip» | ❌ **NO DETERMINABLE** |
| **Posición** | Bipedestación, brazo lateral | no accesible | ❌ **NO DETERMINABLE** |
| **Definición operacional** | Media de ambas manos | no accesible | ❌ **NO DETERMINABLE** |
| Estimador | Regresión cuantílica | LMS | Difiere · **no es coordenada** |

Ninguna celda se rellenó por inferencia.

> De las **cuatro coordenadas de identidad**, tres coinciden —variable,
> población y estrato— y la cuarta, el **método**, no puede determinarse.

La descripción del instrumento en el resumen —«dinamómetro de mango
ajustable»— es **compatible** con el Takei TKK 5101, y también con el T-18
SMEDLY III y con el Camry. Compatible no es identificable.

### Por qué la definición operacional no es un detalle

Es el hallazgo del sprint, y sale de la propia fuente admitida.

`martinez_torres_hgs_colombia_2022` publica en su Tabla 3 **dos variantes de su
propia definición operacional** sobre las mismas mediciones: media de ambas
manos y máximo. Comparando ambas, varones, P50:

| Comparación | Diferencia máxima |
|---|---|
| **Entre las dos definiciones del mismo estudio, con los mismos datos** | **1,5 kg** |
| Entre su media y Ramírez-Vélez | 4,5 kg |
| Entre su máximo y Ramírez-Vélez | 4,0 kg |

Cambiar únicamente cómo se consolidan las dos manos mueve el P50 hasta 1,5 kg
**sin tocar un solo dato**. Es un tercio de la discrepancia observada.

Y no sabemos cuál de las dos usó Ramírez-Vélez.

> La coordenada que falta no es una formalidad pendiente: es **una coordenada
> que demostrablemente mueve los valores**, y cuyo desconocimiento podría
> explicar parte de la diferencia sin que haya contradicción alguna.

### Veredicto

> ## CONFLICTO_NO_DETERMINABLE
>
> Se mantiene. No se degrada a `NO_CONFLICTO` ni se eleva a `CONFLICTO`.

- **No es `CONFLICTO`**: declararlo exigiría afirmar que los métodos coinciden,
  y eso no se ha podido leer.
- **No es `NO_CONFLICTO`**: eso exigiría demostrar que alguna coordenada crítica
  difiere, y tampoco se ha podido leer.

`HGS-CO-TN1` **permanece en ES-2 · Cuestionada**, con sus 24 normas, sus valores
intactos y su advertencia viajando con cada candidata.

**Lo que falta sigue siendo una sola cosa: acceso institucional a Clinical
Nutrition ESPEN.** No más búsqueda, no más análisis.

---

## Estado de las deudas asociadas

| Deuda | Antes | Ahora |
|---|---|---|
| Verificar el método del par ENSIN | Abierta | **CERRADA** · coinciden |
| Cuantificar la discrepancia | No planteada | **CERRADA** · ambos sexos, 12 edades |
| Leer la tabla completa de `ramirez_velez_…_2021` | Abierta | **Sigue abierta** · deuda de **acceso** |
| Registrar el conflicto como tal entre dos normas admitidas | Abierta | **Sigue abierta**, y depende de la anterior |

Lo que falta para el registro formal es una sola cosa: **acceso institucional a
Clinical Nutrition ESPEN**. No más búsqueda, no más análisis.
