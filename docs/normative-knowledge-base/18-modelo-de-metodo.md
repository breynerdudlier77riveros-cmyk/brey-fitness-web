---
modulo: 18
titulo: Modelo de método
estado: congelado
sprint: NKB-2.0
---

# 18 · Modelo de método

El método es una de las cuatro coordenadas de identidad (NKB-ADR-03). Este
módulo define **cuándo dos métodos son el mismo** y qué se registra de cada uno.

## El problema que resuelve

> **Dos pruebas con el mismo nombre no producen necesariamente la misma
> distribución.**

El nombre de una prueba es una etiqueta social; la distribución depende del
procedimiento. Cambiar la posición, el instrumento, el calentamiento o la
superficie puede desplazar toda la distribución sin que el nombre cambie.

Por eso la NKB no identifica métodos por nombre.

---

## Las cuatro relaciones

Entre dos métodos existe exactamente una de estas relaciones. **Ninguna la
decide la NKB por sí misma**: la declara la fuente, o queda como desconocida.

| Código | Relación | Significa | Efecto sobre las normas |
|---|---|---|---|
| **EQ-1** | Equivalentes | Producen la misma distribución; hay evidencia publicada que lo sostiene | Las normas pueden considerarse del mismo método |
| **EQ-2** | Comparables | Producen distribuciones relacionadas de forma conocida y publicada | Las normas son distintas; la relación se registra |
| **EQ-3** | Distintos | No hay evidencia de relación entre sus distribuciones | Las normas son distintas y no se relacionan |
| **EQ-4** | Incompatibles | Hay evidencia publicada de que difieren de forma no reconciliable | Las normas son distintas y se declara la incompatibilidad |

### Regla por defecto

> **Ante la ausencia de evidencia, la relación es EQ-3 (distintos).**

No EQ-1. Suponer equivalencia por defecto permitiría mezclar normas de
procedimientos distintos, que es exactamente el error que este módulo existe
para impedir.

**EQ-1 y EQ-2 exigen fuente que las sostenga**, con los mismos criterios de
admisión que cualquier otra afirmación (`13`). Una equivalencia afirmada sin
respaldo no se registra.

### EQ-3 frente a EQ-4

Se distinguen porque afirman cosas distintas:

- **EQ-3** dice que nadie lo ha estudiado. Es el estado normal.
- **EQ-4** dice que se estudió y difieren. Es un hallazgo, y exige fuente.

Confundirlas convertiría un hueco de conocimiento en una afirmación.

---

## Qué se registra de un método

**Criterio de inclusión de campos:** se registra lo necesario para
**identificar** la norma o para **reproducir** la medición. Nada más.

Un campo que no cambie la distribución ni sirva para distinguir un método de
otro no entra, aunque la fuente lo publique.

| Código | Elemento | Cuándo se registra |
|---|---|---|
| **M-01** | Denominación del método | Siempre, como la fuente la escribe |
| **M-02** | Descripción del procedimiento | Siempre |
| **M-03** | Instrumento | Cuando el instrumento condicione el resultado |
| **M-04** | Posición o disposición | Cuando la fuente la especifique como parte del protocolo |
| **M-05** | Parámetros temporales | Duración, descansos, cadencia, si el protocolo los fija |
| **M-06** | Parámetros de carga o esfuerzo | Cuando el protocolo los fije |
| **M-07** | Parámetros espaciales | Distancia, superficie, altura, si el protocolo los fija |
| **M-08** | Preparación previa | Calentamiento, familiarización, ayuno u otras, si el protocolo las fija |
| **M-09** | Número de intentos y consolidación | Cuántos se hacen y cuál se registra |
| **M-10** | Unidad de salida | Siempre |
| **M-11** | Condiciones ambientales | Cuando la fuente las declare relevantes |

**M-09 se olvida siempre y cambia la distribución.** Una norma construida con el
mejor de tres intentos no es comparable con otra construida con el primero.

## Método insuficientemente descrito

| Situación | Consecuencia |
|---|---|
| Falta la descripción del procedimiento | **No admisible** (CA-05) |
| Falta un parámetro que la fuente declara relevante | No admisible |
| Falta un parámetro cuya relevancia se desconoce | Admisible, con limitación declarada |
| El método se describe por remisión a otra publicación | Admisible si esa publicación es recuperable (`20`) |

La tercera fila es deliberada: exigir todos los parámetros imaginables
rechazaría casi todo. La línea está en lo que **la propia fuente** trata como
parte de su protocolo.

## Instrumento

Se registra cuando condiciona el resultado, no siempre.

**No se evalúa la marca como autoridad.** Que un instrumento sea de un fabricante
concreto no aporta ni resta admisibilidad: lo que importa es si el instrumento
cambia la distribución y si la fuente lo declara (NKB-ADR-06).

Un instrumento distinto **no implica automáticamente método distinto**: implica
relación desconocida, es decir EQ-3, salvo fuente que sostenga otra cosa.

## Prohibiciones

1. **No se declara equivalencia por parecido.** Ni por nombre, ni por
   descripción similar, ni por intuición.
2. **No se convierten valores entre métodos** sin una ecuación publicada y
   verificada; y aun entonces el resultado es un dato derivado (`21`).
3. **No se agrupan normas de métodos distintos** bajo un método genérico.
4. **No se completa un protocolo** con lo que «suele hacerse».

## Lo que este módulo NO decide

- **Ningún método concreto** ni sus parámetros.
- **Ninguna equivalencia concreta** entre métodos.
- **Ninguna lista cerrada** de qué instrumentos condicionan qué variables: es
  materia de cada dominio (`10`, Sprint 3).
