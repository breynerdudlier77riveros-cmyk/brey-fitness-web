---
modulo: 14
titulo: Contrato conceptual de una norma
estado: congelado
sprint: NKB-2.0
---

# 14 · Contrato conceptual de una norma

Qué debe poder describirse de una norma admisible. **Contrato conceptual, no
esquema técnico**: dice qué información existe, no en qué tipo de dato se
guarda.

## Regla de admisión de campos

> Cada campo existe porque **sin él una norma no puede usarse o no puede
> auditarse**. Ninguno existe porque «podría ser útil».

Cada uno declara abajo su razón documental. Un campo cuya razón no pueda
escribirse en una línea no entra.

## Obligatoriedad

| Marca | Significa |
|---|---|
| **Obligatorio** | Sin él no hay norma. Su ausencia detiene la admisión |
| **Condicional** | Obligatorio cuando la condición se cumple |
| **Cuando conste** | Se registra si la fuente lo publica; su ausencia se declara |

**«Cuando conste» nunca significa «se rellena por inferencia».** Un campo
ausente se declara ausente (I-10, TR-03).

---

## Bloque A · Identidad

Las cuatro coordenadas congeladas en NKB-1. Ninguna es prescindible.

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-01** | Variable | Obligatorio | Sin ella no se sabe de qué habla la norma |
| **CN-02** | Definición operacional | Obligatorio | El nombre no basta: dos fuentes pueden llamar igual a magnitudes distintas (CA-04) |
| **CN-03** | Método | Obligatorio | Parte de la identidad: otro método, otra distribución (NKB-ADR-03) |
| **CN-04** | Población | Obligatorio | Determina a quién es aplicable |
| **CN-05** | Estrato | Obligatorio | Localiza la fila exacta dentro de la población |

## Bloque B · Medida

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-06** | Unidad | Obligatorio | Sin ella un valor y una norma no son comparables |
| **CN-07** | Instrumento | Condicional | Obligatorio cuando el instrumento altera la distribución (`18`) |
| **CN-08** | Parámetros del protocolo | Condicional | Solo los necesarios para identificar o reproducir la norma (`18`) |

## Bloque C · Distribución

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-09** | Tipo de norma | Obligatorio | Declara **qué clase de afirmación** es (`15`) |
| **CN-10** | Estadísticos publicados | Obligatorio | Es el contenido de la norma |
| **CN-11** | Forma de la distribución | Cuando conste | Sin ella, media y dispersión pueden describir mal (`15`) |
| **CN-12** | Clasificación de la fuente | Condicional | Obligatorio si el tipo es clasificación; prohibido inventarla (I-11) |

## Bloque D · Población y muestra

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-13** | Criterios de inclusión | Obligatorio | Definen la población; la etiqueta no (CA-06) |
| **CN-14** | Criterios de exclusión | Cuando consten | Acotan a quién NO representa la muestra |
| **CN-15** | Tamaño muestral del estrato | Cuando conste | Es el N que importa, no el del estudio (`16`) |
| **CN-16** | Procedimiento de muestreo | Cuando conste | Distingue una muestra representativa de una de conveniencia |
| **CN-17** | Sexo | Condicional | Obligatorio cuando la fuente estratifica por él |
| **CN-18** | Edad o rango etario | Condicional | Igual |
| **CN-19** | Nivel de práctica | Condicional | Obligatorio cuando la población lo usa como criterio |
| **CN-20** | Contexto | Cuando conste | Geográfico, temporal u ocupacional, si condiciona la aplicabilidad |

## Bloque E · Procedencia

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-21** | Referencia | Obligatorio | Sin ella nada es verificable (I-10) |
| **CN-22** | Identificador persistente | Cuando exista | Permite a un tercero llegar al mismo documento |
| **CN-23** | Fecha de publicación | Obligatorio | Sitúa la norma en el tiempo, sin implicar vigencia (`23`) |
| **CN-24** | Naturaleza de la fuente | Obligatorio | Determina su papel (`19`) |
| **CN-25** | Cadena de procedencia | Condicional | Obligatorio si se llegó por una fuente secundaria (`20`) |
| **CN-26** | Ubicación del dato en la fuente | Obligatorio | Dónde exactamente aparece: tabla, página, apartado |

