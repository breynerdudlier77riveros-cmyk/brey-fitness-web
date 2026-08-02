---
modulo: 11
titulo: Modelo de extensibilidad
estado: congelado
---

# 11 · Modelo de extensibilidad

Cómo crece el sistema sin romper lo ya registrado.

El criterio que gobierna todo este módulo: **añadir nunca invalida un registro existente.** Un
dato tomado bajo las reglas de ayer sigue siendo un dato válido de ayer, aunque las reglas de hoy
sean otras.

## Los cuatro tipos de crecimiento

| Tipo | Qué se añade | Impacto |
|---|---|---|
| **X-A** | Una prueba nueva en una familia existente | Ninguno sobre lo registrado |
| **X-B** | Una familia de prueba nueva | Ninguno sobre lo registrado |
| **X-C** | Una capacidad o subcapacidad nueva | Aparece como *desconocida* en todos los perfiles |
| **X-D** | Una correspondencia prueba→capacidad nueva o revisada | **Cambia perfiles ya emitidos** |

Los tres primeros son aditivos y baratos. El cuarto es el único que reinterpreta el pasado, y por
eso es el único que exige un procedimiento formal.

---

## X-A · Añadir una prueba

Requisitos, todos obligatorios:

1. Ficha completa según la anatomía de `04`.
2. Familia asignada de las ya existentes.
3. Vigencia declarada.
4. **Referencia de la Clinical Knowledge Base para cada capacidad que declare alimentar.**

Sin el cuarto requisito la prueba **entra igualmente al catálogo, pero sin capacidades
asignadas**: puede registrarse y consultarse, y no contribuye a ningún estado. Es una situación
legítima, no un error — evita que el catálogo crezca por intuición y evita a la vez que un dato
real se pierda por falta de respaldo.

## X-B · Añadir una familia

Una familia nueva se justifica cuando un grupo de pruebas **no cabe en ninguna existente sin
distorsionarla**. El precedente ya está sentado: F-I (calistenia) se separó de F-A (fuerza) porque
el peso corporal es a la vez resistencia y sujeto de la medida.

Crear una familia por comodidad organizativa es lo que este requisito impide.

## X-C · Añadir una capacidad

Debe cumplir las cuatro condiciones de admisión de `03` — evaluable, distinguible, independiente
del objetivo, independiente del método.

Efecto inmediato: **aparece como *desconocida* en todos los perfiles**, incluidos los de atletas
con años de historial. Es el comportamiento correcto y no debe corregirse: nunca se evaluó, luego
no se sabe. Rellenarla desde capacidades vecinas violaría el límite L-06.

## X-D · Cambiar una correspondencia

El único cambio que reinterpreta datos ya registrados. Procedimiento congelado:

1. **La correspondencia anterior no se borra.** Se marca como retirada, con fecha y motivo.
2. **La versión de catálogo avanza** (`07`).
3. **Los perfiles se recalculan** en la siguiente consulta, con la versión nueva.
4. **La traza declara qué versión aplicó** — un perfil emitido antes y otro después no son
   directamente comparables, y el sistema debe poder advertirlo.

Retirar una correspondencia puede dejar una capacidad *desconocida* pese a existir registros. Es
correcto: significa que se creía saber algo que la evidencia ya no sostiene.

---

## Lo que la extensibilidad NO permite

| Prohibido | Motivo |
|---|---|
| Modificar un Registro de Prueba existente | Rompe la inmutabilidad (`02`, `07`) |
| Reasignar registros a otra prueba | Falsificaría qué se hizo |
| Eliminar una capacidad del catálogo | Los estados históricos dejarían de tener referente; se **retira**, no se borra |
| Añadir una capacidad derivada de otras | Violaría L-06 y el «un estado no alimenta otro estado» (`02`) |
| Añadir una prueba sin ficha completa | El modelo de elegibilidad no podría evaluarla |
| Introducir puntuaciones o escalas globales | Entidad descartada en `01` |

## Punto de extensión que NO existe

**No hay pruebas definidas por el usuario final.** El catálogo es curado y versionado
centralmente. Permitir pruebas ad hoc convertiría el catálogo en un campo de texto libre y haría
imposible tanto la elegibilidad como la trazabilidad.

Un profesional que necesite registrar algo no catalogado puede hacerlo como **observación de una
evaluación** — dato conservado, sin contribución a ningún estado. Es honesto: el dato se guarda,
y el sistema no finge saber qué significa.
