---
modulo: 17
titulo: Modelo de población
estado: congelado
sprint: NKB-2.0
---

# 17 · Modelo de población

Cómo se registra la población de una norma y cuándo es admisible. Desarrolla
`03` sin redefinirlo.

## Regla de registro

> Una población se registra por sus **criterios**, y su etiqueta se conserva
> como la escribió la fuente.

Se guardan las dos cosas y no se sustituye una por la otra: la etiqueta permite
reconocer la norma; los criterios deciden a quién es aplicable.

## Descriptores

Los que el registro debe poder recoger. **Ninguno es obligatorio por sí mismo**:
lo obligatorio es que consten los que la fuente usó como criterio (CN-13).

| Código | Descriptor | Cuándo es obligatorio |
|---|---|---|
| **P-01** | Edad o rango etario | Si la fuente lo usa como criterio o estrato |
| **P-02** | Sexo | Igual |
| **P-03** | Nivel de práctica física | Si la población se define por él |
| **P-04** | Disciplina | Si la población se restringe a una |
| **P-05** | Nivel competitivo | Si distingue dentro de la práctica |
| **P-06** | Estado de salud | Si la población es clínica o excluye patología |
| **P-07** | Contexto geográfico | Si la fuente lo declara relevante |
| **P-08** | Contexto temporal | Cuando la recogida de datos sea lejana o esté fechada |
| **P-09** | Contexto ocupacional | Si la población se selecciona por actividad laboral |

**P-08 no implica caducidad.** Registrar cuándo se tomaron los datos permite a
un consumidor juzgar; no autoriza a retirar la norma (NKB-ADR-08).

## Criterios de inclusión y exclusión

| | Inclusión | Exclusión |
|---|---|---|
| **Define** | Quién entró en la muestra | Quién quedó fuera deliberadamente |
| **Obligatorio** | Sí (CA-06) | Cuando la fuente los declare |
| **Sin ellos** | La norma no es admisible | Se declara que no constan |

Los de exclusión importan más de lo que parece: una población «adultos sanos»
que excluyó a quien tomaba cierta medicación describe un grupo distinto de otra
que no excluyó a nadie, aunque ambas usen la misma etiqueta.

## Admisibilidad de una población

Una población es admisible cuando permite responder: **¿pertenece esta persona a
ella, sí o no?**

| Situación | Admisible |
|---|---|
| Criterios explícitos y comprobables | Sí |
| Criterios explícitos pero no comprobables en la práctica | Sí, con limitación declarada |
| Solo etiqueta | **No** (CA-06) |
| Criterios contradictorios entre sí | **No** |
| Población agregada sin declarar qué agregó | **No** |

La tercera fila es la que más fuentes detiene, y es correcto que lo haga: si no
puede decidirse la pertenencia, la norma no puede aplicarse a nadie sin
suponer.

## Prohibiciones

**1 · No se mezclan poblaciones.** Ni para fabricar una norma más amplia, ni
para cubrir un hueco, ni para «tener algo».

**2 · No se promedia entre estudios.** Un promedio de distribuciones de
poblaciones distintas no describe a ninguna.

**3 · No se infiere pertenencia.** Que alguien «se parezca» a la población de
una norma no es asunto de la NKB (I-09).

**4 · No se estrecha ni se amplía una población.** Si una fuente estudió un
grupo, la norma es de ese grupo. Usarla sobre uno más amplio es extrapolar;
sobre uno más estrecho, suponer homogeneidad interna que la fuente no demostró.

## Sexo y edad

Se congela porque su tratamiento incorrecto es sistemático:

> **Sexo y edad son estratos, no poblaciones**, salvo que el estudio los use
> como criterio de inclusión.

Una norma en mujeres deportistas de una disciplina no es «la norma de mujeres».
Tratar un estrato como población haría creer que aplica a cualquiera que
comparta esa característica.

## Población de referencia frente a población objetivo

| Población de referencia | Población objetivo |
|---|---|
| De la que se tomaron los datos | Aquella a la que alguien quiere aplicar la norma |
| La declara la fuente | La determina el consumidor |
| Vive en la NKB | Vive en el NIE |

La NKB registra solo la primera. Comprobar si la segunda encaja en la primera es
del NIE, y responde por ello (I-09).

## Lo que este módulo NO decide

- **Ninguna población concreta**, ni sus umbrales de edad, ni sus categorías.
- **Ninguna equivalencia** entre poblaciones de fuentes distintas.
- **Ningún criterio de proximidad** para aplicar una norma fuera de su población.
