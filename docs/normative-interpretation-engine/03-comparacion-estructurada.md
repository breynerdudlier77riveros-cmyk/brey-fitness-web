---
modulo: 03
titulo: Comparación estructurada
sprint: NIE-1.4
---

# 03 · Comparación estructurada

## Qué resuelve

Permite decir **en qué se diferencian** dos o más normas aplicables, sin
declarar cuál es mejor.

| Se puede decir | No se puede decir |
|---|---|
| «Existen dos normas aplicables con distinto tipo normativo» | «La TN-2 es superior» |
| «Difieren en el instrumento, y EQ-3 impide compararlas» | «Usa la del Takei» |
| «Una está cuestionada y la otra no» | «Usa la que no está cuestionada» |

La diferencia entre describir y recomendar es todo el módulo.

---

## Las siete categorías

| Categoría | Campos | Qué significa una diferencia |
|---|---|---|
| **identidad** | variable, población, estrato, restricciones | Describen cosas distintas: no son alternativas para lo mismo |
| **metodológica** | instrumento | EQ-3: no son intercambiables |
| **tipo_normativo** | tipo | Afirman cosas distintas sobre la distribución |
| **unidad** | unidad | Sus valores no son comparables entre sí |
| **calidad** | calidad, n de celda | Distinto grado de respaldo. No establece prioridad |
| **estado** | estado, conflicto | Una arrastra una objeción registrada |
| **procedencia** | referencia | Proceden de fuentes primarias distintas |

**No existe una categoría «mejor», y no debe añadirse.** En cuanto exista,
alguien la usará para ordenar. Hay un test que busca «mejor», «superior»,
«peor», «preferible», «recomendado» y «ranking» en la salida de la comparación.

---

## Forma de la salida

```
ComparacionCandidatas
├── normas[]           ids comparados
├── coincidencias[]    campos en que todos coinciden
├── diferencias[]      { campo, categoria, porNorma, nota }
└── resumen            una línea, descriptiva
```

`porNorma` guarda **qué declara cada una**, por id. No hay un «ganador» ni un
campo de preferencia.

El `resumen` termina siempre igual: *«La elección entre ellas no corresponde a
este motor.»*

---

## El caso que la motiva

Un colombiano de 22 años medido con Takei T-18 SMEDLY III encuentra dos normas:

| | `HGS-CO-UNI-M-22` | `HGS-CO-UNI-TN2-M-22` |
|---|---|---|
| Población | Universitarios de Bogotá y Cali | Ídem |
| Instrumento | Takei T-18 SMEDLY III | Ídem |
| Estrato | Varones · 22 años | Ídem |
| Unidad | kg | Ídem |
| Calidad | Moderada | Moderada |
| N de celda | 177 | 177 |
| **Tipo** | **TN-1 · percentiles** | **TN-2 · media y dispersión** |

La comparación devuelve **una sola diferencia**, clasificada como
`tipo_normativo`, y una nota que explica que ambas pueden ser ciertas a la vez.

Ninguna de las dos es preferible. Son la misma tabla leída en dos columnas
distintas, y responden preguntas distintas.

---

## Diferencia de valores

`describirDiferenciaDeValores` existe para un riesgo concreto: que alguien vea
dos números distintos y concluya que hay contradicción.

| Situación | Qué devuelve |
|---|---|
| Unidades distintas | «No son comparables. La NKB no convierte» |
| Tipos distintos | «No afirman lo mismo, de modo que no se contraponen» |
| La NKB declara conflicto | «La advertencia viaja con la candidata y no se resuelve aquí» |
| Resto | «Difieren en alguna coordenada, y eso no constituye conflicto» |

Devuelve una descripción y **nunca un veredicto**.
