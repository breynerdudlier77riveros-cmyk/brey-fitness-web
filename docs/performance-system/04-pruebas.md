---
modulo: 04
titulo: Catálogo de pruebas
estado: congelado
---

# 04 · Catálogo de pruebas

Este módulo **clasifica familias de prueba**. No especifica protocolos, no fija instrumentos, no
define métricas y no enumera pruebas concretas.

La distinción es deliberada: **una familia es una categoría de dominio; una prueba concreta es
una afirmación científica.** Decir «existen pruebas de salto» es taxonomía. Decir «el salto
vertical con contramovimiento mide potencia de tren inferior» es una afirmación que requiere
evidencia, y este sprint no las produce.

## Anatomía de una definición de prueba

Toda prueba que se incorpore al catálogo, en cualquier sprint futuro, deberá declarar estos
campos. Congelar la ficha ahora es lo que permitirá añadir pruebas después sin rediseñar el
modelo (ver `11-extensibilidad.md`).

| Campo | Qué declara |
|---|---|
| **Identidad** | Código estable, nombre, familia |
| **Naturaleza del resultado** | Continuo, ordinal, binario o categórico |
| **Requisitos** | Qué necesita para poder realizarse: material, espacio, asistente |
| **Precondiciones del atleta** | Qué debe cumplir el atleta para que la prueba sea aplicable |
| **Condiciones de registro** | Qué debe anotarse sobre cómo se tomó |
| **Vigencia** | Cuánto tiempo el resultado sigue siendo elegible (ver `09`) |
| **Capacidades que alimenta** | Correspondencia N a M, con su fuente de evidencia |
| **Repetibilidad** | Si admite varios intentos y cómo se consolidan |
| **Anulabilidad** | En qué condiciones un registro puede anularse |
| **Referencias** | Claves de la Clinical Knowledge Base que la respaldan |

**Ninguna prueba entra al catálogo con el campo «capacidades que alimenta» sin referencia.** Es
la regla que impide que el catálogo crezca por intuición.

---

## Familias

### F-A · Pruebas de fuerza
Evalúan producción de tensión. Se subdividen por **modo de resistencia** (carga externa, peso
corporal, isométrica) y por **región**.

### F-B · Pruebas de salto
Evalúan producción de fuerza en el tiempo mediante despegue del suelo.

### F-C · Pruebas de agarre
Evalúan producción y mantenimiento de tensión con la mano.

### F-D · Pruebas de carrera y desplazamiento
Evalúan desplazamiento del cuerpo en el espacio: distancia recorrida, tiempo empleado o
capacidad de sostener el desplazamiento.

### F-E · Pruebas de movilidad y flexibilidad
Evalúan rango articular. Se distinguen por **modo** (activo o pasivo), distinción que sostiene la
separación entre las capacidades B-01 y B-02.

### F-F · Pruebas de equilibrio
Evalúan conservación de la posición del centro de masas, en condiciones estáticas o dinámicas.

### F-G · Pruebas de estabilidad y control
Evalúan mantenimiento de una posición articular bajo demanda, o fidelidad de una trayectoria.

### F-H · Pruebas de habilidad y técnica
Evalúan el dominio de un patrón concreto. **Siempre referidas a un patrón nombrado**, que
procede del Master Exercise Dataset y no del PAS.

### F-I · Pruebas de calistenia
Evalúan capacidad con el propio peso corporal. Se declaran como familia propia —y no como caso
de F-A— porque el peso corporal es simultáneamente la resistencia y el sujeto de la medida, lo
que hace que su resultado no sea comparable con el de una carga externa aunque ambos evalúen la
misma capacidad.

### F-J · Pruebas antropométricas
Recogen medidas corporales directas. **Están en el catálogo como contexto, no como evaluación de
capacidad**: una talla o un perímetro no informan de ninguna capacidad funcional por sí mismos.
Ver la nota sobre el BCS más abajo.

### F-K · Pruebas de tolerancia y disponibilidad
**Reservada.** Corresponde a las capacidades F-01 y F-02, pospuestas al Sprint 5. Se declara
ahora para que el espacio exista y nadie ubique estas pruebas dentro de otra familia por falta
de sitio.

---

## Recuento

| Familia | Estado en v1.0 |
|---|---|
| F-A · Fuerza | Activa |
| F-B · Salto | Activa |
| F-C · Agarre | Activa |
| F-D · Carrera y desplazamiento | Activa |
| F-E · Movilidad y flexibilidad | Activa |
| F-F · Equilibrio | Activa |
| F-G · Estabilidad y control | Activa |
| F-H · Habilidad y técnica | Activa |
| F-I · Calistenia | Activa |
| F-J · Antropometría | Activa, **solo como contexto** |
| F-K · Tolerancia y disponibilidad | **Reservada — Sprint 5** |
| **Total** | **11 familias** |

---

## Relación con el BCS — frontera explícita

La familia F-J roza el territorio del Body Composition System, y la frontera debe quedar fijada
antes de que alguien la cruce:

| Corresponde al BCS | Corresponde al PAS (F-J) |
|---|---|
| Composición corporal completa por bioimpedancia | Medidas antropométricas tomadas **durante una evaluación funcional** |
| Sujeto: Cliente del entrenador | Sujeto: Atleta |
| Salida: Reporte de composición corporal | Salida: contexto de un Registro de Prueba |

**El PAS no duplica el BCS ni lo consulta en v1.0.** Si un atleta tiene además mediciones de
composición corporal, esa correspondencia se resuelve fuera de ambos sistemas
(`12-integracion-futura.md`). Registrar una talla en el PAS porque una prueba la necesita **no
es** hacer composición corporal.

---

## Lo que este catálogo NO decide

- **Ninguna prueba concreta.** Ni una sola, en ninguna familia.
- **Ningún protocolo.** Ni posiciones, ni intentos, ni instrumentos.
- **Ninguna correspondencia con capacidades.** Materia del Sprint 3.
- **Ninguna vigencia.** El campo existe; su valor por familia se decide con evidencia.
- **Ningún criterio de calidad de ejecución.** Qué invalida un intento es parte de cada
  protocolo, no de la taxonomía.
