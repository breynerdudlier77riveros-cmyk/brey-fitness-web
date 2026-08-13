---
modulo: 07
titulo: Determinación del conflicto ENSIN
sprint: NIE-1.4
---

# 07 · El conflicto ENSIN

## Veredicto

> ## CONFLICTO_NO_DETERMINABLE
>
> Se mantiene. No se eleva a `CONFLICTO` ni se degrada a `NO_CONFLICTO`.

El sprint no buscaba producir un conflicto. Buscaba determinar si está
demostrado. **No lo está**, y tampoco está descartado.

---

## La pregunta

¿La evidencia primaria accesible permite establecer que `HGS-CO-TN1` y
`ramirez_velez_hgs_colombia_6_64_2021` tienen **identidad suficiente** como para
constituir un conflicto formal según las reglas de la NKB?

Un conflicto **no** existe por que coincidan país, edad, variable y difieran los
valores. Exige identidad demostrada en las cuatro coordenadas.

---

## Acceso · comprobado, no supuesto

Seis índices independientes, todos coincidentes:

| Índice | Resultado |
|---|---|
| Unpaywall | `is_oa: false` · `has_repository_copy: false` · `best_oa_location: null` |
| OpenAlex | `is_oa: false` · `oa_status: closed` |
| Crossref | Licencia Elsevier TDM · «All rights reserved» |
| Semantic Scholar | `isOpenAccess: false` · `openAccessPdf` vacío |
| Europe PMC | `isOpenAccess: N` · `inPMC: N` · sin PMCID |
| OpenAIRE | Sin copia en ningún repositorio institucional |

Más ScienceDirect (403), la web de la revista (403) y el observatorio de la
UPNA, que solo expone metadatos.

**No se declara «sin acceso» por no haber encontrado nada: se declara porque
seis registros públicos afirman que no existe copia abierta.**

---

## Matriz de coordenadas

Ninguna celda rellenada por inferencia.

| Coordenada | `HGS-CO-TN1` | Ramírez-Vélez 2021 | Estado |
|---|---|---|---|
| Variable | Prensión absoluta | Prensión absoluta | ✅ |
| Población | ENSIN-2015, civil no institucionalizada | ENSIN-2015 | ✅ |
| Fuente muestral | ENSIN-2015 | «the same data» | ✅ |
| Franja etaria | 6–17,9 | 6–64 | ✅ solapan |
| Sexo | M / F | M / F | ✅ |
| n varones · mujeres | 1 575 · 1 072 | 1 575 · 1 072 | ✅ |
| Unidad | kg | kg | ✅ |
| Tipo de norma | TN-1 | TN-1 | ✅ |
| **Instrumento** | Takei TKK 5101 | «dinamómetro de mango ajustable» | ❌ |
| **Posición** | Bipedestación, brazo lateral | no accesible | ❌ |
| **Definición operacional** | Media de ambas manos | no accesible | ❌ |
| Estimador | Regresión cuantílica | LMS | difiere · **no es coordenada** |

> De las cuatro coordenadas de identidad, **tres coinciden y la cuarta —el
> método— no puede determinarse.**

La descripción del instrumento es **compatible** con el Takei TKK 5101, y
también con el T-18 SMEDLY III y con el Camry. Compatible no es identificable.

---

## Por qué la coordenada que falta no es una formalidad

Es el hallazgo del sprint, y sale de la propia fuente admitida.

`martinez_torres_hgs_colombia_2022` publica en su Tabla 3 **dos variantes de su
propia definición operacional** sobre las mismas mediciones:

| Comparación · varones, P50 | Diferencia máxima |
|---|---|
| **Entre sus dos definiciones, mismos datos** | **1,5 kg** |
| Entre su media y Ramírez-Vélez | 4,5 kg |
| Entre su máximo y Ramírez-Vélez | 4,0 kg |

Cambiar únicamente cómo se consolidan las dos manos mueve el P50 hasta **1,5 kg
sin tocar un solo dato**: un tercio de la discrepancia observada.

Y no sabemos cuál de las dos usó la otra fuente.

> La coordenada ausente **demostrablemente mueve los valores**. Su
> desconocimiento podría explicar parte de la diferencia sin que exista
> contradicción alguna — o no explicarla en absoluto. No se sabe, y eso es
> exactamente lo que dice el estado.

---

## Los dos errores que no se cometieron

| Si se hubiera declarado | Habría exigido afirmar |
|---|---|
| `CONFLICTO` | Que los métodos coinciden. **No se ha podido leer** |
| `NO_CONFLICTO` | Que alguna coordenada crítica difiere. **Tampoco** |

Ambas conclusiones habrían convertido incertidumbre metodológica en certeza
normativa. El estado correcto es el que reconoce el límite.

---

## Consecuencias en el motor

Ninguna nueva: el comportamiento ya era el correcto, y este sprint lo blinda con
tests.

| Comportamiento | Comprobado por |
|---|---|
| `HGS-CO-TN1` sigue en ES-2 con sus 24 celdas | `conflicto.test.ts` |
| El conflicto se propaga hasta el resultado de interpretación | Ídem |
| **Una norma con conflicto declarado nunca queda como `APLICABLE` a secas** | Ídem |
| Sin conflicto declarado no se inventa ninguno | Ídem |
| El valor observado no cambia el conjunto de candidatas | Prueba de propiedad |
| No se menciona la fuente en discordia | Ídem |

### Sobre las reservas de una norma no aplicable

Una candidata `NO_APLICABLE` con conflicto declarado lleva el conflicto en su
campo, y su lista de reservas **está vacía**. Es correcto: las reservas
califican a una norma utilizable, y una que no lo es no tiene nada que matizar.

---

## Estado de la deuda

| | |
|---|---|
| Verificar el método del par ENSIN | **Sigue abierta** |
| Qué falta | **Acceso institucional a Clinical Nutrition ESPEN** |
| Qué no falta | Más búsqueda, más análisis o más tiempo |

Es la única deuda del proyecto que no se cierra trabajando más.
