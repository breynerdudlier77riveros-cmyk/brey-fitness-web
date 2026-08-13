---
modulo: 36
titulo: Contrato de consumo para el NIE
estado: v1.0
sprint: NKB-3.5
---

# 36 · Contrato de consumo para el NIE

Documento **conceptual**. No define código, ni esquema, ni API, ni tipos. Define
**qué información puede pedirse a la NKB y qué obliga a devolver**.

---

## La regla que ordena todo el contrato

> **El NIE nunca recibe un número.**
>
> Recibe: **valor + contexto + evidencia + calidad + limitaciones + trazabilidad.**

Un percentil sin su población, su instrumento, su n de celda y su estado es
formalmente correcto y materialmente engañoso. El contrato existe para que esa
entrega sea imposible.

### Corolario

**No existe una consulta que devuelva solo el valor.** Si algún consumidor
quisiera únicamente el número, tendría que descartar explícitamente el resto, y
esa decisión quedaría en su código, no oculta en la biblioteca.

---

## Entrada conceptual

Lo que el NIE aporta al consultar:

| Campo | Obligatorio | Notas |
|---|---|---|
| **Variable** | Sí | Debe nombrarse como la nombra la NKB |
| **Método de medición** | Sí | Instrumento, posición, intentos, consolidación |
| **Unidad de la medición** | Sí | Sin ella no puede compararse con CN-06 |
| **Características del sujeto** | Sí | Edad, sexo y las que el estrato requiera |
| **Población de pertenencia** | Sí | País, marco poblacional, condición declarada |
| **Estrato buscado** | No | Si se omite, la NKB devuelve todos los compatibles |

### Lo que el NIE NO envía nunca

- **El valor medido de la persona.** La NKB no lo necesita y no debe conocerlo
  (I-02). Buscar la norma y situar el valor son dos operaciones, y la segunda no
  ocurre aquí.
- Identificadores de persona, historial ni contexto clínico.

> Si la NKB recibiera el valor, podría calcular la posición. Y en cuanto pudiera,
> alguien haría que lo hiciera.

---

## Salida conceptual

Para **cada** candidata, los diecinueve campos. Ninguno es opcional; los que no
apliquen se devuelven declarados como tales, nunca vacíos ni omitidos.

| # | Campo | Origen | Qué permite al NIE |
|---|---|---|---|
| 1 | **norma_id** | Id de la fila | Referirse a una norma concreta y auditar después |
| 2 | **variable** | CN-01 | Confirmar que se midió lo mismo |
| 3 | **metodo** | CN-03 · CN-07 · CN-08 · CN-02 | Instrumento, posición, intentos, consolidación |
| 4 | **poblacion** | CN-04 · CN-13 · CN-14 · CN-20 | Comprobar pertenencia |
| 5 | **estrato** | CN-05 · CN-17 · CN-18 | Localizar la celda |
| 6 | **tipo** | CN-09 | Percentiles, media y dispersión, corte… |
| 7 | **unidad** | CN-06 | Detectar desigualdad de unidad |
| 8 | **valores_normativos** | Fila de la ficha | Los estadísticos publicados, y **solo** esos |
| 9 | **n_celda** | CN-15 | Cuánta evidencia sostiene **esa celda** |
| 10 | **calidad** | CN-29 | Alta / Moderada / Baja / Muy baja |
| 11 | **dimension_degradante** | CN-30 | **Por qué** esa calidad |
| 12 | **estado** | CN-27 | ES-1 a ES-5 |
| 13 | **aplicabilidad_documental** | CN-34 | Dónde declaró la fuente que aplica |
| 14 | **limitaciones** | CN-32 · CN-33 | De la fuente y añadidas |
| 15 | **restricciones** | CN-13 · CN-14 | A quién excluyó el estudio |
| 16 | **referencia_primaria** | CN-21 · CN-22 | Publicación e identificador |
| 17 | **origen_del_valor** | CN-26 · CN-35 | Tabla, columna y si es explícito o derivado |
| 18 | **advertencias** | Sección de anomalías + límites | Lo que no puede afirmarse con esa norma |
| 19 | **conflicto** | CN-39 | Si hay objeción o discrepancia registrada |

### Cinco campos que suelen olvidarse y aquí son obligatorios

| Campo | Sin él ocurre |
|---|---|
| **n_celda** | Un P90 estimado sobre 10 personas se presenta como un P90 |
| **dimension_degradante** | «Calidad Baja» no se puede explicar a nadie |
| **estado** | Una norma cuestionada se usa como si no lo estuviera |
| **origen_del_valor** | Un percentil proyectado se confunde con uno observado |
| **advertencias** | Las anomalías de la fuente desaparecen en el camino |

### Sobre **valores_normativos**

Contiene **exactamente los estadísticos que la fuente publica**. Nunca:

- percentiles calculados a partir de L, M y S publicados;
- percentiles derivados de media y desviación típica;
- valores convertidos de unidad;
- valores interpolados entre celdas o entre edades;
- promedios entre normas.

### Nota de notación

Los diecinueve nombres van **en negrita, nunca entre comillas simples**.

En toda la NKB, un identificador en minúsculas con guiones bajos escrito entre
comillas simples es una **clave del registro de referencias**, y la auditoría de
trazabilidad lo comprueba mecánicamente: cada uno debe existir en el YAML.

