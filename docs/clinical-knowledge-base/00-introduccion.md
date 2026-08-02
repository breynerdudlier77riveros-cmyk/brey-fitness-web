---
modulo: 00
titulo: Introducción
tipo: fundacional
estado: verificado
---

# 00 · Introducción

## Qué es esta base

Un repositorio de conocimiento fisiológico sobre composición corporal, redactado para ser
consultado por software.

Su unidad mínima es la **ficha**: un concepto descrito siempre con la misma estructura de siete
preguntas (`_plantilla-ficha.md`). Esa homogeneidad existe para que la base pueda convertirse
mecánicamente en un grafo, no por gusto editorial.

## Qué no es

| No es | Por qué importa la distinción |
|---|---|
| Un handbook | Los handbooks describen decisiones de BREY. Esta base describe el cuerpo humano, exista BREY o no. |
| Una guía clínica | No indica qué hacer con una persona. Ninguna ficha contiene una conducta. |
| Un dataset | No hay filas, ni identificadores, ni datos de nadie. |
| Un motor | No hay reglas ejecutables. Un umbral citado aquí no es un umbral aplicado por el sistema. |

Esta última fila es la más fácil de malinterpretar y la de peor consecuencia. Si el módulo 08
cita los puntos de corte de perímetro de cintura de la OMS, eso documenta **que existen y qué
dicen** — no autoriza a ningún motor de BREY a clasificar a nadie con ellos. Esa decisión
pertenece a los handbooks de dominio y hoy, deliberadamente, no está tomada.

## Por qué se construye ahora

El Recommendation Engine (Sprint BCS-4.0) terminó declarando cinco ámbitos sobre los que **no
puede pronunciarse** — nutrición, entrenamiento, derivación profesional, periodicidad y
valoración clínica — porque ninguna fuente del ecosistema los respalda. La comprobación fue
explícita: cero ocurrencias de «periodicidad», «frecuencia de medición» o «valoración
nutricional» en toda la documentación existente.

Esa ausencia no se resuelve escribiendo más handbooks: los handbooks documentan producto. Se
resuelve con una base de conocimiento científico. Este es su primer volumen.

## Principio rector

> Una afirmación sin fuente verificada no entra. Un vacío documentado sí.

La consecuencia práctica es que esta base contiene menos afirmaciones de las que un texto
escrito de memoria contendría, y que varias fichas dicen principalmente qué *no* se sabe. Esto
es intencionado: los motores que la consumirán necesitan tanto los límites como el contenido.

## Cómo se usa desde un motor

1. Localizar la ficha por su `id` o por `variables_bcs`.
2. Leer **Interpretaciones NO admisibles** antes que ninguna otra sección. Delimita lo que no
   puede afirmarse aunque el dato lo sugiera.
3. Comprobar `nivel_evidencia` y `estado`. Una ficha `pendiente` no respalda ninguna afirmación
   de cara al usuario.
4. Comprobar la **población** de las referencias. Es el error más probable en esta base
   concreta: buena parte de la evidencia disponible sobre bioimpedancia procede de poblaciones
   clínicas (hemodiálisis, oncología, cuidados críticos) y no es trasladable a una persona sana
   que entrena.

## Alcance de la v1.0

Parcial y declarada como tal. El módulo 13 detalla la cobertura real por módulo; el 12, los
vacíos científicos encontrados; el 16, las decisiones de diseño de la base; el 17, el camino
hacia el Knowledge Graph.

## Índice

| Módulo | Contenido |
|---|---|
| 01 | Principios fisiológicos transversales |
| 02 | Modelos de composición corporal |
| 03 | Masa muscular |
| 04 | Masa grasa |
| 05 | Agua corporal y compartimentos |
| 06 | Bioimpedancia — principios, validez y condiciones |
| 07 | Metabolismo basal |
| 08 | Indicadores antropométricos |
| 09 | Patrones de cambio |
| 10 | Relaciones entre variables |
| 11 | Calidad de medición |
| 12 | Limitaciones científicas y vacíos |
| 13 | Marco de evaluación de la evidencia |
| 14 | Glosario |
| 15 | Referencias |
| 16 | ADR de la base |
| 17 | Roadmap a Knowledge Graph |
