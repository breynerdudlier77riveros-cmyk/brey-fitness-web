---
modulo: 05
titulo: Limitaciones y roadmap
sprint: NIE-1.4
---

# 05 · Limitaciones y roadmap

## Lo que el NIE no puede hacer todavía

| No puede | Por qué |
|---|---|
| Situar un valor en la distribución | Es la etapa 4, y no está construida |
| Calcular percentiles, z o T | Ídem |
| Clasificar a nadie | No hay TN-5 ni TN-7 admisibles en la NKB (`41`) |
| Convertir unidades | La capa de conversión no existe |
| Elegir entre varias normas aplicables | Es una decisión externa que debe declararse |
| Recomendar nada | Fuera del alcance del NIE por completo |

## Lo que no podrá hacer nunca

| Nunca | Invariante |
|---|---|
| Recibir el valor medido del sujeto | I-01 |
| Descubrir un conflicto científico | I-17 |
| Ordenar candidatas por mérito | I-11 |
| Asumir equivalencia entre instrumentos | I-13 |

---

## Limitaciones heredadas de la NKB

El motor no puede ser mejor que la evidencia que consume:

- **Ninguna norma de calidad Alta**, en cinco sprints de NKB.
- **Ningún punto de corte admisible** para esta variable.
- **Una sola variable**: fuerza de prensión manual.
- **Colombia sin norma por encima de 70 años.**
- **Las dos fichas alemanas no declaran su posición corporal**, de modo que
  nunca darán MATCH en esa dimensión.
- **156 normas brasileñas sin N por celda**, porque la fuente no lo publica.

Ninguna de estas se resuelve en el NIE. Se resuelven, si acaso, consiguiendo
acceso a las fuentes bloqueadas (`34`, parte IV).

---

## Una limitación del adaptador

`coordenadas.ts` declara las coordenadas de identidad de las 15 fichas a mano.
Si mañana la NKB añade una ficha, **el adaptador no la verá hasta que se
declare**, y el recuento de `cargador.test.ts` fallará.

Es deliberado: es preferible un test rojo a que una norma nueva entre sin que
nadie haya comprobado sus coordenadas. Pero conviene saberlo.

---

## Roadmap

### NIE-1.5 · Capa de conversión de unidades

**Separada y explícita.** Debe declarar el factor, el redondeo y si la magnitud
es realmente la misma. Nunca dentro del motor de resolución, y nunca dentro de
la NKB.

Requisito previo: decidir si kg y kgf se tratan como equivalentes. Hoy no lo
son, por decisión de `39`.

### NIE-2 · Posición normativa

La etapa 4. Solo entonces el sistema recibe el valor medido, y lo recibe **en
otro módulo**: el contexto de resolución seguirá sin admitirlo.

Requisitos: qué hacer con varias normas aplicables, qué hacer con una ES-2, y
qué mostrar cuando la celda tiene 10 personas.

### NIE-3 · Presentación

Cómo se muestra un resultado sin norma aplicable sin que parezca un fallo del
sistema. Es más difícil de lo que suena y no debe improvisarse en la UI.

### Fuera del roadmap, permanentemente

| No se hará | Motivo |
|---|---|
| Elegir la mejor norma | I-11 |
| Puntuación compuesta de calidad y aplicabilidad | `38` |
| Clasificar sin TN-5 ni TN-7 admisibles | `41` |
| Resolver conflictos científicos | `22` |
