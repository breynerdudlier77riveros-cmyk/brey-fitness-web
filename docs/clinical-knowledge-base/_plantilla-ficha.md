# Plantilla de ficha — estructura obligatoria

Toda ficha de la CKB usa exactamente esta estructura. La homogeneidad no es estética: es lo que
permitirá extraer nodos y aristas de forma mecánica cuando la base se convierta en Knowledge
Graph (módulo 17).

Copiar el bloque completo. No omitir secciones: una sección sin contenido se marca
explícitamente como `Sin evidencia verificada en v1.0`, que es información útil.

---

```markdown
### <Nombre del concepto o variable>

<!-- Metadatos legibles por máquina. Claves fijas. -->
```yaml
id: <identificador-kebab-case>
tipo: variable | fenomeno | patron | metodo | indicador
variables_bcs: [<claves del catálogo BCS que le corresponden, si aplica>]
nivel_evidencia: alto | moderado | bajo | insuficiente
referencias: [<claves de _evidencia/referencias.yaml>]
estado: verificado | pendiente
```

**Definición.**
Qué es, en una frase. Sin metáforas y sin juicio de valor.

**Fundamento fisiológico.**
Por qué ocurre y cuál es el mecanismo. Si el mecanismo está en discusión, decirlo.

**Cambios esperables.**
Qué se observa habitualmente y en qué dirección, según la evidencia citada.

**Cambios inesperados.**
Qué observación contradice lo anterior y qué suele explicarla — incluido el error de medición.

**Relaciones conocidas.**
Qué otras variables se mueven junto con esta, y si la relación es causal, derivada o solo
concurrente. Distinguirlo es obligatorio.

**Factores de confusión.**
Qué puede producir el mismo dato sin que haya ocurrido el fenómeno: hidratación, hora del día,
comida reciente, ejercicio previo, ciclo menstrual, dispositivo distinto.

**Nivel de evidencia.**
Justificar el valor del frontmatter según los criterios del módulo 13.

**Limitaciones.**
En qué poblaciones no aplica, qué no se ha estudiado, qué margen de error tiene.

**Interpretaciones NO admisibles.**
Lista explícita de conclusiones que el dato **no** autoriza, aunque parezca sugerirlas. Esta
sección es de lectura obligatoria para cualquier motor que consuma la ficha.

**Referencias.**
Claves de `_evidencia/referencias.yaml`. Nunca una cita escrita a mano aquí.
```

---

## Reglas de redacción

- **Descriptivo, nunca prescriptivo.** Esta base no recomienda. Describe.
- **Sin segunda persona.** Ni al cliente ni al profesional.
- **Sin vocabulario valorativo.** `ideal`, `óptimo`, `saludable`, `riesgoso`, `bueno`, `malo`
  no aparecen salvo dentro de una cita textual, y entonces van entrecomillados y atribuidos.
- **La incertidumbre se escribe.** «La evidencia es heterogénea» es una afirmación válida y
  frecuente; «se cree que» sin fuente, no.
- **Población siempre explícita.** Un hallazgo en pacientes en hemodiálisis no se enuncia como
  si aplicara a una persona entrenada sana. Esta es la confusión más fácil de cometer en esta
  base concreta y la que más daño haría aguas abajo.
