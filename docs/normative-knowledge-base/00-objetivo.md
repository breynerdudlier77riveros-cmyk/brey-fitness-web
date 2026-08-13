---
modulo: 00
titulo: Objetivo, responsabilidades y límites
estado: congelado
---

# 00 · Objetivo

## Qué hace la NKB

Almacena referencias normativas de forma trazable. Tres verbos, y ninguno más:

1. **Registra** — incorpora una norma publicada con todo su contexto.
2. **Conserva** — mantiene su versión, su fuente y sus condiciones de uso.
3. **Publica** — la expone a quien deba aplicarla, con sus limitaciones.

## Qué NO hace

| No hace | A quién corresponde |
|---|---|
| Elegir qué norma aplicar a un sujeto | Normative Interpretation Engine (no existe) |
| Calcular percentiles, z-scores o clasificaciones | NIE |
| Interpretar un resultado | NIE |
| Decidir si un valor es adecuado | Nadie: exigiría un objetivo |
| Caracterizar capacidades | PKB |
| Recomendar conducta | Ningún motor del ecosistema |
| Diagnosticar | Nadie: fuera del ecosistema |
| Comparar personas entre sí | Nadie: ver límite L-05 |

## Límites

**L-01 · La NKB no aplica normas.**
Publica lo que una fuente afirma sobre una población. Que un valor concreto de
una persona concreta se lea contra esa norma es decisión del NIE, y responde
por ella quien la toma.

**L-02 · La NKB no contiene sujetos.**
No hay personas, no hay mediciones, no hay resultados individuales. Ni una fila
de la NKB describe a nadie.

**L-03 · La NKB no genera conocimiento.**
No deriva una norma de otra, no interpola entre estratos, no extrapola a
poblaciones no estudiadas y no combina fuentes para «cubrir un hueco».

**L-04 · La NKB no juzga.**
Una norma describe una distribución observada. Que estar en un percentio sea
bueno, malo, sano o deseable es una afirmación distinta, que exige otra
evidencia y a menudo un objetivo.

**L-05 · La NKB no compara personas.**
Su unidad de almacenamiento es la población, no el individuo. No existe en ella
la noción de «este sujeto frente a aquel».

**L-06 · La NKB no conoce el dominio de quien la use.**
No sabe qué es una capacidad, un sistema de entrenamiento ni un cliente. Su
sujeto es la variable medida.

## Responsabilidades

| | Responsabilidad | Descripción |
|---|---|---|
| **R-01** | Fidelidad a la fuente | Lo almacenado dice exactamente lo que dice la publicación, ni más ni menos |
| **R-02** | Contexto completo | Ninguna norma se almacena sin población, método y unidad |
| **R-03** | Trazabilidad | Todo dato remonta hasta su referencia publicada |
| **R-04** | Calidad declarada | Cada norma expone la calidad de la evidencia que la sostiene |
| **R-05** | Condiciones de uso | Cada norma declara a quién es aplicable y a quién no |
| **R-06** | Versionado | Una norma nueva no borra la anterior |
| **R-07** | Publicación | Exponer las normas como contrato estable para el NIE |

## Por qué la NKB existe antes que el NIE

Un motor de interpretación necesita saber contra qué compara. Hoy ninguna pieza
del ecosistema lo almacena: la PKB documenta si una prueba mide lo que dice, y
declara explícitamente que los valores de referencia, cuando existan, pertenecen
a otra base.

Construir el NIE sin la NKB obligaría a que aquel llevase dentro sus propias
tablas normativas, y esas tablas quedarían atrapadas en un motor que además
decide — exactamente la mezcla de responsabilidades que este ecosistema evita
desde su primer handbook.

## Por qué es independiente del PAS

Una norma de composición corporal, una de bioquímica y una de rendimiento tienen
la misma estructura: una variable, una población, un método, un estadístico y
una fuente. Lo que cambia es el dominio, y el dominio no pertenece a la norma.

Atar la NKB al PAS obligaría a duplicarla el día que el BCS necesite valores de
referencia. Ver `11-ADR.md`, NKB-ADR-01.
