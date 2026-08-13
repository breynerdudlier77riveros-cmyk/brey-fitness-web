---
modulo: 38
titulo: Auditoría de aplicabilidad y doctrina calidad ≠ aplicabilidad
estado: v1.0
sprint: NKB-3.5
---

# 38 · Aplicabilidad

---

## La frontera, en una línea cada uno

| | Afirma |
|---|---|
| **NKB** | «Esta norma se publicó **para** esta población y **bajo** estas condiciones.» |
| **NIE** | «Esta persona **cumple** o **no cumple** las condiciones necesarias para usarla.» |

La NKB **nunca** ejecuta la segunda frase. No conoce personas, no recibe
mediciones y no compara. Publica condiciones; comprobar si alguien las cumple es
del NIE, y responde por ello (I-09).

**Corolario incómodo y deliberado:** la NKB no puede decir «esta es la mejor
norma para un colombiano de 14 años». Puede decir qué normas se publicaron para
esa población y con qué condiciones. Elegir es aplicar.

---

## Los ocho estados de consumo

Se congelan para que el NIE pueda distinguir situaciones que hoy se confunden.
**Ninguno significa diagnóstico. Ninguno es una recomendación.**

| Estado | Significa | Quién lo determina |
|---|---|---|
| **CANDIDATA** | Coincide en variable y tipo; falta comprobar el resto | NIE, consultando la NKB |
| **APLICABLE** | El sujeto y la medición cumplen todas las condiciones declaradas | **NIE** |
| **APLICABLE_CON_RESERVAS** | Las cumple, y la norma trae advertencias que deben viajar con el resultado | **NIE**, con los metadatos de la NKB |
| **NO_APLICABLE** | Alguna condición declarada no se cumple | **NIE** |
| **NO_DETERMINABLE** | Falta información para decidir — del sujeto, de la medición o de la norma | **NIE** |
| **CONFLICTO** | Dos normas admitidas comparten identidad y publican valores incompatibles | **NKB** |
| **CONFLICTO_NO_DETERMINABLE** | Hay indicios de conflicto y falta evidencia para confirmarlo | **NKB** |
| **SIN_NORMA_ADMISIBLE** | Se buscó y no existe norma que supere los ocho criterios | **NKB** |

### Los dos que la NKB determina, y por qué

**CONFLICTO** y **SIN_NORMA_ADMISIBLE** son afirmaciones sobre la **evidencia**,
no sobre una persona. La NKB es quien puede sostenerlas.

**CONFLICTO_NO_DETERMINABLE** es el estado del par ENSIN hoy: la discrepancia
está verificada y cuantificada, pero la segunda norma no está admitida, de modo
que no puede registrarse un conflicto formal entre dos normas de la base (`40`).

### Lo que NO es un estado

- **No existe «RECOMENDADA», «PREFERENTE» ni «MEJOR».** Serían una elección.
- **No existe «NORMAL» ni «ANORMAL».** Serían un diagnóstico.
- **APLICABLE_CON_RESERVAS no es un nivel intermedio de calidad**: es APLICABLE
  con advertencias obligatorias.

---

## Doctrina · calidad ≠ aplicabilidad

Son **dos ejes independientes**. Se cruzan; no se sustituyen ni se multiplican.

| | Aplicable | No aplicable |
|---|---|---|
| **Calidad Alta** | Ideal · *no existe ninguna en la base* | Posible: buena norma para otra población |
| **Calidad Moderada** | `HGS-CO-TN1` · `HGS-CO-UNI-TN1` | Las 6 brasileñas, las 2 alemanas, las 2 chilenas |
| **Calidad Baja** | **`HGS-CO-CUC-TN1-D` y `-ND`** | — |

### Las cinco combinaciones que hay que poder decir

| Combinación | Caso real en la base |
|---|---|
| Aplicable + Moderada | `HGS-CO-UNI-TN1` para un universitario colombiano de 22 años |
| **Aplicable + Baja** | `HGS-CO-CUC-TN1-D` para un adulto colombiano de 45 años |
| **No aplicable + calidad superior** | Las 6 brasileñas: mejor muestreo que Cúcuta, y **no aplicables** a Colombia |
| Admisible + no aplicable | Las 2 alemanas: admitidas y sin correspondencia con la población objetivo |
| Existente + no determinable | `ramirez_velez_…_2021`: publicada, sin copia legible |

**La tercera es la que más se malinterpreta.** Una norma brasileña con muestreo
probabilístico estratificado es metodológicamente más sólida que la de Cúcuta, y
aun así **no puede usarse para un colombiano de 45 años**. La calidad no compra
aplicabilidad.

Y al revés: que la norma de Cúcuta sea la única aplicable a esa persona **no la
mejora**. Sigue siendo Baja, y sigue apoyándose en 10 a 29 personas por celda.

### Prohibiciones que se congelan