Escribir así los nombres de este contrato crearía un segundo espacio de nombres
con la misma notación, y la auditoría los marcaría como referencias colgantes.
**Ocurrió** en el primer borrador de este módulo, y la comprobación lo detectó.

> Una convención tipográfica que una herramienta usa para verificar no puede
> reutilizarse para otra cosa. El coste de romperla no es estético: es que la
> comprobación deja de significar algo.

---

## Estados de consumo

Los ocho de `38`. Se repiten aquí porque son parte del contrato:

**CANDIDATA · APLICABLE · APLICABLE_CON_RESERVAS · NO_APLICABLE ·
NO_DETERMINABLE · CONFLICTO · CONFLICTO_NO_DETERMINABLE · SIN_NORMA_ADMISIBLE**

| Determina la NKB | Determina el NIE |
|---|---|
| CONFLICTO · CONFLICTO_NO_DETERMINABLE · SIN_NORMA_ADMISIBLE | CANDIDATA · APLICABLE · APLICABLE_CON_RESERVAS · NO_APLICABLE · NO_DETERMINABLE |

**Ninguno significa diagnóstico.** Ninguno ordena las candidatas.

### Cuándo corresponde APLICABLE_CON_RESERVAS

Cuando se cumplen todas las condiciones **y** concurre alguna de estas, que el
NIE puede detectar con los campos anteriores:

- **calidad** es Baja o Muy baja;
- **estado** es ES-2 · Cuestionada;
- **n_celda** es pequeño **según lo que la propia fuente sostenga**, o no consta;
- **origen_del_valor** indica proyección o suavizado;
- **advertencias** contiene anomalías que afectan a la celda usada.

**No hay umbral de n.** La NKB entrega el número; el NIE decide qué hacer con
él y responde por esa decisión.

---

## La regla crítica

> ## «No tengo norma aplicable» NUNCA significa «el sujeto está fuera de lo normal».

Son afirmaciones sobre cosas distintas: la primera habla de **nuestra
evidencia**; la segunda, de **una persona**.

| El NIE debe poder devolver | Y jamás convertirlo en |
|---|---|
| «No existe norma admisible con la evidencia disponible» | «El resultado es anormal» |
| «Existe norma, pero no corresponde a esta persona» | «El resultado es bajo» |
| «Existe norma, pero se midió con otro instrumento» | «No se puede confiar en la persona» |
| «Existe norma, y la sostienen 10 personas» | «El resultado es preciso» |
| «Existe norma, y hay otra publicada que discrepa» | Elegir la que dé mejor resultado |

**El silencio es un resultado válido de primera clase.** Un motor que siempre
devuelve una posición normativa está fabricando algunas.

### Por qué esta regla necesita estar escrita

Porque la presión irá siempre en la misma dirección: una barra vacía en una
pantalla parece un fallo del sistema. No lo es. Es la representación honesta de
que la evidencia no alcanza.

---

## Lo que la NKB NO hará nunca por el NIE

| No hará | Por qué |
|---|---|
| Elegir la mejor norma | Es aplicar (I-09) |
| Ordenar candidatas por calidad, recencia o tamaño | Sería elegir con otro nombre |
| Convertir unidades | `39` |
| Calcular percentiles no publicados | `21` |
| Derivar z ni T | Ídem |
| Resolver un conflicto | `22` |
| Clasificar un valor | No hay TN-5 ni TN-7 admisibles (`41`) |
| Recibir el valor medido de una persona | I-02 |
| Filtrar por calidad al entregar | `05` |

---

## Qué falta para que el NIE se construya

Este sprint deja el contrato definido. **No deja el NIE listo.** Falta, y es del
NIE, no de la NKB:

| Pendiente | De quién | Estado |
|---|---|---|
| Reglas de correspondencia entre un sujeto y una población | **NIE** | Resuelto · NIE-1.1 + 1.2 |
| Reglas de correspondencia entre una medición y un método | **NIE** | Resuelto · NIE-1.1 + 1.2 |
| Qué hacer con varias candidatas aplicables | **NIE** | Resuelto · NIE-1.6 + 1.8 · **devolverlas todas** |
| Qué hacer con una candidata ES-2 | **NIE** | Resuelto · NIE-1.6 · comparar y propagar la objeción |
| Umbral —si es que quiere alguno— para tratar un n como pequeño | **NIE**, y deberá justificarlo | Respondido · **ninguno**, y se declara |
| Capa explícita de conversión de unidades | **Fuera de la NKB** | Construida · NIE-1.5 · un solo par autorizado |
| Presentación de resultados sin norma aplicable | **NIE** | Resuelto · NIE-1.8 · «sin norma» ≠ «no aplica» |

**La NKB no opina sobre ninguna de estas siete.** Solo garantiza que el NIE
tendrá la información para resolverlas sin adivinar.

> La columna de estado se añadió en NIE-1.9 al auditar este contrato. Es
> estrictamente documental: registra dónde se resolvió cada punto, y no cambia
> ninguna doctrina, ningún campo ni ninguna norma. El detalle vive en el NIE, no
> aquí — la NKB sigue sin opinar sobre las siete.
