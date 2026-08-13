---
modulo: 27
titulo: Dominio seleccionado
estado: v1.0
sprint: NKB-3.0
---

# 27 · Dominio seleccionado

La elección se hizo **después** de congelar los criterios (`13`–`26`) y contra el
criterio escrito en `10`: madurez de la literatura normativa, nunca conveniencia
de producto.

## Los tres candidatos

Evaluados con búsqueda real de literatura antes de decidir.

### Candidato A · Fuerza de prensión manual

| | |
|---|---|
| **Variables potenciales** | Fuerza máxima de prensión |
| **Literatura localizada** | Alta: estudios poblacionales nacionales en varios países, revisión de normas internacionales sobre millones de personas |
| **Calidad esperable** | Alta: paneles nacionales representativos, cohortes de gran tamaño |
| **Claridad metodológica** | Media-alta. El protocolo está descrito, pero **el modelo de dinamómetro varía entre estudios** y eso condiciona la comparabilidad |
| **Diversidad poblacional** | Alta: general, mayores, adolescentes, varios países |
| **Percentiles / rangos / cortes** | Presentes los tres, y con frecuencia mezclados |
| **Riesgos** | Que la variedad de dinamómetros invite a fusionar normas incomparables |
| **Dificultad de admisión** | Media |
| **Por qué sería buen primer dominio** | Sus problemas son exactamente los que la arquitectura debe resolver: métodos que difieren, umbrales presentados como normas, y poblaciones nacionales no intercambiables |

### Candidato B · Aptitud cardiorrespiratoria medida directamente

| | |
|---|---|
| **Variables potenciales** | Consumo máximo de oxígeno |
| **Literatura localizada** | Alta y concentrada: un registro internacional publica estándares de referencia con percentiles por década y sexo |
| **Calidad esperable** | Alta |
| **Claridad metodológica** | Alta, con una distinción limpia entre ergómetros que ejercitaría bien las reglas de método |
| **Diversidad poblacional** | Media: el registro procede de contextos de derivación clínica y laboratorios, no de muestreo poblacional |
| **Percentiles** | Sí, explícitos |
| **Riesgos** | **Las fuentes primarias son de acceso restringido.** Las tablas no pueden leerse; solo el resumen |
| **Dificultad de admisión** | **Alta por acceso**, no por calidad |
| **Por qué sería buen primer dominio** | Lo sería si las tablas fueran legibles |

### Candidato C · Composición corporal por absorciometría

| | |
|---|---|
| **Variables potenciales** | Porcentaje de grasa, masa magra, grasa visceral |
| **Literatura localizada** | Abundante, con varias fuentes de acceso abierto |
| **Calidad esperable** | Media-alta |
| **Claridad metodológica** | **Baja en el sentido que importa aquí:** los valores dependen del equipo y del software, hasta el punto de que las normas publicadas se declaran para un fabricante concreto |
| **Diversidad poblacional** | Alta |
| **Percentiles** | Sí |
| **Riesgos** | **Alto.** Toda norma queda atada a un equipo; el terreno está poblado de valores de fabricante y el vocabulario de «normalidad» es omnipresente |
| **Dificultad de admisión** | Alta |
| **Por qué sería buen primer dominio** | No lo sería: estrenar la base con un dominio donde casi toda norma es específica de un aparato obligaría a decidir sobre NKB-ADR-06 en la primera semana |

---

## Selección · Candidato A

**Fuerza de prensión manual.**

### Por qué

| Criterio de `10` | Cómo lo satisface |
|---|---|
| **A · Madurez de la literatura** | Estudios poblacionales nacionales con tablas normativas publicadas |
| **B · Estudios poblacionales adecuados** | Paneles representativos con criterios de inclusión explícitos |
| **C · Claridad del método** | Descrito en las fuentes; su variación entre estudios está documentada |
| **D · Poblaciones identificables** | Nacionales, con criterios y no solo etiquetas |
| **E · Distribuciones explícitas** | Medias, dispersiones, medianas y umbrales, cada uno con su naturaleza |
| **F · Trazabilidad a primarias** | Los estudios publican sus propios datos; no hay que remontar cadenas |
| **G · Aplicabilidad de CN-01…CN-40** | Todos los campos obligatorios son verificables en las fuentes localizadas |
| **H · Diversidad para probar el modelo** | La decisiva. Ver abajo |

### El criterio que decidió: verificabilidad de los valores

Se añade a los ocho anteriores, y en este sprint fue el más discriminante:

> **Una norma no puede admitirse si sus valores no pueden leerse.**

CN-10 exige los estadísticos publicados y CN-26 su ubicación exacta. Con una
fuente de acceso restringido, transcribir desde el resumen o desde una fuente
que la reproduce sería exactamente lo que `20` prohíbe.

El candidato B cayó por esto, **no por calidad**. Es una limitación de nuestro
acceso, no de la evidencia, y así queda registrada.

### Por qué NO se eligió el que tenía más datos

El candidato C ofrece más variables y más fuentes abiertas. Se descartó porque
sus normas están atadas a un equipo concreto: el primer dominio habría obligado
a decidir sobre normas de fabricante antes de tener ningún precedente que
defender, que es la peor situación posible para sostener NKB-ADR-06.

### Lo que este dominio pone a prueba

Se eligió porque **falla de las formas interesantes**:

1. Dinamómetros distintos entre estudios → obliga a aplicar EQ-3 por defecto.
2. Umbrales de aspecto clínico junto a distribuciones descriptivas → obliga a
   separar TN-1 de TN-5.
3. Tablas tituladas «valores normativos de referencia» que bajo el contrato no
   constituyen norma → obliga a rechazar lo que parece admisible.
4. Poblaciones nacionales → obliga a no extrapolar.

Los cuatro ocurrieron. Están documentados en `28`.

## Alcance del sprint

**Una variable, un método, una población.** No se buscó cobertura: se buscó
demostrar que el procedimiento discrimina.

Las fuentes localizadas y no evaluadas quedan registradas como **no
verificadas**, nunca como ausencia de evidencia (I-14).
