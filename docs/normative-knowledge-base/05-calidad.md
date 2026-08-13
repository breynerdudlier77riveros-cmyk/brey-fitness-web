---
modulo: 05
titulo: Calidad normativa
estado: congelado
---

# 05 · Calidad normativa

La **estructura** con la que se gradúa una norma. Este sprint no inventa una
escala nueva ni fija los criterios de cada nivel: congela qué dimensiones
determinan la calidad y cómo viaja con la norma.

## Qué se gradúa

No la variable, ni la fuente en abstracto: **la norma concreta**.

Una misma publicación puede aportar una norma sólida para un estrato y otra
débil para otro —porque en ese estrato tenía cuarenta personas—. La calidad se
declara por norma, nunca por documento.

## Las seis dimensiones

Las que determinan cuánto respalda una referencia a la norma que sostiene.

| # | Dimensión | Qué pregunta |
|---|---|---|
| **D-01** | Representatividad | ¿La muestra representa a la población que dice representar, o es una muestra de conveniencia? |
| **D-02** | Tamaño por estrato | ¿Cuántas personas hay **en la celda concreta**, no en el estudio entero? |
| **D-03** | Método descrito | ¿Puede reproducirse la medición con lo que la fuente publica? |
| **D-04** | Definición de la población | ¿Constan los criterios de inclusión, o solo una etiqueta? |
| **D-05** | Estadística reportada | ¿Publica lo necesario para usar la norma, incluida la forma de la distribución? |
| **D-06** | Naturaleza de la fuente | ¿Revisada por pares, oficial, o ninguna de las dos? |

**D-02 es la que más normas degrada y la que menos se mira.** Un estudio de
cinco mil personas puede tener doce en la franja que a alguien le interesa, y la
norma de esa celda vale lo que valen esas doce.

## Escala

Se adopta la del ecosistema, ya en uso en la Clinical Knowledge Base y en la
PKB. Reutilizarla no es inventar: es no crear un tercer vocabulario para lo
mismo.

**Alta · Moderada · Baja · Muy baja · Insuficiente**

**Los criterios que sitúan una norma en cada nivel se fijan en el Sprint 2**,
cuando existan normas reales que graduar. Definirlos ahora, en abstracto,
produciría umbrales elegidos por comodidad y no por lo que la evidencia
disponible permita distinguir.

## Degradación

Una norma **baja de nivel** cuando concurre alguna de estas situaciones. El
listado se congela ahora; su peso relativo, no.

1. La muestra del estrato es pequeña (D-02).
2. La muestra es de conveniencia y la norma se presenta como poblacional (D-01).
3. El método no permite reproducir la medición (D-03).
4. La población se identifica solo por etiqueta (D-04).
5. La fuente no declara la forma de la distribución y publica media y dispersión.
6. La fuente no es revisada por pares ni oficial (D-06).

## «Insuficiente» no es «inexistente»

Distinción que se congela porque su confusión produce afirmaciones falsas:

| Estado | Significa |
|---|---|
| **Insuficiente** | Hay fuente, y no alcanza para sostener la norma |
| **Sin norma admisible** | Se buscó y no se localizó ninguna fuente aceptable |
| **No verificado** | No se ha buscado todavía |

Las tres se registran distinto y ninguna es sustituible por otra. La tercera
afirma algo sobre **nuestro trabajo**, no sobre el mundo, y confundirla con la
segunda convertiría un límite del sprint en una afirmación científica falsa.

Es la misma distinción que la PKB congela entre *vacío científico* y *deuda de
búsqueda*.

## La calidad viaja con la norma

Una norma nunca se publica sin su nivel. Un consumidor que reciba el valor sin
saber cuánto lo respalda lo tratará como si lo respaldara todo.

Corolario: **no existe una vista «solo las normas buenas»**. Filtrar por calidad
al entregar permitiría a un motor ignorar que lo que usa es débil.

## Lo que este módulo NO decide

- **Ningún criterio numérico.** Ni tamaños mínimos, ni umbrales por nivel.
- **Ninguna ponderación entre dimensiones.** Cuál pesa más es materia del
  Sprint 2, con normas reales delante.
- **Ningún nivel concreto para ninguna norma.** No hay normas todavía.
