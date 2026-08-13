---
modulo: 42
titulo: Auditoría de trazabilidad de las 356 normas
estado: v1.0
sprint: NKB-3.5
---

# 42 · Trazabilidad

Auditoría de la cadena completa, norma por norma:

```
norma → ficha → fuente → referencia primaria → tabla → fila/estrato → valor original
```

---

## Resultado por eslabón

| Eslabón | Comprobación | Resultado |
|---|---|---|
| norma → ficha | Cada id pertenece a una ficha | **356 / 356** |
| ficha → fuente | Cabecera `referencia:` coincide con CN-21 | **15 / 15** |
| fuente → referencia primaria | La clave existe en el YAML | **15 / 15** |
| referencia → tabla | CN-26 nombra tabla y columna | **15 / 15** |
| tabla → fila | Cada norma declara su estrato | **356 / 356** |
| fila → valor | Valor verificado contra el fichero original | **356 / 356** |

**0 valores sin trazabilidad.**

---

## Las catorce comprobaciones

| # | Comprobación | Resultado |
|---|---|---|
| 1 | Referencias colgantes | **0** |
| 2 | Referencias huérfanas | **0** |
| 3 | Referencias duplicadas | **0** · 19 claves |
| 4 | Ids de norma duplicados | **0 de 356** |
| 5 | Valores sin fuente | **0** |
| 6 | Valores modificados respecto al original | **0** |
| 7 | Unidades inconsistentes dentro de una ficha | **0** |
| 8 | Fichas con contrato incompleto | **0** · 15/15 al 40/40 |
| 9 | Restricciones perdidas | **0** · CN-13 y CN-14 en las 15 |
| 10 | Calidad sin justificación | **0** · tras corregir `HGS-DE-TN1` |
| 11 | Campos heredados de otra ficha | **0** · tras corregir `HGS-DE-TN1` |
| 12 | Valores fuera de `fichas/` | **0** |
| 13 | Estados sin evidencia explícita | **0** · las 2 objeciones ES-2 documentadas |
| 14 | Ficheros tocados fuera de la NKB | **0** |

---

## Verificación mecánica acumulada

Las 356 normas se han comparado **celda a celda** con su fichero fuente. Este
sprint reverificó además dos bloques ya publicados.

| Bloque | Normas | Celdas | Discrepancias | Sprint |
|---|---|---|---|---|
| `HGS-DE-TN2` · `HGS-DE-TN1` | 56 | 252 | 0 | 3.0 |
| `HGS-BR-TN1` | 26 | 338 | 0 | 3.1 · **reverificado en 3.4** |
| `HGS-CO-TN1` | 24 | 168 | 0 | 3.3 · **reverificado en 3.5** |
| `HGS-CL-TN1-D` · `-I` | 48 | 432 | 0 | 3.3 · **reverificado en 3.4** |
| `HGS-BR-*` × 5 estratos | 130 | 1 690 | 0 | 3.4 |
| `HGS-CO-CUC-*` | 24 | 168 | 0 | 3.4 |
| `HGS-CO-UNI-*` | 48 | 216 | 0 | 3.4 |
| **Total** | **356** | **3 264** | **0** | |

### Dos verificaciones independientes conseguidas en este sprint

La Tabla 3 de `martinez_torres_hgs_colombia_2022` reproduce valores de otras
fuentes de la base, lo que permitió comprobarlas **contra un tercero**:

| Comprobación | Resultado |
|---|---|
| Nuestro `HGS-CO-TN1` P50, ambos sexos, contra la Tabla 3 de su propia fuente | **24 / 24 idénticos** |
| Nuestro `HGS-CL-TN1-D` P50 en lbf, convertido, contra los kg que publica Martínez-Torres | **24 / 24 dentro de ±0,1 kg** |

La segunda es la más valiosa: **un equipo ajeno leyó la misma tabla chilena, la
convirtió y llegó a nuestros números.** Es la comprobación más fuerte que la
base ha tenido de que una transcripción es correcta.

> Y aun así, **esos kg no se adoptaron**. La ficha chilena sigue en lbf (`39`).
> Verificar no es motivo para sustituir lo publicado.

---

## Problemas documentales encontrados y su tratamiento

| Problema | Ficha | Tratamiento |
|---|---|---|
| **CN-30 y CN-34 heredaban de la ficha hermana** | `HGS-DE-TN1` | **Corregido**: contenido escrito explícitamente. Calidad y dimensiones sin cambios (`37`) |
| Etiquetas de campo abreviadas en 5 campos | `HGS-DE-*` | **Registrado, no corregido**: el código CN identifica el campo y el contenido es correcto |
| **Estado desactualizado** | `HGS-CO-TN1` | Pasa a **ES-2** por la objeción del par ENSIN (`40`) |

### Lo que no se hizo

**No se corrigió ninguna clasificación de calidad.** Las quince son
reproducibles desde su documentación, y la única que no lo era —`HGS-DE-TN1`—
se resolvió **completando la documentación**, no cambiando el nivel.

Es la instrucción explícita del sprint: si una clasificación no puede
reproducirse, se marca como problema documental y se registra qué falta. Aquí lo
que faltaba era el texto, y el texto existía en la fuente.

---

## Registro de referencias

| Nivel | Claves | Situación |
|---|---|---|
| **E-5** | 6 | Admitidas · 356 normas |
| **E-4** | 1 | Verificada y no admitida · CA-05 |
| **E-2** | 2 | Detenidas · CA-07 · deuda de acceso |
| **E-1** | 10 | Localizadas sin verificar |
| **Total** | **19** | 0 colgantes · 0 huérfanas · 0 duplicadas |

---

## Lo que esta auditoría NO puede demostrar

Se declara porque el límite es real:

| No demuestra | Por qué |
|---|---|
| Que las fuentes midieran bien | La NKB verifica **transcripción**, no la ejecución del estudio |
| Que los valores publicados sean correctos | El caso brasileño ES-2 es la prueba: hay un valor publicado imposible |
| Que no falte evidencia relevante en la literatura | Eso lo limitan las deudas de búsqueda y acceso |
| Que la calidad asignada sea la única defendible | Es reproducible desde la documentación; no es la única lectura posible |

> **Trazabilidad no es veracidad.** Que un valor pueda seguirse hasta su tabla
> original significa que **no lo inventamos nosotros**. No significa que sea
> cierto. Las dos normas en ES-2 existen justamente para no confundir las dos
> cosas.