**CN-26 se subestima siempre.** Sin él, verificar una norma obliga a releer el
artículo entero, y en la práctica nadie lo hace.

## Bloque F · Estado y calidad

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-27** | Estado de la norma | Obligatorio | Si puede aplicarse o no (`23`) |
| **CN-28** | Estado de la fuente | Obligatorio | Si la publicación sigue vigente o fue retractada |
| **CN-29** | Nivel de calidad | Obligatorio | Viaja siempre con la norma (I-06) |
| **CN-30** | Dimensiones que la degradaron | Condicional | Obligatorio si el nivel no es el máximo: sin esto la calidad es un veredicto sin motivo |
| **CN-31** | Nivel de confianza de la admisión | Obligatorio | Cuán segura fue la decisión de admitir, distinta de la calidad de la norma |

**CN-29 y CN-31 no son lo mismo.** La calidad valora la norma; la confianza de
admisión valora **nuestra decisión** de haberla admitido. Una norma puede ser
sólida y haberse admitido con dudas —por ejemplo, si el método se dedujo del
contexto en vez de leerse—, y eso debe constar por separado.

## Bloque G · Alcance y límites

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-32** | Limitaciones de la fuente | Obligatorio | Las que la propia publicación reconoce (CA-08) |
| **CN-33** | Limitaciones añadidas | Cuando apliquen | Las que se detectan al incorporarla, marcadas como añadidas |
| **CN-34** | Alcance de aplicabilidad | Obligatorio | A quién es aplicable, en términos de su población |
| **CN-35** | Origen de cada dato | Obligatorio | Explícito, derivado o reconstruido (`21`) |

## Bloque H · Traza

| Código | Campo | Obligatoriedad | Razón documental |
|---|---|---|---|
| **CN-36** | Quién la incorporó | Obligatorio | Una decisión sin autor no puede revisarse |
| **CN-37** | Cuándo | Obligatorio | Sitúa la decisión respecto a los criterios vigentes |
| **CN-38** | Versión de criterios aplicada | Obligatorio | Los criterios evolucionan; una norma admitida bajo otros debe poder reevaluarse |
| **CN-39** | Conflictos declarados | Cuando existan | Con qué otras normas entra en conflicto (`22`) |
| **CN-40** | Relación de sustitución | Cuando exista | Qué norma sustituye o por cuál fue sustituida (`23`) |

---

## Separación entre fuente y metadato

Regla que atraviesa todo el contrato y se congela aquí:

> **Todo campo declara si su contenido procede de la fuente o lo añadió BREY.**

| Procede de la fuente | Lo añade BREY |
|---|---|
| CN-01 a CN-26, CN-32 | CN-27, CN-29, CN-30, CN-31, CN-33, CN-35 a CN-40 |

Sin esta separación, dentro de un año nadie sabrá si una limitación la escribió
el autor del estudio o alguien de aquí. Es la exigencia 7 de la trazabilidad
(`24`).

## Campos deliberadamente ausentes

| Candidato | Por qué no |
|---|---|
| **Valor interpretado** | Sería interpretación (I-09) |
| **Categoría de calidad del sujeto** | La NKB no tiene sujetos (I-02) |
| **Norma recomendada / preferente** | La NKB no elige (I-09) |
| **Equivalencia con otra norma** | Sería armonización (I-11). Los conflictos se declaran, no se resuelven |
| **Puntuación de la fuente** | Un número único ocultaría qué dimensión falló |
| **Vigencia calculada** | Ninguna fuente documenta caducidad (NKB-ADR-08) |
