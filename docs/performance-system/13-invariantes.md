---
modulo: 13
titulo: Invariantes
estado: congelado
---

# 13 · Invariantes

Reglas que **nunca** podrán romperse, en ninguna versión, por ninguna razón de conveniencia.

Cada invariante indica qué lo rompería en la práctica. Ese es su valor real: un principio que no
puede violarse de forma concreta es decorativo. Si alguna vez una de estas reglas estorba, la
respuesta correcta es revisar la decisión de diseño que la hace estorbar — nunca hacer una
excepción.

---

**I-01 · Un Registro de Prueba es inmutable.**
Se corrige anulando y creando uno nuevo.
*Lo rompería:* una edición en sitio «para arreglar un typo en el valor».
*Nace en:* `02`, `07`.

**I-02 · Nada se borra.**
Un registro anulado deja de ser elegible; no deja de haber ocurrido.
*Lo rompería:* purgar registros anulados para «limpiar» el histórico.
*Nace en:* `02`, `10`.

**I-03 · Lo derivado nunca es fuente.**
Estados, perfiles, trazas y limitaciones se recalculan siempre. Persistirlos es admisible como
caché o copia fechada, jamás como origen del dato.
*Lo rompería:* leer un perfil guardado en lugar de recalcularlo, por rendimiento.
*Nace en:* `02`, `07`.

**I-04 · Un estado no alimenta otro estado.**
Toda derivación parte de Registros de Prueba, nunca de otra derivación.
*Lo rompería:* estimar potencia a partir del estado de fuerza máxima.
*Nace en:* `02`, `05`.

**I-05 · Sin traza no hay estado.**
Un Estado de Capacidad sin traza no se emite. No es un estado incompleto: no es un estado.
*Lo rompería:* emitir un estado «rápido» sin traza para una vista resumida.
*Nace en:* `08` (TR-01).

**I-06 · Una capacidad sin prueba elegible es *desconocida*.**
Nunca promedio, nunca estimada, nunca por defecto, nunca inferida desde otra capacidad.
*Lo rompería:* rellenar huecos del perfil para que «se vea completo».
*Nace en:* `00` (L-06), `10`.

**I-07 · Ninguna ambigüedad se resuelve por criterio interno.**
Un conflicto se declara conflicto; un empate, empate. No se elige el más reciente, ni el mejor, ni
el promedio.
*Lo rompería:* un desempate por fecha «porque hay que devolver algo».
*Nace en:* `10`.

**I-08 · Ningún consumidor lee Registros de Prueba directamente.**
La única salida del PAS es el Perfil Funcional.
*Lo rompería:* un panel de analítica consultando registros crudos para agregar más rápido.
*Nace en:* `05`, `12`.

**I-09 · El perfil se entrega completo, con sus limitaciones.**
No existe una vista «solo lo evaluado».
*Lo rompería:* un filtro que oculte capacidades desconocidas para simplificar una pantalla.
*Nace en:* `05`.

**I-10 · Toda correspondencia prueba→capacidad lleva referencia verificable.**
Una prueba sin respaldo puede registrarse; no contribuye a ningún estado.
*Lo rompería:* asignar capacidades a una prueba nueva «porque es evidente».
*Nace en:* `04`, `05`, `11`.

**I-11 · Todo perfil declara con qué versiones se calculó.**
Registros, catálogo y motor. Dos perfiles con versiones distintas no son directamente
comparables, y el sistema debe poder advertirlo.
*Lo rompería:* comparar perfiles de distintas épocas sin comprobar versión.
*Nace en:* `07`, `08`.

**I-12 · El PAS no decide contenido.**
Ni qué entrenar, ni cuánto, ni cuándo, ni qué comer, ni cuándo reevaluar.
*Lo rompería:* una recomendación añadida al perfil «porque el dato ya está ahí».
*Nace en:* `00` (L-01).

**I-13 · El PAS no compara atletas entre sí ni proyecta.**
Su unidad de análisis es un atleta consigo mismo a lo largo del tiempo.
*Lo rompería:* un percentil frente a otros usuarios; una estimación de cuándo se alcanzará un
valor.
*Nace en:* `00` (L-04, L-05).

---

## Los tres que más presión recibirán

No todos los invariantes corren el mismo riesgo. Estos tres se romperán por motivos que en el
momento parecerán razonables:

| Invariante | Presión que recibirá | Por qué hay que resistirla |
|---|---|---|
| **I-06** — desconocida es desconocida | «El perfil se ve vacío» | Un perfil vacío es información verdadera; uno relleno es información falsa |
| **I-07** — no se resuelve por criterio | «Hay que devolver un valor» | Un valor desempatado a ciegas es indistinguible de uno decidido |
| **I-03** — lo derivado nunca es fuente | Rendimiento | Un perfil obsoleto servido como actual es el peor fallo posible del sistema |

## Relación con el resto del ecosistema

Estos invariantes no inventan principios: son la expresión, dentro del PAS, de reglas que el
ecosistema ya aplica —inmutabilidad y anulación en el BCS, «solo datos verdaderos» (P16),
trazabilidad obligatoria en los motores de recomendación y observación—. Un sistema nuevo que
contradijera esas reglas obligaría a mantener dos criterios de honestidad distintos según qué
pantalla mire el usuario.
