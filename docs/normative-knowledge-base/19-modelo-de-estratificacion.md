---
modulo: 19
titulo: Modelo de estratificación
estado: congelado
sprint: NKB-2.0
---

# 19 · Modelo de estratificación

Cómo se registra una norma que la fuente publica dividida.

## Principio

> La estratificación es **de la fuente**. La NKB la conserva tal como se publicó
> y no la modifica en ninguna dirección.

Ni se agrega, ni se divide, ni se completa. La estratificación es una decisión
metodológica del estudio, y alterarla produce una norma que nadie publicó.

## Estrato como coordenada

El estrato es la cuarta coordenada de identidad. Una norma existe **por
estrato**, no por variable.

Cuando una fuente publica una tabla con doce filas, la NKB almacena **doce
normas** que comparten variable, método y población, y difieren en estrato. No
una norma con doce valores.

Esta decisión tiene una consecuencia práctica que conviene aceptar de entrada:
la base tendrá muchas más entradas de las que parece. Es el precio de que cada
fila sea localizable, auditable y retirable por separado.

## Ejes de estratificación

Los que el modelo debe poder representar. **No es una lista cerrada**: es el
tipo de divisiones que debe admitir.

| Eje | Ejemplo conceptual de división |
|---|---|
| Edad | Franjas etarias declaradas por la fuente |
| Sexo | Las categorías que la fuente use |
| Nivel de práctica | Los niveles que la fuente distinga |
| Disciplina | Cuando la fuente separe por modalidad |
| Método | Cuando la misma fuente publique por procedimiento |
| Contexto | Geográfico, ocupacional u otro que la fuente use |

Y sus combinaciones: edad × sexo, sexo × nivel, edad × método. Una norma
estratificada por dos ejes tiene tantas entradas como celdas publicadas.

## Reglas congeladas

**ST-01 · Los estratos se conservan como los publica la fuente.**
Si publica 18–24, 25–29 y 30–34, se almacenan tres estratos independientes.

**ST-02 · No se colapsan estratos.**
Fundir 18–24 y 25–29 en «18–29» inventa una distribución que la fuente no
publicó, y además exigiría ponderar por N — que casi nunca consta.

**ST-03 · No se interpola entre estratos.**
El valor de alguien de 24 años no se estima entre dos franjas vecinas. Se usa el
estrato al que pertenece, o no se usa.

**ST-04 · No se extrapola fuera de los estratos publicados.**
Si la tabla llega hasta cierta franja, más allá no hay norma.

**ST-05 · Los límites se registran con su criterio de pertenencia.**
Si la fuente no declara si un límite es inclusivo o exclusivo, se registra como
no declarado y se convierte en limitación. Un valor justo en la frontera es el
caso que más silenciosamente se resuelve mal.

**ST-06 · Un estrato sin N declarado sigue siendo un estrato.**
No se descarta por eso; su calidad lo refleja (`16`, V-09).

## Estratos incompletos

| Situación | Tratamiento |
|---|---|
| La fuente publica unas celdas y otras no | Se almacenan las publicadas; las ausentes **no existen** |
| Una celda tiene N muy pequeño y la fuente lo advierte | Se almacena con la advertencia de la fuente |
| La fuente publica un total además de los estratos | Se almacena como estrato adicional «total», declarado como tal |

La última fila importa: el total **no es la suma de los estratos**, es otra
norma con su propia población efectiva. Tratarlo como estrato explícito evita
que alguien lo confunda con un agregado calculado.

## Estratificación y aplicabilidad

Se congela porque su confusión es la más extendida:

> **Que una norma esté estratificada por edad y sexo no la hace aplicable a
> cualquiera de esa edad y ese sexo.**

Sigue siendo aplicable solo a quien pertenezca a su **población**. El estrato
localiza la fila; la población decide si la tabla entera sirve (`17`).

## Prohibiciones

1. **No se crean estratos** que la fuente no publicó.
2. **No se renombran.** Las etiquetas de estrato son de la fuente, como las
   clasificaciones (I-11).
3. **No se armonizan franjas** entre fuentes distintas para poder compararlas.
4. **No se convierte un estrato en continuo** ajustando una función a sus
   valores.

## Lo que este módulo NO decide

- **Ninguna franja concreta**, en ningún eje.
- **Ningún criterio de qué estratificación es preferible.**
- **Ninguna regla para elegir estrato** cuando alguien queda en una frontera: es
  del NIE, y responde por ella.