| Prohibido | Por qué |
|---|---|
| Una puntuación compuesta «calidad × aplicabilidad» | Mezclaría dos preguntas distintas en un número que no responde ninguna |
| Ordenar candidatas por calidad y devolver la primera | Es elegir, y elegir es del NIE — y ni siquiera el NIE debe hacerlo por calidad sola |
| Filtrar por calidad al entregar | `05`: no existe una vista «solo las normas buenas» |
| Ascender una norma por ser la única disponible | La escasez no es evidencia |
| Descartar una norma aplicable por ser de calidad Baja | Sería sustituir un dato débil por ninguno, sin declararlo |

---

## Metadatos que la NKB expone para que el NIE decida

La NKB **no calcula** aplicabilidad. Publica esto, y con esto se puede decidir:

| Metadato | Campo | Para qué sirve |
|---|---|---|
| Variable | CN-01 | ¿Se midió lo mismo? |
| Definición operacional | CN-02 | ¿Se consolidó igual? Mano, intentos, promedio o máximo |
| Método | CN-03 | ¿Procedimiento comparable? |
| Población | CN-04 · CN-13 · CN-14 | ¿Pertenece el sujeto? |
| Estrato | CN-05 | ¿Existe celda para él? |
| Unidad | CN-06 | ¿Coincide con la de la medición? |
| Instrumento | CN-07 | Marca y modelo |
| Protocolo | CN-08 | Posición, intentos, descanso |
| Tipo de norma | CN-09 | ¿Percentiles, media, corte? |
| Estadísticos | CN-10 | Qué valores hay |
| Forma y **estimador** | CN-11 | Y si el valor depende del estimador |
| Clasificación | CN-12 | Si la fuente define categorías |
| Rango etario | CN-18 | Límite inferior y superior |
| Sexo | CN-17 | Estratificación |
| N por celda | CN-15 | Cuánta evidencia sostiene esa celda concreta |
| Contexto y país | CN-20 | Correspondencia geográfica |
| Calidad y dimensión | CN-29 · CN-30 | Cuánto respalda |
| Confianza de admisión | CN-31 | Cuánto juicio hubo en admitirla |
| Limitaciones | CN-32 · CN-33 | Qué declaró la fuente y qué añadimos |
| Alcance | CN-34 | Dónde aplica y dónde no |
| Estado | CN-27 | ES-1 a ES-5 |
| Conflictos | CN-39 | Si hay objeción |
| Referencia y ubicación | CN-21 · CN-26 | Trazabilidad hasta la fila |

**Los 40 campos del contrato existen precisamente para esto.** No hay ningún
metadato nuevo que crear: el contrato de NKB-2 ya era suficiente, y este sprint
lo comprueba en lugar de ampliarlo.

---

## Estado documental de las 15 fichas

Lo que la NKB puede afirmar hoy sobre cada una. **No es una decisión de
aplicabilidad**: es la correspondencia declarada entre la población de la norma
y la población objetivo de BREY.

| Ficha | Normas | Correspondencia declarada | Estado |
|---|---|---|---|
| `HGS-CO-TN1` | 24 | Colombia, 6–17,9 | **ES-2** · aplicable con la objeción del par ENSIN delante |
| `HGS-CO-UNI-TN1` | 24 | Colombia, universitarios 18–29 | ES-1 |
| `HGS-CO-UNI-TN2` | 24 | Ídem, media y dispersión | ES-1 |
| `HGS-CO-CUC-TN1-D` | 12 | Colombia, Cúcuta, 10–69 | ES-1 · **calidad Baja** |
| `HGS-CO-CUC-TN1-ND` | 12 | Ídem | ES-1 · **calidad Baja** |
| `HGS-CL-TN1-D` · `-I` | 48 | Chile, Maule, 6–17,9 | ES-1 · sin correspondencia |
| `HGS-DE-TN2` · `HGS-DE-TN1` | 56 | Alemania, 17–90 | ES-1 · sin correspondencia |
| `HGS-BR-TN1` ×6 | 156 | Brasil, 65–90, envejecimiento satisfactorio | ES-1 · 5 en ES-2 · sin correspondencia |

**204 de las 356 normas no tienen ninguna correspondencia con la población
objetivo, y las 356 permanecen.** La NKB es universal (`00`).

---

## El caso que resume el módulo

Un colombiano de 45 años que se mide la prensión:

| Pregunta | Respuesta |
|---|---|
| ¿Existe norma? | **Sí**, `HGS-CO-CUC-TN1-D`, década 40–49 |
| ¿Es admisible? | **Sí**, cumple los ocho criterios |
| ¿Corresponde a su población? | **Solo si vive en Cúcuta** y cumple los criterios del estudio |
| ¿Con qué instrumento hay que haberlo medido? | Dinamómetro digital Camry, de pie, brazo paralelo al tronco |
| ¿Cuánta evidencia la sostiene? | **15 varones** en esa celda |
| ¿Qué calidad tiene? | **Baja**, por muestreo de conveniencia y celdas pequeñas |
| ¿Puede el NIE mostrar solo el percentil? | **No** |

Si el NIE devuelve «percentil 60» sin nada más, la afirmación es formalmente
correcta y **materialmente engañosa**. Este módulo existe para que eso no ocurra
por omisión.
